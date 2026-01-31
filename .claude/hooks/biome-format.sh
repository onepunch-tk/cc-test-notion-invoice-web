#!/bin/bash
set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# 파일 경로가 없으면 종료
[[ -z "$FILE_PATH" ]] && exit 0

# Biome 지원 파일 확장자 체크
case "$FILE_PATH" in
    *.js|*.jsx|*.ts|*.tsx|*.json|*.css|*.graphql|*.gql)
        # biome format 실행 (bunx 사용)
        bunx biome format --write "$FILE_PATH" 2>/dev/null || true
        ;;
esac

exit 0
