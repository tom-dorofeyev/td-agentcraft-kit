---
name: work-item-tracking
description: Create and progress approved formal plans and independently verifiable deliverables across todo, in-progress, and done. Never use for session planning.
---

# Formal Work-Item Tracking

This skill is the sole authority for formal-plan layout, IDs, records, and lifecycle. Load it when creating an approved formal plan or implementing/resuming one, whether handed off by Planner, a fresh session, or a direct user request referring to an existing plan or item. Ordinary conversation and session plans create no tracking files.

## Layout and records

```text
.agent-craft-work/<plan-slug>/
  plan.md
  todo/<KEY>-001-<deliverable-title>/work-item.md
  in-progress/
  done/
```

`<plan-slug>` is a stable kebab-case name, unique in the repository. Choose a short, human-readable uppercase `<KEY>` unique among all plans in this repository (for example, `ACCT`); never assign the same key to a second plan. No date or task/story/epic hierarchy. The three state directories belong to the plan; each deliverable directory exists in exactly one state. Move the **entire directory**, including evidence and attachments, not only `work-item.md`.

`plan.md` is shared context, not an executable mega-item. Record plan title/key, scope and approved requirements, architecture decisions or constraints, ordered index of deliverable IDs with titles and dependency IDs, the next unused sequence number, and future phase summaries if applicable. The index tracks current state for each ID; use IDs, never state-dependent paths, for dependencies. Future phases remain summaries until their detail and deliverables are approved. Never mark a plan or phase complete on behalf of unfinished deliverables.

Each `work-item.md` records its immutable ID and title, independently verifiable outcome, scoped acceptance criteria, prerequisite IDs (or none), relevant shared-plan decisions, and an evidence section for checks, review/gate outcomes, failures, and retry notes. Keep this record across retries and transitions; append evidence rather than replacing it. A deliverable must be small enough to test, review, and finish independently, not a container of later slices.

## Creation and ID allocation

Before creating a new plan, verify its target directory does not already exist. Reserve `static-code-analysis` for analysis artifacts; never use it as a plan slug. Existing plan directories may only be resumed or extended, not overwritten.

Planner creates `plan.md`, state directories, and one `todo/` directory per approved, implementation-ready deliverable after approval. For an existing plan, add new deliverables only after their detail is approved. Before creation, inspect all plans' keys and slugs for uniqueness. Allocate IDs per plan, starting `<KEY>-001`; increment the durable `next unused sequence number` in `plan.md` after each allocation. Check the index and all three state directories before allocation; choose a number greater than both the stored next-number predecessor and every previously recorded or existing ID. Never reuse or renumber IDs, even if an item is removed. If the counter, index, directories, or key conflict ambiguously, stop and reconcile with the user rather than guessing. Add the new ID, title, dependencies, and `todo` state to the plan index. Dependencies refer only to IDs in that plan; no cycles or unresolved dependencies.

## Resolve and transition

Resolve a supplied plan slug, key, ID, or canonical path against `plan.md` and all three state directories before work. Each indexed ID must resolve to exactly one directory in exactly one state with one matching `work-item.md`; every directory must have an index entry with the same ID and state. Missing, duplicate, mismatched, or conflicting states fail closed. Do not silently recreate a missing record or infer completion from a directory name. If an older single mega-item layout is found, preserve its plan and evidence; stop and request approved decomposition into small deliverables before implementing. Do not automatically treat new children as complete.

Before starting a `todo` item, verify every prerequisite ID is in `done` with recorded passing evidence. Resume the existing `in-progress` item first, including its unresolved gates, before starting the next eligible `todo` item. Multiple active items in one plan require reconciliation before continuing. Never start a dependent or later item while active work is blocked. Verify the source state and destination absence before moving; move the whole item directory from `todo/` to `in-progress/` before implementation, then verify it exists only in `in-progress/` and update the index. If already active, do not move it again.

Keep the item in `in-progress/` throughout implementation, review, retries, and all applicable gates. Record actual evidence and blockers there. Only after its own acceptance criteria and every applicable gate pass, verify source and destination, move its entire directory to `done/`, verify it exists only there with its record and evidence intact, and update the index. If a move, verification, or index update fails, stop and reconcile state before proceeding; never claim `done` on an unverified transition. Failed or blocked work remains `in-progress/` with its evidence; report the blocker rather than moving it back or advancing another item.
