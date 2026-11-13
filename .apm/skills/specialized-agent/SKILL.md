---
name: specialized-agent
description: Route one bounded specialist task to a native endpoint, or use a CLI fallback only when no native delegation is available.
---

## Role contracts

Select one role from this table. The executing agent loads its matching contract; the caller need not load it merely to route a task:

| Role | Purpose | Contract |
|---|---|---|
| Architect | Designs conceptual system boundaries, dependencies, and contracts without implementation detail. | `references/architect.md` |
| Builder | Implements tested, production-grade code from a clear request, approved design, or investigation findings. | `references/builder.md` |
| Investigator | Produces read-only, evidence-based answers about code, documentation, or external context. | `references/investigator.md` |
| Refactorer | Reduces measured complexity and duplication without changing behavior. | `references/refactorer.md` |
| Reviser | Performs either scope review or quality/architecture review and resolves its own findings. | `references/reviser.md` |
| Specifier | Converts confirmed product requirements into deterministic Gherkin acceptance criteria. | `references/specifier.md` |

The role contracts are canonical. Do not restate, alter, combine, or selectively weaken their responsibilities and boundaries in this skill. Planner and Implementer are orchestration skills, not specialists; load `/planner` or `/implementer` for those workflows.

## Role executors

The registered native role agents are execution endpoints, not role orchestrators. When this skill is loaded by one of those agents, load its fixed contract and own the assigned role work locally. A generic delegate assigned a role likewise loads the selected contract and owns the work locally. Never delegate to the same role or another role for that work. The sole nested handoff allowed is the discovery routing below; Investigator never delegates.

## Discovery routing

Every specialist except Investigator gives broad, read-only discovery (repository searches and exploratory file reading) to Investigator, with a precise, bounded factual question. Use sufficient supplied findings rather than repeating discovery; read identified relevant files locally for role-specific analysis and decisions.

If native Investigator delegation is supported, make only necessary, sequential handoffs and wait for each result before resuming the specialist task. Do not dispatch another role, invoke `/delegate`, or run a nested agent CLI. If native delegation is unavailable, do not bypass broad discovery locally: return a bounded missing-context question to the caller for an Investigator handoff and a fresh specialist task with its findings. Investigator returns compact relevant paths and line references, findings or key excerpts, and uncertainties, not raw file dumps.

## Route one role

1. Select the smallest role that owns the requested outcome.
2. If native delegation is available to the caller, prefer the registered agent whose lowercase name matches the selected role. Its adapter loads this skill and its fixed contract; send only the bounded task and task-specific context. If no matching endpoint is registered, use a generic native delegate with the loader instruction below. A missing named endpoint alone is not a reason to use CLI fallback. This also applies to bounded Investigator discovery handoffs.
3. Only when native delegation is unavailable or restricted to the caller, and the caller is not already a delegate, load `/delegate` and use its CLI fallback for that bounded task. Use the named role endpoint when supported; otherwise use a generic CLI delegate with the same loader instruction below. If the selected role's installed agent frontmatter has a `model`, pass that model to `/delegate`; otherwise leave model selection to the runtime.
4. If neither mechanism is available, load the selected contract and perform the task in the current session while following it exactly.

Never delegate multiple roles in parallel. A role handoff is complete only after its result has been received and evaluated. Never turn an incoming native or CLI handoff into another CLI handoff. A generic executor loading the selected contract is not a substitute role. If the selected role cannot be executed, report the broken workflow rather than assign a different role. The fallback in step 3 is for an ordinary caller, not a nested specialist handoff.

## Delegation prompt

For native and CLI handoffs, provide one self-contained task, relevant facts and file references, and task-specific constraints or requested evidence (for example, the Reviser review type). Do not repeat identity, responsibilities, output format, boundaries, or discovery rules already supplied by the endpoint and loaded contract.

For a generic native or CLI delegate, add only this bootstrap instruction: load `/specialized-agent` and the selected `references/<role>.md`, then own that role work locally under the skill's discovery routing without redispatching it. Supply resolvable installed paths to both the skill and contract if skill loading is unavailable; never paste their contents. If the executor cannot load the required skill or contract, it must report a blocker rather than proceed without them.

The delegated task must not change the role contract. The delegate returns its result to the caller, which decides whether another sequential role is needed.
