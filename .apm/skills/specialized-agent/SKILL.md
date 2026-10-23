---
name: specialized-agent
description: Route one bounded specialist task to a native endpoint, or use a CLI fallback only when no native delegation is available.
---

## Role contracts

Load exactly one matching role contract before assigning work:

| Role | Purpose | Contract |
|---|---|---|
| Architect | Designs conceptual system boundaries, dependencies, and contracts without implementation detail. | `references/architect.md` |
| Builder | Implements tested, production-grade code from a clear request, approved design, or investigation findings. | `references/builder.md` |
| Investigator | Produces read-only, evidence-based answers about code, documentation, or external context. | `references/investigator.md` |
| Refactorer | Reduces measured complexity and duplication without changing behavior. | `references/refactorer.md` |
| Reviser | Performs either scope review or quality/architecture review and resolves its own findings. | `references/reviser.md` |
| Specifier | Converts confirmed product requirements into deterministic Gherkin acceptance criteria. | `references/specifier.md` |

The role contracts are canonical. Do not restate, alter, combine, or selectively weaken their responsibilities and boundaries in this skill. Planner and Implementer are orchestration skills, not specialists; load `/planner` or `/implementer` for those workflows.

## Native role endpoints

The registered native role agents are execution endpoints, not role orchestrators. When this skill is loaded by one of those agents, load its fixed contract and own the assigned role work locally. Never delegate to the same role or another role for that work. The sole nested handoff allowed is the discovery routing below; Investigator never delegates.

## Discovery routing

Every specialist except Investigator gives broad discovery (repository searches and exploratory file reading) to Investigator, with a precise, bounded question. Use sufficient supplied findings rather than repeating discovery; read identified relevant files locally for role-specific decisions. Investigator's read-only questions may also concern documentation, external context, behavior, architecture, and risk; discovery routing does not narrow its scope.

If native Investigator delegation is supported, make only necessary, sequential handoffs and wait for each result before resuming the specialist task. Do not dispatch another role, invoke `/delegate`, or run a nested agent CLI. If native delegation is unavailable, do not bypass broad discovery locally: return a bounded missing-context question to the caller for an Investigator handoff and a fresh specialist task with its findings. Investigator returns compact relevant paths and line references, findings or key excerpts, and uncertainties, not raw file dumps.

## Route one role

1. Select the smallest role that owns the requested outcome.
2. Load its entire contract from `references/`.
3. If native delegation is available to the caller, delegate once to the registered agent whose lowercase name matches the selected role. Give it one bounded task whose context includes the complete role contract, the discovery routing above, and only the task-specific facts the role needs. That agent owns the role task directly, subject only to bounded native Investigator discovery.
4. Otherwise, if the caller is not already a delegate, load `/delegate` and use its CLI fallback for that bounded task. If the selected role's installed agent frontmatter has a `model`, pass that model to `/delegate`; otherwise leave model selection to the runtime.
5. If neither mechanism is available, perform the task in the current session while following the loaded role contract exactly.

Never delegate multiple roles in parallel. A role handoff is complete only after its result has been received and evaluated. Never turn an incoming native or CLI handoff into another CLI handoff. Do not use a substitute role when the selected role is unavailable; report the broken workflow to the caller. The fallback in step 4 is for an ordinary caller, not a nested specialist handoff.

## Delegation prompt

For native and CLI handoffs, provide:

- the complete selected role contract;
- one self-contained task and its relevant context;
- the role's required output format and boundaries;
- the discovery routing above, including the native-only Investigator exception for non-Investigators, the missing-context return when native discovery is unavailable, and the requirement to await each result; and
- for Investigator: `Do not delegate. Complete the read-only question directly.`

The delegated task must not change the role contract. The delegate returns its result to the caller, which decides whether another sequential role is needed.
