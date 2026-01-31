#!/bin/bash
set -euo pipefail

# PreToolUse Hook: 위험한 명령어 차단
# matcher: Bash

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# 명령어가 없으면 통과
[[ -z "$COMMAND" ]] && exit 0

# 위험한 패턴 목록
DANGEROUS_PATTERNS=(
    "rm -rf /"
    "rm -rf ~"
    "rm -rf \."
    "sudo "
    "chmod 777"
    "> /dev/"
    "dd if="
    ":\(\){:|:&};:"
    "mkfs\."
    "curl.*\|.*sh"
    "wget.*\|.*sh"
    "--force"
    "reset --hard"
    "push --force"
    "push -f"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
    if echo "$COMMAND" | grep -qE "$pattern"; then
        echo "Blocked: Command contains dangerous pattern '$pattern'" >&2
        echo "Command: $COMMAND" >&2
        exit 2
    fi
done

exit 0
