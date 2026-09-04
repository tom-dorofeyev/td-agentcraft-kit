---
name: specialized-agent
description: Select and execute one portable leaf specialist by loading its contract and delegating one bounded task through native delegation or the delegate fallback.
---

## Role contracts

Load exactly one matching role contract before assigning work:

| Role | Purpose | Contract |
|---|---|---|
| Architect | Designs conceptual system boundaries, dependencies, and contracts without implementation detail. | `references/architect.md` |
| Builder | Implements tested, production-grade code from approved designs or investigation findings. | `references/builder.md` |
| Hardener | Strengthens tests with mutation testing without changing production behavior; this is a time-consuming gate. | `references/hardener.md` |
| Investigator | Produces read-only, evidence-based answers about code, documentation, or external context. | `references/investigator.md` |
| Refactorer | Reduces measured complexity and duplication without changing behavior. | `references/refactorer.md` |
| Reviewer | Performs either plan review or quality and architecture review. | `references/reviewer.md` |
| Specifier | Converts confirmed product requirements into deterministic Gherkin acceptance criteria. | `references/specifier.md` |

The role contracts are canonical. Do not restate, alter, combine, or selectively weaken their responsibilities and boundaries in this skill. Planner and Implementer are orchestration skills, not leaf specialists; load `/planner` or `/implementer` for those workflows.

## Execute one role

1. Select the smallest role that owns the requested outcome.
2. Load its entire contract from `references/`.
3. If native delegation is available to the caller, delegate one bounded task whose context includes the complete role contract and only the task-specific facts the role needs.
4. Otherwise, load `/delegate` and use its fallback mechanism for that bounded task.
5. If neither mechanism is available, perform the task in the current session while following the loaded role contract exactly.

Never delegate multiple roles in parallel. A role handoff is complete only after its result has been received and evaluated. Do not use a substitute role when the selected role is unavailable; report the broken workflow to the caller.

Architect is the sole exception to the one-role rule: it may use this skill to dispatch one or more sequential Investigator tasks when design context is missing. Use native delegation when Architect can invoke it; otherwise use `/delegate` as the fallback. Architect may not dispatch any other role.

## Hardener consent

Before selecting or delegating Hardener, obtain an explicit user yes to: **"Should I run mutation testing? It is a time-consuming gate."** A recorded yes for the current session satisfies this requirement. A no applies for the current session unless the user changes it.

## Delegation prompt

When `/delegate` is used, provide:

- the complete selected role contract;
- one self-contained task and its relevant context;
- the role's required output format and boundaries; and
- for every role except Architect: `Do not invoke /delegate, spawn subagents, or run an agent CLI. Complete this task directly.`
- for Architect: `You may use /specialized-agent only to dispatch sequential Investigator tasks required for missing design context. Do not dispatch any other role.`

The delegated task must not change the role contract. The delegate returns its result to the caller, which decides whether another sequential role is needed.
