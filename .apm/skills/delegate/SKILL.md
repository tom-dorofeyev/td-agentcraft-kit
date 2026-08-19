---
name: delegate
description: This skill delegates tasks to subagents via CLI command. Prefer the harness's native delegation/subagent system when available. Use this skill as a fallback when native delegation is unavailable or restricted, including from within another subagent.
---

## Agents

Supported CLIs:

* OpenCode: `opencode run "<task>"`
* Codex: `codex exec "<task>"`

If the user specifies an agent, use it. Otherwise, use an appropriate installed CLI available in the current environment.

For a specifically named OpenCode agent:

```text
opencode run --agent <agent-name> "<task>"
```

Only use `--agent` when the user requested that agent or the environment clearly defines it.

Use additional CLI options only when directly relevant.

## Procedure

When delegation is requested:

1. Identify the task to delegate.
2. Choose the requested or available agent CLI.
3. Give it a self-contained, bounded prompt with the necessary context.
4. Run the CLI directly using the harness's command-execution tool.
5. Wait for completion and inspect the output.
6. Verify important claims or file changes when practical.
7. Return the useful findings, changes, validation, errors, and unresolved issues to the caller.

Delegated agents may modify files when required and permitted.

## Prompting

Tell the delegated agent:

* what task to complete;
* to work in the relevant current project/workspace;
* to inspect files and run tests or commands when useful;
* to report what it did, important findings, files changed, validation performed, and unresolved issues.

Include only relevant caller context. Do not dump unrelated conversation history or blindly add boilerplate.

## Execution

Invoke agent CLIs directly and keep commands cross-platform.

Good:

```text
opencode run "Investigate the failing authentication tests, fix the root cause, run the relevant tests, and report what changed."
```

```text
codex exec "Review the authentication implementation for security issues and report concrete findings."
```

Avoid shell-specific orchestration such as:

```text
cd path && opencode run ...
result=$(codex exec ...)
```

Use the harness's working-directory, argument, and output-capture features instead. Do not create wrapper scripts or orchestration infrastructure unless explicitly requested.

Run the agent from the directory relevant to the task.

## Nested delegation

A delegated agent may use `/delegate` again only when another delegation level is explicitly requested or genuinely necessary to fulfill the delegated task.

Avoid unnecessary delegation chains.

## Failures

Treat delegated output as subordinate work, not unquestionable truth.

If the CLI is unavailable, authentication fails, a requested agent does not exist, or permissions prevent execution, report that directly. Never imply delegation succeeded when it did not.

## Principle

`/delegate` means: choose the appropriate installed agent CLI, give it a clear bounded task, run it directly, inspect the result, and use that result in the current task.
