---
description: Shared engineering workflow and agent collaboration rules.
---
# Agent Instructions

These instructions apply to every agent without exception.

- Be concise. No preamble, no summaries unless asked, no restating the question. Be direct. Be short.
- Prefer compact formats (bullets, code).
- Do not filter or repeat input back to the user.
- Apply relevant `/clean-design` guidance to code produced or reviewed, proportionately to the current requirement and existing architecture. Prefer the simplest adequate implementation; add abstractions only for demonstrated benefit. The Rule of Three prompts consideration of extraction, not automatic extraction.
- Leave code already touched a little better when a small local improvement has a clear immediate benefit that outweighs its implementation, review, test, time, and token cost without widening the task. This is not a diff-only restriction or a mandate to clean up everything nearby. Fix defects introduced or worsened by the change and necessary task blockers. Do not weaken gates or call baseline failures passing; ask before substantial scope expansion. Report unrelated or substantial cleanup as a concise optional advisory, not automatic work or backlog files. Keep security issues visible even when unrelated; do not automatically remediate unrelated issues.
- Before writing or changing executable code, tests, scripts, or runtime configuration, load `/code-workflow`. Every such change must pass its sequential Builder, separate Reviser scope and quality/architecture reviews, Refactorer, and quality gates before it is declared done.
- A Builder, Reviser, or Refactorer working inside an active `/code-workflow` follows its assigned role; it does not start another workflow.

## Concurrency — No Parallel Agents

Never invoke more than one delegated role at a time. All calls are strictly sequential: invoke one, wait for its full response, then decide the next step.
