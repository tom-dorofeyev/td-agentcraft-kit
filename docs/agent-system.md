# Agent System

This kit has one regular `Agent` entry point, two orchestration skills, and portable leaf specialists supplied by `specialized-agent`.

## Core Idea

Markdown is production code. The system is designed as small, focused contracts:

- `agents/agent.md` is the default assistant for everyday conversation and simple work.
- `skills/planner/` and `skills/implementer/` contain the stateful workflow orchestrators.
- `skills/specialized-agent/references/` contains canonical bounded leaf-specialist contracts.
- `skills/` contains reusable workflows and quality gates.
- `instructions/` contains shared rules.

The shared instructions require the `proof-of-work` quality gate for every executable change. It requires a behavior-focused automated check where feasible, passing verification, and the commands and results reported with the change.

```text
.apm/
  agents/
    agent.md
  instructions/
  skills/
    specialized-agent/
      references/
```

## Workflow Roles

Load `/planner` for planning and `/implementer` for approved execution. They load `specialized-agent` to select the smallest leaf specialist and use native delegation for one bounded, sequential task. If native delegation is unavailable, `specialized-agent` uses `delegate`; if neither is available, the current session follows the loaded contract.

| Role | Purpose |
|---|---|
| Specifier | Product-facing Gherkin acceptance criteria |
| Architect | Conceptual HLD and LLD |
| Builder | Production implementation |
| Reviewer | Plan or quality/architecture review |
| Refactorer | Measured complexity and duplication reduction |
| Hardener | Time-consuming mutation-test hardening; requires explicit user approval |
| Investigator | Read-only evidence-based investigation |

Roles are contracts, not platform-registered agents. This keeps their behavior available to clients that support skills and delegation but not agent-markdown registration.

## Workflow

1. **Everyday tasks** → `Agent`.
2. **Planning** → load `/planner`; it may sequentially use Specifier, Architect, or Investigator through `specialized-agent`.
3. **Implementation** → load `/implementer`; it runs the approved slice loop through leaf specialists selected by `specialized-agent`.
4. **Large scope** → `/planner` defines MVP phases; each current phase goes through the same workflow.

## Planning Outputs

The `/planner` skill has two modes:

- **Session plan** — stays in the conversation; no files are created.
- **Formal work item** — a durable plan with acceptance criteria, ordered slices, and a `/planner` → `/implementer` handoff in `.agent-craft-work/`.

## What Ships

- One default platform agent: `Agent`.
- Two orchestration skills: `planner` and `implementer`.
- One portable leaf-specialist routing skill: `specialized-agent`.
- Reusable requirements, delegation, investigation, proof-of-work, quality, mutation-hardening, preflight, tracking, and notification skills.

This is a single-source design: orchestrator workflows live in their own skills, while leaf-specialist definitions live only in `specialized-agent/references/`.
