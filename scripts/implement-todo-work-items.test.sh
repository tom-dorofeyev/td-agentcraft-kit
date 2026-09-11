#!/usr/bin/env bash

set -euo pipefail

readonly scripts_directory="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly runner="$scripts_directory/implement-todo-work-items.sh"
readonly mock_codex="$scripts_directory/test-fixtures/mock-codex-completes-work-item.sh"
readonly incomplete_mock_codex="$scripts_directory/test-fixtures/mock-codex-leaves-work-item-in-todo.sh"
readonly test_directory="$(mktemp -d)"
readonly work_items_root="$test_directory/work-items"
readonly call_log="$test_directory/calls.log"
readonly argument_count_log="$test_directory/argument-counts.log"

cleanup() {
  rm -rf "$test_directory"
}

trap cleanup EXIT

mkdir -p "$test_directory/bin" "$work_items_root/task/alpha/todo" "$work_items_root/task/beta/todo"
printf 'alpha\n' >"$work_items_root/task/alpha/todo/work-item.md"
printf 'beta\n' >"$work_items_root/task/beta/todo/work-item.md"
ln -s "$mock_codex" "$test_directory/bin/codex"

PATH="$test_directory/bin:$PATH" CODEX_SESSION_ID=test AGENT_CRAFT_WORK_ROOT="$work_items_root" CALL_LOG="$call_log" ARGUMENT_COUNT_LOG="$argument_count_log" "$runner"

[[ "$(sed -n '1p' "$call_log")" == "$work_items_root/task/alpha" ]]
[[ "$(sed -n '2p' "$call_log")" == "$work_items_root/task/beta" ]]
[[ -f "$work_items_root/task/alpha/done/work-item.md" ]]
[[ -f "$work_items_root/task/beta/done/work-item.md" ]]
[[ "$(sed -n '1p' "$argument_count_log")" == '3' ]]

mkdir -p "$work_items_root/task/gamma/todo"
printf 'gamma\n' >"$work_items_root/task/gamma/todo/work-item.md"
ln -s "$mock_codex" "$test_directory/bin/opencode"
PATH="$test_directory/bin:$PATH" AGENT_CRAFT_WORK_ROOT="$work_items_root" CALL_LOG="$call_log" ARGUMENT_COUNT_LOG="$argument_count_log" "$runner" --harness opencode
[[ -f "$work_items_root/task/gamma/done/work-item.md" ]]
[[ "$(sed -n '3p' "$argument_count_log")" == '3' ]]

mkdir -p "$work_items_root/task/epsilon/todo"
printf 'epsilon\n' >"$work_items_root/task/epsilon/todo/work-item.md"
PATH="$test_directory/bin:$PATH" AGENT_CRAFT_WORK_ROOT="$work_items_root" CALL_LOG="$call_log" "$runner" --dry-run --harness codex
[[ -f "$work_items_root/task/epsilon/todo/work-item.md" ]]

mkdir -p "$work_items_root/task/delta/todo"
printf 'delta\n' >"$work_items_root/task/delta/todo/work-item.md"
ln -sf "$incomplete_mock_codex" "$test_directory/bin/codex"
if PATH="$test_directory/bin:$PATH" AGENT_CRAFT_WORK_ROOT="$work_items_root" CALL_LOG="$call_log" "$runner" --harness codex; then
  printf 'Expected incomplete work item to stop the runner.\n' >&2
  exit 1
fi
[[ "$(sed -n '4p' "$call_log")" == "$work_items_root/task/delta" ]]
[[ -f "$work_items_root/task/epsilon/todo/work-item.md" ]]

mkdir -p "$test_directory/project/scripts" "$test_directory/project/.agent-craft-work/task/copied/todo"
cp "$runner" "$test_directory/project/scripts/runner.sh"
touch "$test_directory/project/.agent-craft-work/task/copied/todo/work-item.md"
ln -sf "$mock_codex" "$test_directory/bin/codex"
(
  cd "$test_directory/project"
  unset AGENT_CRAFT_WORK_ROOT
  PATH="$test_directory/bin:$PATH" CALL_LOG="$call_log" \
    bash scripts/runner.sh --harness codex <<< 'terminal-input'
)
[[ -f "$test_directory/project/.agent-craft-work/task/copied/done/work-item.md" ]]

mkdir -p "$test_directory/copilot-work/task/one/todo" "$test_directory/copilot-work/task/two/todo"
touch "$test_directory/copilot-work/task/one/todo/work-item.md" "$test_directory/copilot-work/task/two/todo/work-item.md"
ln -s "$mock_codex" "$test_directory/bin/copilot"
PATH="$test_directory/bin:$PATH" AGENT_CRAFT_WORK_ROOT="$test_directory/copilot-work" CALL_LOG="$call_log" \
  "$runner" --harness copilot <<< 'must not reach the agent'
[[ -f "$test_directory/copilot-work/task/one/done/work-item.md" ]]
[[ -f "$test_directory/copilot-work/task/two/done/work-item.md" ]]

mkdir -p "$test_directory/failed-work/task/one/todo" "$test_directory/failed-work/task/two/todo"
touch "$test_directory/failed-work/task/one/todo/work-item.md" "$test_directory/failed-work/task/two/todo/work-item.md"
failure_status=0
PATH="$test_directory/bin:$PATH" AGENT_CRAFT_WORK_ROOT="$test_directory/failed-work" \
  CALL_LOG="$test_directory/failure.log" MOCK_EXIT_STATUS=42 "$runner" --harness codex || failure_status=$?
[[ "$failure_status" == 42 ]]
[[ "$(wc -l < "$test_directory/failure.log" | tr -d ' ')" == 1 ]]
[[ -f "$test_directory/failed-work/task/two/todo/work-item.md" ]]

printf 'Runner tests passed.\n'
