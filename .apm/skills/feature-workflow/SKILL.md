---
name: feature-workflow
description: Plan approved working slices, then run the AFK loop per slice until criteria pass.
---

# Feature Workflow

Use for work beyond a one-liner: plan with user, then deliver working, reviewed, clean, tested slices.

## Scope

| Scope | Planner output | Implementer path |
|---|---|---|
| **Small** | Lightweight spec + criteria | One working slice; direct loop/review. |
| **Medium** | PRD or technical spec + HLD/LLD | Ordered slices; full AFK loop per slice. |
| **Large** | Phased MVP spec + architecture | Current-phase slices; checkpoint per phase. |

## Flow

`Planner → Approved docs + slices → Implementer → AFK loop per slice`

## Planner

### Small

Lightweight spec:
- Build.
- Decisions/constraints.
- Criteria.
- Single working, committable slice unless unsafe.

### Medium

- **product-specialist** → PRD: epics, stories, Gherkin.
- **architect** → conceptual HLD/LLD: components, dependencies, contracts, abstractions.
- **Planner** → ordered slices: approved scope/criteria, dependencies, working outcome, proof. Epics may contain many slices.

### Large

- **product-specialist** → phased PRD: MVP detailed, future summaries.
- **architect** → phased architecture: MVP detailed, future light.
- **Planner** → ordered current-phase slices; each working and committable.
- Output: folder/epic. MVP slices ready; future refined later.

### Gate

User approves artifacts and slices. Hand off to Implementer.

## Implementer

Divide approved scope into small, working, committable slices. No pauses mid-loop or between slices. Each maps to approved criteria, works end-to-end where applicable, and passes its loop before next. Never batch all plan work.

### Full Loop

`Builder → Plan Review → Quality/Architecture Review → Refactorer → Acceptance Tests`

Run per slice. Failed gate returns to Builder for same slice; later slices wait.

1. **Builder** — implement per architecture.
2. **Reviewer: Plan Review** — slice scope, criteria, required behavior/tests; severity: blocking, high, medium, low.
3. **Reviewer: Quality/Architecture Review** — clean code, security, tests, architecture; severity: blocking, high, medium, low.
4. **Refactorer** — `static-code-analysis`; enforce thresholds.
5. **Acceptance Tests** — slice Gherkin, then full suite. All pass.

| Cycle | Fix |
|---|---|
| 1–2 | All findings + metrics |
| 3 | Blocking, high + metrics |
| 4–5 | Blocking + metrics |

### Slice Gate

- Slice criteria and metrics pass; no blocking findings.
- Build and full suite pass.
- Slice works independently and is committable.

**Cap: 5 cycles/slice.**

### Lightweight Loop

1. Builder.
2. Reviewer: Plan Review.
3. Reviewer: Quality/Architecture Review.
4. Fix blocking issues; re-review, max 2 cycles.
5. Verify criteria, build, full suite.
6. Refactor if complexity/duplication flagged.

## Responsibilities

### Planner

- Gather requirements; load `grill-me` if vague.
- Set plan depth with user.
- Produce approved artifacts and ordered slices; never monolithic handoff.
- Large: MVP first; hand off current phase only.

### Implementer

- Run `preflight`.
- Execute current scope, slice by slice.
- Track caps; notify via `notify`.
- Phase completion: checkpoint.

## Escalation

Report failure, blockers/metrics/tests, attempts, next action. Return to Planner if plan needs revision; else user.
