---
name: feature-workflow
description: Full end-to-end workflow for product features. Chains Product Specialist → Architect, then loops Software Engineer ↔ Code Reviewer ↔ Refactorer until quality gates pass.
---

# Feature Workflow

Use this workflow for any feature, non-trivial change, or anything introducing new abstractions.

## Purpose

Take a user request from vague intent to a working, reviewed, and measurably clean implementation. No shortcuts. No skipped gates.

## Entry Criteria

Use this workflow when:

- The task is a new feature or a non-trivial change.
- New abstractions, modules, or architectural decisions are required.
- The change spans multiple files or crosses layer boundaries.

Do NOT use for:
- Read-only questions (use the investigation workflow).
- ≤ 3 file, low-risk, isolated changes.

## Agent Sequence

```
1. Product Specialist ──→ 2. Architect ──→ 3. Implementation Loop
                                                    │
                              ┌───────────────────────┘
                              ▼
              ┌──→ Software Engineer ──→ Code Reviewer ──→ Refactorer ──┐
              │                                                         │
              └────────────────── (metrics or review fail) ─────────────┘
                                              │
                                         all gates pass
                                              │
                                           DONE ✓
```

### Steps 1–2 (one-time)

| Step | Agent | Gate | Pass Condition |
|---|---|---|---|
| 1 | **Product Specialist** | Spec clarity | Epics, stories, Gherkin acceptance criteria. User confirms. |
| 2 | **Architect** | Design soundness | Module boundaries, dependency direction (inward), interface contracts. No framework leakage. |

### Step 3 — Implementation Loop

Steps 1–2 run once and produce a locked spec + design. Step 3 loops until the implementation is perfect.

**Per-cycle sequence (always in this order):**

1. **Software Engineer** — implement or fix based on reviewer findings from the previous cycle. On cycle 1, implement from scratch per the design.
2. **Code Reviewer** — review against the spec, design, and quality standards. Output findings categorized as **blocking**, **high**, **medium**, **low**.
3. **Refactorer** — run static analysis. Enforce complexity ≤ 10, duplication ≤ 10%, coverage ≥ 90%. Produce before/after metric evidence.

**Loop rules:**

| Cycle | Fix scope | Rationale |
|---|---|---|
| 1 | All reviewer findings + all metric violations | Full pass — get to a clean baseline. |
| 2 | All reviewer findings + all metric violations | Second pass — eliminate remaining noise. |
| 3 | **Blocking + High** findings only + all metric violations | Tighten the loop. Accept medium/low as known debt. |
| 4+ | **Blocking only** + all metric violations | Prevent infinite loops. Medium/high/low are documented, not fixed. |

**Exit conditions (all must be true):**
- No blocking review findings remaining.
- Cyclomatic complexity ≤ 10 on changed lines.
- Duplication ≤ 10% on changed lines.
- Changed-line coverage ≥ 90%.

**Loop cap:** Maximum 5 cycles. If blocking issues or metric violations remain after cycle 5, escalate — do not loop further.

## Orchestrator Responsibilities

- Receive the initial user request and route to Product Specialist.
- Carry the full artifact (spec, design, code, review findings, metrics) through every handoff.
- Track cycle count for the implementation loop.
- Enforce fix scope tightening at cycles 3 and 4.
- Escalate at cycle 5 if gates still fail, or at any deadlock after two cycles.

## Escalation

Produce a structured escalation with:

- Which step or cycle failed.
- Remaining blocking findings or metric violations.
- What was attempted.
- Recommended next action.

Route to the orchestrator. Do not continue the workflow.
