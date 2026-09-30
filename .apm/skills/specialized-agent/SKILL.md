---
name: specialized-agent
description: Route one bounded task to a native leaf-specialist endpoint, or use a CLI fallback only when no native delegation is available.
---

## Role contracts

Load exactly one matching role contract before assigning work:

| Role | Purpose | Contract |
|---|---|---|
| Architect | Designs conceptual system boundaries, dependencies, and contracts without implementation detail. | `references/architect.md` |
| Builder | Implements tested, production-grade code from a clear request, approved design, or investigation findings. | `references/builder.md` |
| Investigator | Produces read-only, evidence-based answers about code, documentation, or external context. | `references/investigator.md` |
| Refactorer | Reduces measured complexity and duplication without changing behavior. | `references/refactorer.md` |
| Reviewer | Performs either scope review or quality and architecture review. | `references/reviewer.md` |
| Specifier | Converts confirmed product requirements into deterministic Gherkin acceptance criteria. | `references/specifier.md` |

The role contracts are canonical. Do not restate, alter, combine, or selectively weaken their responsibilities and boundaries in this skill. Planner and Implementer are orchestration skills, not leaf specialists; load `/planner` or `/implementer` for those workflows.

## Native role endpoints

The registered native role agents are execution endpoints, not routing agents. When this skill is loaded by one of those agents, load its fixed contract and complete the assigned task locally. Do not delegate to the same role, load `/delegate`, spawn a subagent, or run an agent CLI.

Architect is the only endpoint allowed to make a further handoff: it may use this skill to obtain missing investigation context from one or more sequential Investigator tasks. Each handoff must be necessary to complete the design; it is not a way to offload the design itself.

## Route one role

1. Select the smallest role that owns the requested outcome.
2. Load its entire contract from `references/`.
3. If native delegation is available to the caller, delegate once to the registered agent whose lowercase name matches the selected role. Give it one bounded task whose context includes the complete role contract and only the task-specific facts the role needs. That agent is a leaf endpoint and completes the task directly.
4. Otherwise, if the caller is not already a delegate, load `/delegate` and use its CLI fallback for that bounded task. If the selected role's installed agent frontmatter has a `model`, pass that model to `/delegate`; otherwise leave model selection to the runtime.
5. If neither mechanism is available, perform the task in the current session while following the loaded role contract exactly.

Never delegate multiple roles in parallel. A role handoff is complete only after its result has been received and evaluated. Never turn an incoming native or CLI handoff into another CLI handoff. Do not use a substitute role when the selected role is unavailable; report the broken workflow to the caller.

Architect is the sole exception to the one-role rule: it may use this skill to dispatch one or more sequential Investigator tasks when design context is missing. Use native delegation when Architect can invoke it; otherwise use `/delegate` as the fallback. Architect may not dispatch any other role.

## Delegation prompt

When `/delegate` is used, provide:

- the complete selected role contract;
- one self-contained task and its relevant context;
- the role's required output format and boundaries; and
- for every role except Architect: `Do not invoke /delegate, spawn subagents, or run an agent CLI. Complete this task directly.`
- for Architect: `You may use /specialized-agent only to dispatch sequential Investigator tasks required for missing design context. Do not dispatch any other role.`

The delegated task must not change the role contract. The delegate returns its result to the caller, which decides whether another sequential role is needed.
