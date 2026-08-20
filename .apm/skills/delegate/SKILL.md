---
name: delegate
description: Delegate one bounded task. Prefer native subagent delegation; use a CLI only when native delegation is unavailable or restricted.
---

## Choose the mechanism

Use the harness's native subagent delegation whenever it is available. Use a CLI fallback only when it is unavailable or restricted.

Supported fallbacks:

* OpenCode: `opencode run "<task>"`
* Codex: `codex exec --ephemeral "<task>"`

For a named OpenCode agent, use `opencode run --agent <agent-name> "<task>"` only when the environment defines that agent or the caller requests it.

## Delegate once

1. Give one self-contained, bounded task with only relevant context.
2. Require the delegate to work in the relevant workspace, inspect or validate when useful, and report findings, changes, validation, and unresolved issues.
3. Run it directly through the harness's command tool, wait for completion, and inspect its output.
4. Verify important claims or file changes when practical.

A CLI delegate is a leaf: its prompt must say **do not invoke `/delegate`, spawn subagents, or run an agent CLI**. It must complete the assigned task directly. Never create a delegation chain unless the caller explicitly requests one.

Use the harness working directory and output capture; do not create wrapper scripts or shell orchestration. Treat the result as subordinate work, not unquestionable truth.

If the CLI, requested agent, authentication, or permissions are unavailable, report the failure. Do not claim delegation succeeded.
