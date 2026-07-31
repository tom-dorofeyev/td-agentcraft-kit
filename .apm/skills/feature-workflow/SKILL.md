---
name: feature-workflow
description: End-to-end workflow for any task needing planning. Planner produces approved docs (depth scales with scope), then Implementer runs the AFK loop until acceptance criteria pass.
---

# Feature Workflow

Use this workflow for any task that needs planning — from a small spec to a full platform.

## Purpose

Take a user request from vague intent to a working, reviewed, measurably clean, and acceptance-tested implementation. Two phases: planning (with user), then AFK implementation. Plan depth scales with scope.

## Entry Criteria

Use this workflow when:

- The task needs planning — more than a one-liner fix, but could be small.
- New abstractions, modules, or cross-cutting changes are involved.
- The user wants a planning step before code.

## Plan Depth

The Planner scales output to the task. No routing — every request gets a plan, just at different depth.

| Scope | Planner Output | Implementer Path |
|---|---|---|
| **Small** | Lightweight spec: what to build, key decisions, acceptance criteria | Direct implementation + review. Refactor only if flagged. |
| **Medium** | Full PRD (Epics, Stories, Gherkin) + Architecture (HLD + LLD) | Full AFK loop: Builder → Code Reviewer → Refactorer → Acceptance Tests |
| **Large** | MVP scoping: full PRD + Architecture for MVP epics, sketches for future phases. Folder per epic. | Per-phase AFK loop. Checkpoint after each phase. Planner loops back for next phase. |

## Agent Sequence

```
1. Planner ──→ 2. Implementer
     │               │
     ▼               ▼
Plan (any depth)   AFK Loop (adapted to plan depth)
(user approved)    (until acceptance criteria pass)
```

## Phase 1 — Planner: Document Generation

The Planner produces approved planning artifacts scaled to the task.

### Small Scope

Planner writes a lightweight spec directly (no subagents):
- What to build
- Key design decisions or constraints
- Acceptance criteria (bullets or Gherkin — keep it tight)

### Medium Scope

Planner delegates to subagents:
- **product-specialist** → PRD with Epics, User Stories, Gherkin acceptance tests
- **architect** → Conceptual architecture doc (HLD + LLD). No code, no pseudo-code: system components, dependency direction, plain-language contracts, key abstractions.

### Large Scope

Planner pushes for MVP:
- **product-specialist** → Phased PRD: MVP epics in full detail, future phases as summaries
- **architect** → Phased architecture: full system design, annotated per phase. Full detail for MVP components.
- Output: folder per epic. MVP epics ready for implementation. Future phases will be fleshed out in later planning cycles.

### Phase 1 Gate

Planning artifacts approved by the user. Hand off to Implementer.

## Phase 2 — Implementer: AFK Loop

The Implementer adapts to the plan it receives. No user interruptions mid-loop.

### Full Loop (Medium/Large scope)

```
Builder ──→ Code Reviewer ──→ Refactorer ──→ Acceptance Tests
    ↑                                                    │
    └──────────────── (tests fail) ─────────────────────┘
                                │
                          all tests pass
                                │
                             DONE ✓
```

**Per-cycle sequence (strictly sequential):**

1. **Builder** — implement code per the architecture doc.
2. **Code Reviewer** — review against PRD, architecture, quality standards. Severity: blocking, high, medium, low.
3. **Refactorer** — run `static-code-analysis`. Enforce all thresholds.
4. **Acceptance Tests** — run Gherkin tests. Every test must pass.

### Cycle Rules

| Cycle | Fix scope |
|---|---|
| 1 | All findings + all metric violations |
| 2 | All findings + all metric violations |
| 3 | Blocking + High + all metric violations |
| 4 | Blocking only + all metric violations |
| 5 | Blocking only + all metric violations |

### Exit Conditions

- All acceptance criteria pass.
- No blocking review findings.
- All metric thresholds pass per `static-code-analysis`.

**Loop cap: 5 cycles.**

### Lightweight Path (Small scope)

1. **Builder** — implement per the spec.
2. **Code Reviewer** — review against spec and quality standards.
3. Fix blocking issues, re-review (max 2 cycles).
4. Verify acceptance criteria.
5. Refactor only if reviewer flags complexity/duplication.

## Planner Responsibilities

- Receive the user request.
- Load `grill-me` if requirements are vague.
- Determine plan depth collaboratively with the user.
- Produce approved planning artifacts.
- For large scope: scope to MVP. Sketch future phases. Only hand off the current phase.

## Implementer Responsibilities

- Run `preflight` before starting.
- Adapt implementation path to plan depth.
- Execute autonomously (AFK) for the current scope.
- Track cycle count. Enforce caps.
- Notify user via `notify` skill on completion.
- For phased rollout: checkpoint after each phase.

## Escalation

Produce a structured escalation with: what failed, remaining blockers/metric violations/test failures, what was attempted, recommended next action.

Route back to Planner if plan needs revision. Otherwise escalate to user.
