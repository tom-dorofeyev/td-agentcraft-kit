---
name: fast-path
description: Lightweight workflow for low-risk, isolated changes (≤ 3 files, no new abstractions): engineer implements, reviewer evaluates, QA spot-checks.
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
| 1 | Software Engineer | Implement the change + self-review checklist with attached proof |
| 2 | Code Reviewer | Review the implementation artifact and return an approval or rejection |
| 3 | QA Engineer | Spot-check against stated intent and existing acceptance criteria |

## Self-Review Checklist (Software Engineer)

The engineer must complete all of the following before submitting:

1. Run the project build command. Attach the raw stdout/stderr — zero failures required.
2. Run the full test suite. Attach the raw stdout/stderr — zero failures required.
3. If the project already has a working coverage command/report, record how the reviewer should run or inspect it. If the project has no coverage infrastructure, mark this check `N/A`.
4. Confirm the change touches ≤ 3 files.
5. Confirm no new abstractions, interfaces, or layer boundaries were introduced.
6. Confirm existing tests cover the changed behavior. Any new behavior must have at least one automated test.
7. Run the engineer-owned static-analysis and coverage checks required by the Software Engineer contract, and attach the results or mark why a check is unavailable.

A fast-path slice with no proof attached is **not done** and is rejected immediately.

## QA Spot-Check (QA Engineer)

The QA Engineer verifies:

- The change satisfies its stated intent.
- No obvious regressions in adjacent behavior.
- Proof of work (build + test output) is attached and shows zero failures.

QA does not re-run a full test plan — this is a targeted spot-check only.
