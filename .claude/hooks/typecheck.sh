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
        # 패키지매니저 감지
        if [[ -f "bun.lock" ]]; then PKG_CMD="bun run"
        elif [[ -f "pnpm-lock.yaml" ]]; then PKG_CMD="pnpm run"
        elif [[ -f "yarn.lock" ]]; then PKG_CMD="yarn"
        else PKG_CMD="npm run"; fi

        if ! $PKG_CMD typecheck 2>&1; then
            echo "TypeCheck failed for: $FILE_PATH" >&2
            exit 2
        fi
        ;;
esac

exit 0
