#!/usr/bin/env bash

set -euo pipefail

if IFS= read -r unexpected_input; then
  printf 'Agent stdin must be closed for unattended execution.\n' >&2
  exit 1
fi

case "${0##*/}" in
  codex) [[ "$#" == 3 && "$1" == exec && "$2" == --dangerously-bypass-approvals-and-sandbox ]] ;;
  opencode) [[ "$#" == 3 && "$1" == run && "$2" == --auto ]] ;;
  copilot) [[ "$#" == 4 && "$1" == --allow-all && "$2" == --no-ask-user && "$3" == -p ]] ;;
esac

readonly agent_prompt="${!#}"
[[ "$agent_prompt" == *"Do not ask the user questions or wait for input."* ]]
readonly work_item_directory="${agent_prompt#* at }"
readonly canonical_directory="${work_item_directory% using the implementer skill.*}"

printf '%s\n' "$canonical_directory" >>"$CALL_LOG"
if [[ -n "${MOCK_EXIT_STATUS:-}" ]]; then
  exit "$MOCK_EXIT_STATUS"
fi
if [[ -n "${ARGUMENT_COUNT_LOG:-}" ]]; then
  printf '%s\n' "$#" >>"$ARGUMENT_COUNT_LOG"
fi
mkdir -p "$canonical_directory/done"
mv "$canonical_directory/todo/work-item.md" "$canonical_directory/done/work-item.md"
