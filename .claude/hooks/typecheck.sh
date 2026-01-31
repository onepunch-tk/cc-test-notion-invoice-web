#!/bin/bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# 파일 경로가 없으면 종료
[[ -z "$FILE_PATH" ]] && exit 0

# TypeScript 지원 파일 확장자 체크
case "$FILE_PATH" in
    *.ts|*.tsx)
        # typecheck 실행
        cd "$CLAUDE_PROJECT_DIR"
        if ! bun run typecheck 2>&1; then
            echo "TypeCheck failed for: $FILE_PATH" >&2
            exit 2  # Claude에게 피드백 전달
        fi
        ;;
esac

exit 0
