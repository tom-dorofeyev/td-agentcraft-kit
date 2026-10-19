# Agent System

This kit has one regular `Agent` entry point, a shared code workflow, two optional orchestration skills, and portable specialists supplied by `/specialized-agent`.

## Core Idea

Markdown is production code. The system is designed as small, focused contracts:

- `agents/agent.md` is the default assistant for everyday conversation and simple work.
- `skills/code-workflow/` owns the Builder → Reviewer → Refactorer sequence and code quality gates.
- `skills/planner/` and `skills/implementer/` contain the scope and slice orchestrators.
- `skills/specialized-agent/references/` contains canonical bounded specialist contracts.
- The seven role files in `agents/` register native subagents and load those contracts through `/specialized-agent`.
- `skills/` contains reusable workflows and quality gates.
- `instructions/` contains shared rules.

The shared instructions require `/code-workflow` for every executable change. It delegates Builder, Reviewer, and Refactorer sequentially and requires review, static analysis, a passing build and test suite, and behavior-focused evidence. Ordinary work enters with conversation context, without a separate plan or formal files. `/implementer` invokes the same workflow per approved deliverable when requested for complex tracked work.

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

Load `/planner` for planning, `/implementer` for explicitly requested slice orchestration, and `/code-workflow` for code changes. Each uses `/specialized-agent` for the relevant specialist; when available, prefer native agents.

| Role | Purpose |
|---|---|
| Specifier | Product-facing Gherkin acceptance criteria |
| Architect | Conceptual HLD and LLD |
| Builder | Production implementation |
| Reviewer | Plan or quality/architecture review |
| Refactorer | Measured complexity and duplication reduction |
| Investigator | Read-only evidence-based investigation |

Role agents are thin native execution adapters: role responsibilities remain in `specialized-agent/references/`, and shared discovery routing lives in `/specialized-agent`. Every specialist except Investigator sends broad searches and exploratory file reading to Investigator, unless supplied findings suffice. Specialists read identified relevant files locally and own their role work. Only bounded, sequential native Investigator handoffs are allowed within a specialist; if native discovery is unavailable, it returns a missing-context question to its caller for an Investigator handoff and fresh specialist task, never a nested CLI. Investigator does not delegate and returns compact findings with paths, line references, and uncertainty, not raw dumps. Ordinary callers may still use the CLI fallback to start a specialist task.

## Workflow

1. **Everyday tasks** → `Agent`.
2. **Planning** → load `/planner`; it uses Investigator for needed repository evidence before sequential Specifier or Architect handoffs through `/specialized-agent`.
3. **Implementation** → load `/code-workflow`; it runs Builder, Reviewer, Refactorer, and verification for every code change. Explicit `/implementer` work uses it per slice.
4. **Large scope** → `/planner` defines MVP phases; each current phase goes through the same workflow.

## Planning Outputs

The `/planner` skill has two modes:

- **Session plan** — stays in the conversation; no files are created.
- **Formal plan** — after approval, `.agent-craft-work/<plan-slug>/plan.md` holds shared scope, decisions, ordered deliverable IDs/dependencies, next unused ID number, and future phase summaries. Each approved current-phase deliverable has its own `todo/<KEY>-001-<title>/work-item.md` with acceptance and evidence; `/work-item-tracking` governs whole-directory moves through `in-progress/` and `done/`. An Implementer can resume or accept a direct handoff by plan or ID, not only an immediate Planner handoff. Blocked items stay in progress; later phases need approved detail before item creation.

## What Ships

- One default platform agent: `Agent`.
- Seven native role agents, each referencing its canonical specialist contract.
- Two scope orchestration skills: `/planner` and `/implementer`.
- One shared implementation skill: `/code-workflow`.
- One portable specialist routing skill: `/specialized-agent`.
- Reusable requirements, delegation, investigation, proof-of-work, quality, preflight, tracking, and notification skills.

This is a single-source design: orchestrator workflows live in their own skills, while specialist definitions live only in `specialized-agent/references/`.
