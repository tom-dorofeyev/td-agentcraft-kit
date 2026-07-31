# Agent System

This kit is organized as a small agent system rather than a flat set of prompts.

## Core Idea

The main idea behind this kit is to treat the agent system like software that should be designed cleanly.

> Exposed agents are classes. Subagents are private methods. Skills are public methods. Instructions are the base class.

That analogy is the point of the structure:

- `instructions/` contains the shared behavior every agent inherits
- `agents/` defines role-specific contracts — 3 exposed (Agent, Planner, Implementer) and 6 subagents
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

## Agent Architecture

### Exposed Agents (user-facing)

The user interacts directly with 3 exposed agents:

| Agent | Role |
|---|---|
| **Agent** | Small, low-context tasks — ≤3 files, no abstractions, quick fixes, read-only questions |
| **Planner** | Planning phase — generates approved PRD (Epics, User Stories, Gherkin tests) and Architecture doc (HLD + LLD) |
| **Implementer** | Execution phase — AFK code-review-refactor loop until all acceptance tests pass |

### Subagents (internal, `mode: subagent`)

Exposed agents delegate specialist work to 6 subagents:

| Subagent | Called By | Purpose |
|---|---|---|
| product-specialist | Planner | Product specs with Gherkin acceptance criteria |
| architect | Planner | HLD + LLD architectural design |
| builder | Implementer | Production code implementation |
| code-reviewer | Implementer | Quality, correctness, and security review |
| refactorer | Implementer | Complexity/duplication reduction, metric enforcement |
| investigator | Any | Read-only codebase investigation |

## Workflow

1. **Small tasks** → Agent handles directly.
2. **Features / non-trivial changes** → Planner produces approved PRD + Architecture docs, then Implementer runs the AFK loop.
3. **Investigation** → Investigator subagent answers read-only questions.

## What Ships In This Kit

The agent layer includes 3 exposed agents and 6 specialist subagents covering product, architecture, engineering, review, refactoring, and investigation.

The skills layer includes reusable modules for:

- Feature workflow orchestration (Planner → Implementer)
- Requirements clarification (grill-me)
- Investigation routing
- Quality and review gates (static-code-analysis)
- Preflight tool validation
- User notifications

## Why The Structure Matters

This separation keeps the system easier to evolve:

- Shared rules live once in `instructions/`
- Role-specific behavior stays in each agent file
- Reusable guidance is extracted into skills instead of duplicated
- Subagents are clearly distinguished from exposed agents via `mode: subagent`
- The Planner ↔ Implementer split creates a clean handoff between planning and execution

That makes the kit easier to maintain and easier to adapt across Copilot, Claude, and OpenCode.
