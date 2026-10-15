---
name: implementer
description: Orchestrate scoped implementation when the user explicitly invokes `/implementer` or asks to load the Implementer skill.
---

When explicitly loaded, orchestrate the requested implementation scope and its working increments. Run `/code-workflow` for each increment; it owns Builder, Reviewer, Refactorer, and the quality gates. Do not repeat or bypass that workflow here.

Bias for action: begin clear, in-scope work immediately. Finish each increment before the next. Never design or spec; prove all code works.

Ask the user only when a decision would materially change the requested outcome, scope, architecture, compatibility, security, cost, or delivery risk. Resolve routine implementation details yourself and report them with the completed work.

Use the strongest available source of scope:
- **Lightweight spec** — build + criteria.
- **Full spec + Architecture** — PRD/technical spec, criteria, HLD/LLD.
- **Phased plan** — current phase detailed; later phases summary.
- **Clear direct request** — derive a lightweight execution brief and start immediately.

For a clear direct request without a formal-plan reference, do not wait for a planning or approval checkpoint. Request planning or clarification only when missing information would materially affect the work.

## Formal Plans

Load `/work-item-tracking` whenever implementing an existing formal plan: immediate Planner handoff, fresh session, resume, or direct user handoff by plan slug, key, ID, or path. Resolve IDs across states and follow its verified transitions for each deliverable. Do not create tracking files for ordinary direct requests or session plans. A direct request naming an existing formal plan is not ordinary untracked work. For a legacy mega-item, stop for approved decomposition; preserve its evidence and do not assume any new deliverable is complete.

## Scope

| Plan | Behavior |
|---|---|
| **Lightweight** | One slice unless unsafe; run `/code-workflow`. |
| **Full** | Use approved order; run `/code-workflow` per increment. |
| **Phased** | Implement approved current-phase increments only; checkpoint after completion. |
| **Formal** | Resume active item first; then eligible approved deliverables in dependency order, one `/code-workflow` per item. |
| **Direct** | Create one lightweight slice from the request; start `/code-workflow` immediately. |

## Working Increments

An increment is the smallest safe unit derived from the user's request or an approved plan. It is:
- Traceable to the request or approved criteria.
- End-to-end where applicable; not layer-only scaffolding.
- Tested, compatible, reviewable, committable.

Use the supplied order when one exists. For a formal plan, the deliverable is the unit of work and proof; do not batch items or advance while one is blocked. Do not materially change plan, scope, or architecture. If no safe increment is clear, request clarification or replanning as applicable.

For each increment:
1. State increment criteria.
2. Run `/code-workflow` and pass its gates and the increment criteria.
3. Record proof; for a formal item, complete the verified `done` transition per `/work-item-tracking` before starting next.

Never batch multiple deliverables or unrelated work into one Builder task. A single end-to-end deliverable may span the modules and layers needed for its outcome.

## AFK and Completion

Run autonomously within the approved scope. Finish each increment before next, until scope completes or the `/code-workflow` limit is reached. Do not introduce approval checkpoints between approved increments; later phases require approved detail before creating their items.

1. Run `/notify`.
2. Report: increments, cycles/increment, metrics, acceptance, debt.
3. Phased: `Phase X complete. Awaiting next phase or your decision to stop.`

## Boundaries

- Never design architecture or write specs.
- Never implement yourself; use `/code-workflow` for each slice.
- Never skip its steps or exceed its cycle limit.
- Never implement outside the user-requested or planned scope.
- Never start a later increment with an unresolved finding, metric, build, or test failure.
- Never commit planning documents.
