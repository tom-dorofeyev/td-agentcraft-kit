---
name: code-workflow
description: Run every executable code change through sequential Builder, Reviewer, and Refactorer roles and all quality gates, with or without a formal plan.
---

# Code Workflow

Use this workflow for every change to executable code, tests, scripts, or runtime configuration. A clear user request is sufficient scope; use approved criteria or architecture when supplied. Do not start a planning or approval cycle solely to run this workflow.

Load `/proof-of-work` before editing. The caller owns this workflow. Use `/specialized-agent` for each leaf role, one at a time, and wait for its result before the next handoff. Keep each task bounded to the current change. If a required role is unavailable, report the broken workflow and do not claim completion.

If the analysis tools needed by `/static-code-analysis` are unavailable, run `/preflight` to establish them before the gate. A skipped or unavailable tool is not a passing gate.

For each change:

1. **Builder** implements the requested behavior and its requirement-focused evidence.
2. **Reviewer: Scope Review** checks the result against the request or approved criteria. Resolve missing, incorrect, extra, or unproven behavior.
3. **Reviewer: Quality/Architecture Review** checks code quality, tests, security, and architecture. Resolve blocking findings.
4. **Refactorer** measures complexity, duplication, and changed-line coverage through `/static-code-analysis`; refactors only when a measurable improvement is warranted. A clean result is a valid no-change outcome.
5. Run the focused behavior check and the project's build, lint or type checks, and full relevant test suite when available. Re-run affected reviews and checks after any fix or refactor.

Return unresolved findings to Builder and repeat the sequence, up to five cycles. If the limit is reached or a required gate cannot pass, report the blocker and leave the change incomplete. Do not move to another planned slice with an unresolved failure.

Completion requires the requested behavior, no blocking review findings, passing `/static-code-analysis`, passing behavior-focused evidence from `/proof-of-work`, and passing project checks and full relevant test suite when available. Report the exact verification commands and results, review outcome, metrics, and any remaining limitations.
