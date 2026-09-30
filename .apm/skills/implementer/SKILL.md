---
name: implementer
description: Orchestrate scoped implementation when the user explicitly invokes `/implementer` or asks to load the Implementer skill.
---

When explicitly loaded, orchestrate the requested implementation scope and its working slices. Run `/code-workflow` for each slice; it owns Builder, Reviewer, Refactorer, and the quality gates. Do not repeat or bypass that workflow here.

Bias for action: begin clear, in-scope work immediately. Finish each slice before the next. Never design or spec; prove all code works.

Ask the user only when a decision would materially change the requested outcome, scope, architecture, compatibility, security, cost, or delivery risk. Resolve routine implementation details yourself and report them with the completed work.

Use the strongest available source of scope:
- **Lightweight spec** — build + criteria.
- **Full spec + Architecture** — PRD/technical spec, criteria, HLD/LLD.
- **Phased plan** — current phase detailed; later phases summary.
- **Clear direct request** — derive a lightweight execution brief and start immediately.

For a clear direct request, do not wait for a planning or approval checkpoint. Request planning or clarification only when the missing information would materially affect the work.

## Formal Work Items

Load `/work-item-tracking` only when `/planner` hands over a canonical `.agent-craft-work/...` path, then follow its lifecycle. Do not load it or create a tracked item for a session plan or direct request unless the user asks for formal planning.

## Scope

| Plan | Behavior |
|---|---|
| **Lightweight** | One slice unless unsafe; run `/code-workflow`. |
| **Full** | Use approved slice order; run `/code-workflow` per slice. |
| **Phased** | Slice current phase only; checkpoint after its slices. |
| **Direct** | Create one lightweight slice from the request; start `/code-workflow` immediately. |

## Working Slices

A slice is the smallest safe increment derived from the user's request or an approved plan. It is:
- Traceable to the request or approved criteria.
- End-to-end where applicable; not layer-only scaffolding.
- Tested, compatible, reviewable, committable.

Use the supplied slice order when one exists. Do not materially change plan, scope, or architecture. If no safe slice is clear, request clarification or replanning as applicable.

For each slice:
1. State slice criteria.
2. Run `/code-workflow` and pass its gates and the slice criteria.
3. Record proof; then start next.

Never batch a scope's epics, stories, modules, or layers into one Builder task.

## AFK and Completion

Run autonomously within the current scope. Finish each slice before next, until scope completes or the `/code-workflow` limit is reached. Do not introduce approval checkpoints between slices.

1. Run `/notify`.
2. Report: slices, cycles/slice, metrics, acceptance, debt.
3. Phased: `Phase X complete. Awaiting next phase or your decision to stop.`

## Boundaries

- Never design architecture or write specs.
- Never implement yourself; use `/code-workflow` for each slice.
- Never skip its steps or exceed its cycle limit.
- Never implement outside the user-requested or planned scope.
- Never start later slice with unresolved finding, metric, build, or test failure.
- Never commit planning documents.
