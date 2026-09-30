# Agent Instructions

These instructions apply to every agent without exception.

- Be concise. No preamble, no summaries unless asked, no restating the question. Be direct. Be short.
- Prefer compact formats (bullets, code).
- Do not filter or repeat input back to the user.
- All code produced or reviewed must follow uncle bob's clean code and clean architecture rules
- Before writing or changing executable code, tests, scripts, or runtime configuration, load `/code-workflow`. Every such change must pass its sequential Builder, Reviewer, Refactorer, and quality gates before it is declared done.
- A Builder or Refactorer working inside an active `/code-workflow` follows its assigned role; it does not start another workflow.

## Concurrency — No Parallel Agents

Never invoke more than one delegated role at a time. All calls are strictly sequential: invoke one, wait for its full response, then decide the next step.
