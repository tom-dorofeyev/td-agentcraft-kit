---
name: code-workflow
description: Run every executable code change through sequential Builder, two Reviser tasks, and Refactorer with all quality gates, with or without a formal plan.
---

# Code Workflow

Use this workflow for every change to executable code, tests, scripts, or runtime configuration. A clear user request is sufficient scope; use approved criteria or architecture when supplied. Do not start a planning or approval cycle solely to run this workflow.

Load `/proof-of-work` before editing. The caller owns this workflow. Use `/specialized-agent` for each specialist role, one at a time, and wait for its result before the next handoff. Keep each task bounded to the current change. If a required role is unavailable, report the broken workflow and do not claim completion.

Every delegation in this workflow starts a fresh session, including each distinct Reviser review type. Never pass prior delegate task or session IDs, or use CLI resume, continue, or reuse commands or switches. Polling a live task for its result is allowed; starting another task in its session is not. If a fresh delegate cannot be created, report a blocker; do not reuse a session or bypass delegation locally.

If the analysis tools needed by `/static-code-analysis` are unavailable, run `/preflight` to establish them before the gate. A skipped or unavailable tool is not a passing gate.

For each change, the caller retains progress and maintains a stable findings list in the session (and in existing formal evidence when applicable; no new mandatory files). Give each finding a per-change ID, originating review type, severity, explicit blocking or nonblocking disposition, evidence and location, concrete resolution condition, status (open or closed), and closure evidence when closed. Preserve IDs and unaffected approvals across stages; do not drop or renumber findings, or reopen a closed finding without new evidence. A genuinely new blocking defect or regression may be added with evidence; optional preferences are nonblocking. Apply the shared engineering-workflow scope policy: block on introduced or worsened defects and necessary task blockers, not unrelated baseline issues or optional structural preferences. Record baseline failures honestly; keep unrelated security findings visible without automatic remediation. Give each fresh delegate a compact, self-contained handoff with scope and change delta, relevant finding IDs and resolution conditions, and applicable prior approvals and verification evidence.

Run once in this direction:

1. **Builder** implements the requested behavior and its requirement-focused evidence.
2. **Reviser: Scope Review** in its own task/session checks the result against the request or approved criteria: scope, requirements, acceptance criteria, architectural behavior, required tests, and proportionality. It checks that new files, layers, abstractions, and tests have a demonstrated need and that a cohesive one-file solution was not unnecessarily split. It fixes its own blocking findings and verifies its fixes and regression impact within scope before handing off.
3. **Reviser: Quality/Architecture Review** in a fresh task/session checks implementation quality, security, tests, architecture, and simplicity. It looks for over-engineered file boundaries, indirection, extension points, scaffolding, and duplicate or implementation-detail tests. It fixes its own blocking findings, verifies its fixes and regression impact within quality/architecture, and confirms the prior scope approval remains valid.
4. **Refactorer** measures complexity, duplication, and changed-line coverage through `/static-code-analysis`; refactors only when a measurable improvement in this change is warranted. Simplifying unnecessary new layers is valid; a clean result is a successful no-change outcome. Do not hunt unrelated cleanup. Verify any changes and preserve both Reviser approvals.
5. Run the focused behavior check and the project's build, lint or type checks, and full relevant test suite when available.

Within each Reviser task, bounded fix/verify is allowed; each Reviser closes its own findings only with evidence. A downstream stage verifies its own change delta and regression impact against prior approvals, including scope behavior; it does not request an upstream correction or targeted re-review. Keep Scope Review and Quality/Architecture Review separate; do not weaken either gate. Re-run affected checks after changes, including `/static-code-analysis` and `/proof-of-work` evidence where applicable, and complete all required final project checks. If a stage cannot resolve a blocker within its boundary, a prior invariant is invalidated, or a final gate fails, stop and report incomplete rather than return to Builder or an earlier stage. Do not move to another planned slice with an unresolved failure.

### Stage artifacts

- Caller tracks exact created paths across sessions; delegates return paths. No new tracking file required. Track jscpd and separate ESLint directories, even with `--report-dir`.
- At every stage, including blocked exits: record commands, results, metrics, findings in session/applicable formal evidence. Evidence must survive artifact deletion.
- After producers/consumers finish, delete unnecessary workflow-owned artifacts by exact exclusive path. No shared-parent deletion or glob sweeps.
- Retain failure reports until verified resolution and evidence capture; then delete unless explicitly retained.
- Never delete preexisting files, other runs' or active artifacts, deliverables, explicitly retained evidence. Unclear ownership or cleanup failure: preserve files, report limitation.

Completion requires the requested behavior, no blocking review findings, passing `/static-code-analysis`, passing behavior-focused evidence from `/proof-of-work`, and passing project checks and full relevant test suite when available. Report the exact verification commands and results, review outcome, metrics, and any remaining limitations.
