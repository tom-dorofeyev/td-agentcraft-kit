---
name: fast-path
description: Lightweight workflow for low-risk, isolated changes (≤ 3 files, no new abstractions): engineer implements, the Team Leader verifies measurable checks first, reviewer evaluates judgment-based concerns, and the Team Leader closes the slice.
---

# Fast Path Workflow

For **bug fixes, copy/text changes, single-function tweaks, config updates, or documentation edits** that touch ≤ 3 files and introduce no new abstractions.

## Eligibility Checklist (all must be true)

- [ ] The change is isolated to ≤ 3 files.
- [ ] No new interfaces, patterns, or architectural boundaries are introduced.
- [ ] The intent is unambiguous — no clarification needed.
- [ ] Risk of regression is low (covered by existing tests).

If any item is false, this workflow does not apply. Return to the team leader to select the appropriate execution path.

## Execution

| Step | Agent | Deliverable |
|---|---|---|
| 1 | Software Engineer | Implement the change + self-review checklist with concise verification notes |
| 2 | Team Leader | Run measurable checks first and fail fast on build, test, static-analysis, or coverage issues |
| 3 | Code Reviewer | Review the implementation artifact and return an approval or rejection |
| 4 | Team Leader | Confirm the change satisfies stated intent and close the slice |

## Self-Review Checklist (Software Engineer)

The engineer must complete all of the following before submitting:

1. Run the project build command. Record the command and exit status — zero failures required.
2. Run the full test suite. Record the command and exit status — zero failures required.
3. If the project already has a working coverage command/report, record how the Team Leader should run or inspect it. If the project has no coverage infrastructure, mark this check `N/A`.
4. Confirm the change touches ≤ 3 files.
5. Confirm no new abstractions, interfaces, or layer boundaries were introduced.
6. Confirm existing tests cover the changed behavior. Any new behavior must have at least one automated test.
7. Run the engineer-owned static-analysis and coverage checks required by the Software Engineer contract, and record the commands, exit status, and any availability notes.

A fast-path slice with no Team Leader-verifiable proof on record is **not done** and is rejected immediately.

## Final Intent Check (Team Leader)

The Team Leader verifies:

- The change satisfies its stated intent.
- No obvious regressions in adjacent behavior.
- The Team Leader verification summary shows zero failures for the required measurable checks.

This is a targeted close-out check only; it does not introduce a separate downstream agent or full test-plan pass.
