#!/usr/bin/env bash

set -euo pipefail

readonly repository_root="$PWD"
readonly work_items_root="${AGENT_CRAFT_WORK_ROOT:-$repository_root/.agent-craft-work}"

dry_run=false
agent_command=""
agent_arguments=()
requested_harness=""

print_usage() {
  printf 'Usage: %s [--dry-run] [--harness codex|opencode|copilot]\n' "${0##*/}"
}

parse_arguments() {
  while (($#)); do
    case "$1" in
      --dry-run) dry_run=true ;;
      --harness)
        requested_harness="${2:?Missing harness name}"
        shift
        ;;
      --help)
        print_usage
        exit 0
        ;;
      *)
        print_usage >&2
        exit 2
        ;;
    esac
    shift
  done
}

detect_active_harness() {
  if [[ -n "${CODEX_SESSION_ID:-}" ]]; then
    printf 'codex'
  elif [[ -n "${OPENCODE_CONFIG:-}${OPENCODE_SERVER:-}" ]]; then
    printf 'opencode'
  elif [[ -n "${COPILOT_DEBUG_NONCE:-}${COPILOT_SESSION_ID:-}" ]]; then
    printf 'copilot'
  fi
}

configure_agent_command() {
  local active_harness="${requested_harness:-$(detect_active_harness)}"

  case "$active_harness" in
    codex)
      agent_command=codex
      agent_arguments=(exec --dangerously-bypass-approvals-and-sandbox)
      ;;
    opencode)
      agent_command=opencode
      agent_arguments=(run --auto)
      ;;
    copilot)
      agent_command=copilot
      agent_arguments=(--allow-all --no-ask-user -p)
      ;;
    *)
      printf 'No active coding harness detected. Use --harness codex|opencode|copilot.\n' >&2
      return 2
      ;;
  esac
}

run_work_item() {
  local todo_file="$1"
  local work_item_directory="${todo_file%/todo/work-item.md}"
  local agent_prompt

  agent_prompt="Pick up and implement the formal work item at $work_item_directory using the implementer skill. Complete its full workflow, including all required quality gates. Move its work-item.md to done only when the work item is complete."
  agent_prompt+=" This is an unattended run. Do not ask the user questions or wait for input. Resolve routine implementation choices within the approved scope. If blocked by missing information, credentials, denied permissions, or failing gates you cannot resolve, record the blocker in the work item, leave it incomplete, and end the session."
  printf 'Processing %s\n' "$work_item_directory"

  if [[ "$dry_run" == true ]]; then
    printf 'Would run: %s' "$agent_command"
    if ((${#agent_arguments[@]})); then
      printf ' %q' "${agent_arguments[@]}"
    fi
    printf ' %q' "$agent_prompt"
    printf '\n'
    return
  fi

  "$agent_command" "${agent_arguments[@]}" "$agent_prompt" </dev/null 3<&-

  if [[ ! -f "$work_item_directory/done/work-item.md" || -e "$todo_file" ]]; then
    printf 'Work item did not reach done: %s\n' "$work_item_directory" >&2
    return 1
  fi
}

main() {
  local todo_file
  local work_item_count=0

  parse_arguments "$@"
  configure_agent_command

  if [[ ! -d "$work_items_root" ]]; then
    printf 'No formal work-item directory found at %s\n' "$work_items_root"
    return
  fi

  if [[ "$dry_run" == false ]] && ! command -v "$agent_command" >/dev/null 2>&1; then
    printf 'Coding-agent command not found: %s\n' "$agent_command" >&2
    return 127
  fi

  while IFS= read -r todo_file <&3; do
    run_work_item "$todo_file"
    ((work_item_count += 1))
  done 3< <(find "$work_items_root" -type f -path '*/todo/work-item.md' | LC_ALL=C sort)

  if ((work_item_count == 0)); then
    printf 'No todo work items found.\n'
  else
    printf 'Processed %d work item(s).\n' "$work_item_count"
  fi
}

main "$@"
