---
name: delegate
description: Delegate one bounded task. Prefer native subagent delegation; use a CLI only when native delegation is unavailable or restricted.
---

## Choose the mechanism

Use the harness's native subagent delegation whenever it is available. Use a CLI fallback only when it is unavailable or restricted to the current caller. Do not use the CLI to continue work that another agent already delegated to you.

Supported fallbacks:

* OpenCode: `opencode run "<task>"`
* Codex: `codex exec --ephemeral "<task>"`

For a named OpenCode agent, use `opencode run --agent <agent-name> "<task>"` only when the environment defines that agent or the caller requests it.

When the caller supplies a model for this task, pass it with `--model <model>` to the OpenCode or Codex CLI. If no model is supplied, omit the flag so the runtime keeps its default. Native named agents use their own frontmatter model; do not override it at the call site.

## Delegate once

1. Give one self-contained, bounded task with only relevant context.
2. Require the delegate to work in the relevant workspace, inspect or validate when useful, and report findings, changes, validation, and unresolved issues.
3. Run it directly through the harness's command tool, wait for completion, and inspect its output.
4. Verify important claims or file changes when practical.

A generic or Investigator CLI delegate is a leaf: its prompt must say **do not invoke `/delegate`, spawn subagents, or run an agent CLI**. For a non-Investigator specialist assigned through `/specialized-agent`, the prompt instead permits only bounded, sequential native Investigator discovery if supported; it forbids `/delegate` and nested agent CLIs. If native discovery is unavailable, the specialist returns a bounded missing-context question to its caller rather than searching broadly or starting another CLI. Wait for each native result before continuing. Use CLI only for work that needs a distinct agent session; never create a nested CLI chain, even when the caller requests one.

Use the harness working directory and output capture; do not create wrapper scripts or shell orchestration. Treat the result as subordinate work, not unquestionable truth.

If the CLI, requested agent, authentication, or permissions are unavailable, report the failure. Do not claim delegation succeeded.
