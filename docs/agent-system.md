# Agent System

This kit is organized as a small agent system rather than a flat set of prompts.

## Core Idea

The main idea behind this kit is to treat the agent system like software that should be designed cleanly.

> Exposed agents are classes. Subagents are private methods. Skills are public methods. Instructions are the base class.

That analogy is the point of the structure:

- `instructions/` contains the shared behavior every agent inherits
- `agents/` defines role-specific contracts — 3 exposed (Agent, Planner, Implementer) and 7 subagents
- `skills/` holds reusable capabilities loaded when needed

The layout is split into three parts:

```text
.apm/
  agents/
  instructions/
  skills/
```

- `agents/` defines the team roles used by the kit
- `instructions/` holds shared rules that apply across the whole team
- `skills/` contains reusable workflows, quality gates, and engineering standards

## Planning Outputs

Planning has two modes:

- **Session plan** — the plan stays in the conversation; it creates no files.
- **Formal work item** — a durable plan with acceptance criteria, ordered slices, and a Planner → Implementer handoff.

A formal item is stored outside the kit's tracked files:

```text
.agent-craft-work/
  task/
    2026-09-02--rename-account/
      todo/
      in-progress/
      done/
```

The item type follows work scope: small work is a `task`, medium work a `user-story`, and a large work item's current phase an `epic`. Planner loads `work-item-tracking` after approving a formal plan, then hands the canonical path to Implementer. Implementer loads the same skill for the lifecycle: `todo → in-progress → done`. Review, refactoring, acceptance tests, and retries remain within `in-progress`. The skill is never loaded for a session plan.

## Agent Architecture

### Exposed Agents (user-facing)

The user interacts directly with 3 exposed agents:

| Agent | Role |
|---|---|
| **Agent** | Default assistant — a helpful, precise, efficient AI coding assistant for everyday work |
| **Planner** | Planning phase — produces approved docs scaled to scope: lightweight spec, full PRD + Architecture, or phased MVP rollout |
| **Implementer** | Execution phase — AFK implementation loop adapted to plan depth, until all acceptance criteria pass |

### Subagents (internal, `mode: subagent`)

Exposed agents delegate specialist work to 7 subagents:

| Subagent | Called By | Purpose |
|---|---|---|
| specifier | Planner | Product specs with Gherkin acceptance criteria |
| architect | Planner | HLD + LLD architectural design (conceptual, no code) |
| builder | Implementer | Production code implementation |
| reviewer | Implementer | Quality, correctness, and security review |
| refactorer | Implementer | Complexity/duplication reduction, metric enforcement |
| hardener | Implementer | Mutation-testing-based test hardening |
| investigator | Planner, Implementer | Read-only codebase investigation |

## Workflow

1. **Everyday tasks** → Agent (default assistant).
2. **Anything needing planning** → Planner either plans in-session or creates a formal work item, then Implementer runs the AFK loop.
3. **Massive scope** → Planner scopes to MVP phases. Implementer runs per phase. Planner loops back for next phase.

## What Ships In This Kit

The agent layer includes 3 exposed agents and 7 specialist subagents covering product, architecture, engineering, review, refactoring, hardening, and investigation.

The skills layer includes reusable modules for:

- Feature workflow orchestration (Planner → Implementer)
- Formal work-item lifecycle tracking (work-item-tracking)
- Requirements clarification (grill-me)
- Investigation routing
- Quality and review gates (static-code-analysis)
- Mutation-testing-based test hardening
- Preflight tool validation
- User notifications

## Why The Structure Matters

This separation keeps the system easier to evolve:

- Shared rules live once in `instructions/`
- Role-specific behavior stays in each agent file
- Reusable guidance is extracted into skills instead of duplicated
- Subagents are clearly distinguished from exposed agents via `mode: subagent`
- The Planner ↔ Implementer split creates a clean handoff between planning and execution

That makes the kit easier to maintain and easier to adapt across Copilot and OpenCode.
