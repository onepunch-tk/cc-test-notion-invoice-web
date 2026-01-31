#!/bin/bash
set -euo pipefail

# 환경 변수 로드
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[[ -f "$SCRIPT_DIR/.env.hooks" ]] && source "$SCRIPT_DIR/.env.hooks"

[[ -z "${SLACK_WEBHOOK_URL:-}" ]] && exit 1

INPUT=$(cat)

# 조건부 디버그 로깅 (DEBUG=1 설정 시에만 활성화)
if [[ "${DEBUG:-0}" == "1" ]]; then
    LOG_DIR="${SCRIPT_DIR}/logs"
    mkdir -p "$LOG_DIR"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $INPUT" >> "$LOG_DIR/claude-hook-debug.log"
fi

HOOK_EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // "unknown"')
NOTIFICATION_TYPE=$(echo "$INPUT" | jq -r '.notification_type // "unknown"')
FULL_SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')
SESSION_ID=$(echo "$FULL_SESSION_ID" | cut -c1-8)
CWD=$(echo "$INPUT" | jq -r '.cwd // "unknown"')
PERMISSION_MODE=$(echo "$INPUT" | jq -r '.permission_mode // "default"')
MESSAGE=$(echo "$INPUT" | jq -r '.message // ""')
PROJECT_NAME="${PROJECT_NAME:-$(basename "$CWD")}"
TIMESTAMP=$(date '+%H:%M:%S')

# CWD를 짧게 표시 (홈 디렉토리를 ~로 치환, bash 내장 문자열 치환 사용)
SHORT_CWD="${CWD/#$HOME/~}"

# session_id 검증 함수 (영숫자, 하이픈만 허용 - 명령어 인젝션 방지)
validate_session_id() {
    local id="$1"
    if [[ "$id" =~ ^[a-zA-Z0-9-]+$ ]]; then
        return 0
    fi
    return 1
}

# transcript 경로 검증 함수 (경로 조작 방지)
validate_transcript_path() {
    local path="$1"
    local resolved_path

    # 경로가 존재하고 일반 파일인지 확인
    [[ ! -f "$path" ]] && return 1

    # realpath로 실제 경로 확인 (심볼릭 링크 해석)
    resolved_path=$(realpath "$path" 2>/dev/null) || return 1

    # ~/.claude 디렉토리 내의 파일인지 확인
    local claude_dir
    claude_dir=$(realpath "$HOME/.claude" 2>/dev/null) || return 1

    if [[ "$resolved_path" == "$claude_dir"/* ]]; then
        return 0
    fi
    return 1
}

# transcript에서 마지막 assistant 메시지 추출 함수 (중복 제거)
# 구조: { "type": "assistant", "message": { "role": "assistant", "content": [{ "type": "text", "text": "..." }] } }
extract_last_assistant_message() {
    local file="$1"
    tail -50 "$file" 2>/dev/null | \
        jq -rs '[.[] | select(.type=="assistant")] | last | .message.content[] | select(.type=="text") | .text' 2>/dev/null | \
        head -1 | head -c 200
}

# jq를 사용하여 안전한 JSON payload 생성
build_payload() {
    local color="$1"
    local title="$2"
    local text="$3"

    jq -n \
        --arg color "$color" \
        --arg title "$title" \
        --arg text "$text" \
        --arg project "$PROJECT_NAME" \
        --arg time "$TIMESTAMP" \
        --arg mode "$PERMISSION_MODE" \
        --arg cwd "$SHORT_CWD" \
        --arg session "Session: $SESSION_ID" \
        '{
            attachments: [{
                color: $color,
                title: $title,
                text: $text,
                fields: [
                    { title: "Project", value: $project, short: true },
                    { title: "Time", value: $time, short: true },
                    { title: "Mode", value: $mode, short: true },
                    { title: "CWD", value: $cwd, short: true }
                ],
                footer: $session
            }]
        }'
}

send_slack() {
    # 타임아웃 설정: 연결 5초, 최대 10초
    curl -s -X POST -H 'Content-type: application/json' \
        --connect-timeout 5 \
        --max-time 10 \
        --data "$1" "$SLACK_WEBHOOK_URL" > /dev/null
}

case "$HOOK_EVENT" in
    "Notification")
        case "$NOTIFICATION_TYPE" in
            "permission_prompt")
                TEXT="${MESSAGE:-권한 승인이 필요합니다}"
                PAYLOAD=$(build_payload "#FFA500" ":key: 권한 요청" "$TEXT")
                send_slack "$PAYLOAD"
                ;;

            "idle_prompt")
                TEXT="${MESSAGE:-Claude Code가 사용자 입력을 기다리고 있습니다}"
                PAYLOAD=$(build_payload "#2196F3" ":bell: 입력 대기" "$TEXT")
                send_slack "$PAYLOAD"
                ;;

            "elicitation_dialog")
                TEXT="${MESSAGE:-Claude Code가 추가 정보를 요청합니다}"
                PAYLOAD=$(build_payload "#9C27B0" ":question: 정보 요청" "$TEXT")
                send_slack "$PAYLOAD"
                ;;
        esac
        ;;

    "Stop")
        # stop_hook_active 체크 (무한 루프 방지)
        STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
        if [[ "$STOP_HOOK_ACTIVE" == "true" ]]; then
            exit 0
        fi

        # 작업 요약 추출 시도
        SUMMARY=""

        # 방법 1: transcript_path가 제공된 경우 (경로 검증 포함)
        TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // ""')
        if [[ -n "$TRANSCRIPT_PATH" ]] && validate_transcript_path "$TRANSCRIPT_PATH"; then
            SUMMARY=$(extract_last_assistant_message "$TRANSCRIPT_PATH")
        fi

        # 방법 2: session_id로 transcript 파일 찾기 (session_id 검증 포함)
        if [[ -z "$SUMMARY" && "$FULL_SESSION_ID" != "unknown" ]] && validate_session_id "$FULL_SESSION_ID"; then
            # maxdepth 3으로 탐색 범위 제한 (성능 최적화)
            TRANSCRIPT_FILE=$(find ~/.claude -maxdepth 3 -name "${FULL_SESSION_ID}*.jsonl" 2>/dev/null | head -1)
            if [[ -n "$TRANSCRIPT_FILE" ]] && validate_transcript_path "$TRANSCRIPT_FILE"; then
                SUMMARY=$(extract_last_assistant_message "$TRANSCRIPT_FILE")
            fi
        fi

        # 요약이 있으면 포함, 없으면 기본 메시지
        if [[ -n "$SUMMARY" && "$SUMMARY" != "null" ]]; then
            # 줄바꿈을 공백으로 치환하고 앞뒤 공백 제거 (POSIX sed 호환)
            SUMMARY=$(echo "$SUMMARY" | tr '\n' ' ' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            if [[ ${#SUMMARY} -ge 200 ]]; then
                SUMMARY="${SUMMARY}..."
            fi
            TEXT=$'*완료된 작업:*\n'"${SUMMARY}"
        else
            TEXT="Claude Code 응답이 완료되었습니다"
        fi

        PAYLOAD=$(build_payload "#36A64F" ":white_check_mark: 응답 완료" "$TEXT")
        send_slack "$PAYLOAD"
        ;;
esac

exit 0
