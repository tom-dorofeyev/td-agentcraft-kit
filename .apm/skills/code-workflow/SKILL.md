---
name: code-workflow
description: Run every executable code change through sequential Builder, Reviewer, and Refactorer roles and all quality gates, with or without a formal plan.
---

# Code Workflow

Use this workflow for every change to executable code, tests, scripts, or runtime configuration. A clear user request is sufficient scope; use approved criteria or architecture when supplied. Do not start a planning or approval cycle solely to run this workflow.

Load `/proof-of-work` before editing. The caller owns this workflow. Use `/specialized-agent` for each leaf role, one at a time, and wait for its result before the next handoff. Keep each task bounded to the current change. If a required role is unavailable, report the broken workflow and do not claim completion.

Every delegation in this workflow starts a fresh session, including initial calls, corrections, targeted reviews, and repeated calls to the same role. Never pass prior delegate task or session IDs, or use CLI resume, continue, or reuse commands or switches. Polling a live task for its result is allowed; starting another task in its session is not. If a fresh delegate cannot be created, report a blocker; do not reuse a session or bypass delegation locally.

If the analysis tools needed by `/static-code-analysis` are unavailable, run `/preflight` to establish them before the gate. A skipped or unavailable tool is not a passing gate.

For each change, the caller retains progress and maintains a stable findings list in the session (and in existing formal evidence when applicable; no new mandatory files). Give each finding a per-change ID, originating review type, severity, explicit blocking or nonblocking disposition, evidence and location, concrete resolution condition, status (open or closed), and closure evidence when closed. Preserve IDs and unaffected approvals across corrections. Do not drop or renumber findings, or reopen a closed finding without new evidence. A genuinely new blocking defect or regression may be added with evidence; optional preferences are nonblocking. Clean Code, Clean Architecture, and security violations remain blocking. Give each fresh delegate a compact, self-contained handoff with scope and change delta, relevant finding IDs and resolution conditions, and applicable prior approvals and verification evidence.

Run the initial stages in order, with separate reviews:

1. **Builder** implements the requested behavior and its requirement-focused evidence.
2. **Reviewer: Scope Review** checks the result against the request or approved criteria. Resolve missing, incorrect, extra, or unproven behavior.
3. **Reviewer: Quality/Architecture Review** checks code quality, tests, security, and architecture. Resolve blocking findings.
4. **Refactorer** measures complexity, duplication, and changed-line coverage through `/static-code-analysis`; refactors only when a measurable improvement is warranted. A clean result is a valid no-change outcome.
5. Run the focused behavior check and the project's build, lint or type checks, and full relevant test suite when available.

For corrections, return open blockers to Builder with their IDs and resolution conditions; Builder fixes them and reports change and proof evidence. After a fix or refactor, request targeted re-review from each relevant Reviewer type: verify closure of its unresolved IDs and examine the change delta and regression impact within that review type. The caller updates the findings list only after the relevant Reviewer verifies closure with evidence. Retain unaffected approvals; broaden a review when changed scope, architecture, or impact invalidates its approval or the impact cannot be bounded. A previously unperformed initial stage still requires its full first pass, never a targeted substitute. Keep Scope Review and Quality/Architecture Review separate; do not weaken either gate. Re-run affected checks after corrections, including `/static-code-analysis` and `/proof-of-work` evidence where applicable, and complete all required final project checks. Count the initial sequence and each correction pass toward the five-cycle cap; do not restart the count on targeted re-review. If the limit is reached or a required gate cannot pass, report the blocker and leave the change incomplete. Do not move to another planned slice with an unresolved failure.

### Cycle artifacts

- Caller tracks exact created paths across sessions; delegates return paths. No new tracking file required. Track jscpd and separate ESLint directories, even with `--report-dir`.
- Every cycle, including blocked exits: record commands, results, metrics, findings in session/applicable formal evidence. Evidence must survive artifact deletion.
- After producers/consumers finish, delete unnecessary workflow-owned artifacts by exact exclusive path. No shared-parent deletion or glob sweeps.
- Retain failure reports across cycles until verified resolution and evidence capture; then delete unless explicitly retained.
- Never delete preexisting files, other runs' or active artifacts, deliverables, explicitly retained evidence. Unclear ownership or cleanup failure: preserve files, report limitation.

Completion requires the requested behavior, no blocking review findings, passing `/static-code-analysis`, passing behavior-focused evidence from `/proof-of-work`, and passing project checks and full relevant test suite when available. Report the exact verification commands and results, review outcome, metrics, and any remaining limitations.
