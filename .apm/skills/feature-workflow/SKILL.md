---
name: feature-workflow
description: Plan material work, then run the AFK loop per slice until criteria pass.
---

# Feature Workflow

Use for work beyond a one-liner: plan material work with the user, then deliver working, reviewed, clean, tested slices. Clear, bounded small work may proceed directly.

## Scope

| Scope | Planner output | Implementer path |
|---|---|---|
| **Small** | Lightweight spec + criteria | One working slice; direct loop/review. |
| **Medium** | User-facing or technical spec + HLD/LLD | Ordered slices; full AFK loop per slice. |
| **Large** | Phased MVP plan + architecture | Current-phase slices; checkpoint per phase. |

## Flow

`Planner → confirmed docs + slices → Implementer → AFK loop per slice`

## Planner

### Small

Lightweight spec:
- Build.
- Decisions/constraints.
- Criteria.
- Single working, committable slice unless unsafe.

### Medium

- **product-specialist** → final Gherkin acceptance criteria from confirmed user-facing requirements.
- **architect** → conceptual HLD/LLD: components, dependencies, contracts, abstractions.
- **Planner** → ordered slices: approved scope/criteria, dependencies, working outcome, proof. Epics may contain many slices.

### Large

- **product-specialist** → final current-phase Gherkin acceptance criteria from confirmed requirements.
- **architect** → phased architecture: MVP detailed, future light.
- **Planner** → ordered current-phase slices; each working and committable.
- Output: folder/epic. MVP slices ready; future refined later.

### Gate

Obtain user approval for material product, scope, architecture, compatibility, security, cost, or delivery-risk decisions. A clear, bounded small request may be handed to Implementer without an additional approval checkpoint.

## Implementer

Divide the current scope into small, working, committable slices. No pauses mid-loop or between slices. Each maps to known criteria, works end-to-end where applicable, and passes its loop before next. Never batch all plan work.

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

- Gather and resolve requirements with the user; load `grill-me` if vague.
- Set plan depth with user.
- Produce approved artifacts and ordered slices; never monolithic handoff.
- Large: MVP first; hand off current phase only.

### Implementer

- Run `preflight`.
- Start clear, bounded direct requests without awaiting an approval checkpoint.
- Execute current scope, slice by slice.
- Track caps; notify via `notify`.
- Phase completion: checkpoint.

## Escalation

Report failure, blockers/metrics/tests, attempts, next action. Return to Planner if plan needs revision; else user.
