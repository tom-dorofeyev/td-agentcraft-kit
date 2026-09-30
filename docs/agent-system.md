# Agent System

This kit has one regular `Agent` entry point, a shared code workflow, two optional orchestration skills, and portable leaf specialists supplied by `/specialized-agent`.

## Core Idea

Markdown is production code. The system is designed as small, focused contracts:

- `agents/agent.md` is the default assistant for everyday conversation and simple work.
- `skills/code-workflow/` owns the Builder → Reviewer → Refactorer sequence and code quality gates.
- `skills/planner/` and `skills/implementer/` contain the scope and slice orchestrators.
- `skills/specialized-agent/references/` contains canonical bounded leaf-specialist contracts.
- The seven role files in `agents/` register native subagents and load those contracts through `/specialized-agent`.
- `skills/` contains reusable workflows and quality gates.
- `instructions/` contains shared rules.

The shared instructions require `/code-workflow` for every executable change. It delegates Builder, Reviewer, and Refactorer sequentially and requires review, static analysis, a passing build and test suite, and behavior-focused evidence. A clear direct request can enter this workflow without a separate plan. `/implementer` invokes the same workflow for each planned slice when explicitly requested.

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

Load `/planner` for planning, `/implementer` for explicitly requested slice orchestration, and `/code-workflow` for code changes. Each uses `/specialized-agent` for the relevant leaf specialist; when available, prefer native agents.

| Role | Purpose |
|---|---|
| Specifier | Product-facing Gherkin acceptance criteria |
| Architect | Conceptual HLD and LLD |
| Builder | Production implementation |
| Reviewer | Plan or quality/architecture review |
| Refactorer | Measured complexity and duplication reduction |
| Investigator | Read-only evidence-based investigation |

Role agents are thin native execution adapters: responsibilities remain solely in `specialized-agent/references/`. An orchestrator delegates to one adapter; the adapter executes its contract locally and never re-delegates the same role through the CLI. The only nested handoffs are Architect's necessary, sequential Investigator requests when design context is missing; native delegation remains preferred, with CLI only as its fallback.

## Workflow

1. **Everyday tasks** → `Agent`.
2. **Planning** → load `/planner`; it may sequentially use Specifier, Architect, or Investigator through `/specialized-agent`.
3. **Implementation** → load `/code-workflow`; it runs Builder, Reviewer, Refactorer, and verification for every code change. Explicit `/implementer` work uses it per slice.
4. **Large scope** → `/planner` defines MVP phases; each current phase goes through the same workflow.

## Planning Outputs

The `/planner` skill has two modes:

- **Session plan** — stays in the conversation; no files are created.
- **Formal work item** — a durable plan with acceptance criteria, ordered slices, and a `/planner` → `/implementer` handoff in `.agent-craft-work/`.

## What Ships

- One default platform agent: `Agent`.
- Seven native role agents, each referencing its canonical specialist contract.
- Two scope orchestration skills: `/planner` and `/implementer`.
- One shared implementation skill: `/code-workflow`.
- One portable leaf-specialist routing skill: `/specialized-agent`.
- Reusable requirements, delegation, investigation, proof-of-work, quality, preflight, tracking, and notification skills.

This is a single-source design: orchestrator workflows live in their own skills, while leaf-specialist definitions live only in `specialized-agent/references/`.
