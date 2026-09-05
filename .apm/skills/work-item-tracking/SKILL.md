---
name: work-item-tracking
description: Create and progress a formal Planner → Implementer work item with scope-based folders and lifecycle states. Load only for an approved formal plan or its handoff, never for session planning.
---

# Formal Work-Item Tracking

Use this workflow for an approved formal plan that needs a durable Planner → Implementer handoff, or when Implementer receives its canonical `.agent-craft-work/...` path.

## Planner

Create exactly one item at:

```text
.agent-craft-work/<type>/<YYYY-MM-DD--kebab-title>/
  todo/
  in-progress/
  done/
```

Map scope to type: small → `task`, medium → `user-story`, large/current phase → `epic`. Keep the name immutable. Put the approved plan, acceptance criteria, and ordered slices in `todo/`, then hand Implementer the canonical path.

## Artifact Continuity

Create one `work-item.md` in `todo/`. It is the item’s persistent record: plan, acceptance criteria, ordered slices, decisions, and evidence. Never recreate it for a state transition, retry, or slice. Append proof to its existing evidence section.

Create the state folders once, then move the existing file to change state:

```sh
work_item_path=".agent-craft-work/<type>/<YYYY-MM-DD--kebab-title>"
mkdir -p "$work_item_path"/{todo,in-progress,done}
```

Use `mv` for every transition:

```sh
mv "$work_item_path/todo/work-item.md" "$work_item_path/in-progress/"
mv "$work_item_path/in-progress/work-item.md" "$work_item_path/done/"
```

## Implementer

Use the canonical path as the work item's source of truth. Move the existing `work-item.md` from `todo/` to `in-progress/` when execution begins. Keep it there while Builder, review, refactoring, and acceptance gates run, including failed-gate retries. Move it to `done/` only after the complete work item passes every applicable completion gate, including opted-in mutation testing.

Implementer owns all state transitions. Builder, Reviewer, Refactorer, and Hardener may receive the path but never move artifacts. Only one state folder contains artifacts at a time. For a multi-slice item, record proof with the item and keep it in `in-progress/` until every planned slice is complete.
