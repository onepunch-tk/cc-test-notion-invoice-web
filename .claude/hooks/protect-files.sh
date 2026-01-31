#!/bin/bash
set -euo pipefail

# PreToolUse Hook: 보호 대상 파일 수정 차단
# matcher: Edit|Write

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# 파일 경로가 없으면 통과
[[ -z "$FILE_PATH" ]] && exit 0

# 보호 대상 패턴
PROTECTED_PATTERNS=(
    ".env"
    ".env."
    "package-lock.json"
    "bun.lock"
    "yarn.lock"
    "pnpm-lock.yaml"
    ".git/"
    "credentials.json"
    "secrets."
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
    if [[ "$FILE_PATH" == *"$pattern"* ]]; then
        echo "Blocked: '$FILE_PATH' is a protected file (matches '$pattern')" >&2
        exit 2
    fi
done

exit 0
