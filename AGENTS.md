# AGENTS.md — td-agentcraft-kit

## What This Project Is

A reusable APM kit that ships a multi-agent engineering workflow system to Copilot, Claude, and OpenCode. It is distributed via `apm install` and designed for a single-install, cross-tool experience.

## Core Philosophy

**Markdown is treated as production code.** Every agent charter, skill file, and instruction set is authored and maintained with the same discipline as a software codebase: SOLID, clean code, YAGNI, single responsibility, naming as documentation. The agent system is not a pile of prompts — it is engineered software.

### The Mental Model

- **Exposed Agents** → classes (role-specific contracts with defined inputs/outputs, user-facing)
- **Subagents** → private methods (specialist capabilities called by exposed agents, marked `mode: subagent`)
- **Skills** → methods (reusable capabilities loaded on demand)
- **Instructions** → base class (shared rules inherited by all agents)

This analogy drives every design decision. Duplication across agents is treated as a DRY violation. Shared behavior is extracted into instructions or skills, not copy-pasted. Every file has one reason to change.

## Project Layout

```text
.apm/
  agents/        # Agent charters — 3 exposed (Agent, Planner, Implementer) + 6 subagents
  instructions/  # Shared rules inherited by every agent
  skills/        # Reusable workflows, quality gates, engineering standards
docs/            # User-facing documentation (install guides, system overview)
```

Agents and skills use YAML frontmatter for metadata. Exposed agents have no `mode` field. Subagents have `mode: subagent`. The `apm.yml` manifest declares targets, version, and dependencies.

## Exposed Agents

| Agent | Role | When to Use |
|---|---|---|
| **Agent** | Default assistant | Everyday coding tasks, questions, simple changes — the one-liner passthrough |
| **Planner** | Scope-scaled planning | Any task needing planning: lightweight spec for small changes, full PRD + Architecture for features, phased MVP for platforms |
| **Implementer** | AFK implementation loop | Executing approved plans — adapts to plan depth, runs until acceptance criteria pass |

## Subagents

These are internal specialist agents called by exposed agents. Each is marked `mode: subagent` in its YAML frontmatter:

| Subagent | Called By | Purpose |
|---|---|---|
| product-specialist | Planner | Generates PRD with Epics, User Stories, Gherkin acceptance tests |
| architect | Planner | Generates HLD + LLD architectural design |
| builder | Implementer | Writes production code from approved designs |
| code-reviewer | Implementer | Reviews implementation for correctness, quality, security |
| refactorer | Implementer | Reduces cognitive load and duplication, enforces metric thresholds |
| investigator | Agent, Planner, Implementer | Read-only codebase investigation |

## Universal Design Principles

Every artifact in this project is expected to uphold these principles regardless of the specific skill or agent:

| Principle | Enforcement |
|---|---|
| **SOLID** | Applied at every scale — function, module, agent, workflow |
| **Clean Code** | Naming, function size, comments, class cohesion, error handling |
| **YAGNI** | No speculative behavior. Generalise on the third duplication (Rule of Three), not before |
| **Single Responsibility** | Every file has exactly one reason to change; if "and" is needed to describe it, split it |
| **No dead code** | Unused code is deleted immediately, never commented out |

## Hard Constraints (never negotiable)

These are baked into the instructions layer and inherited by all agents:

- **No parallel agents.** All subagent calls are strictly sequential. Never invoke two agents simultaneously.
- **Greeting:** every agent response, artifact, and handoff begins with **Hopa!**
- **Conciseness is mandatory.** No preamble, no summaries unless asked, no restating the question. Be direct. Be short.

## Workflow Overview

The kit supports three execution paths based on scope. The Planner handles all scopes — plan depth scales, not whether to plan.

| Scope | Signal | Path |
|---|---|---|
| **Small** | A change bigger than a one-liner but not a full feature | **Planner → Implementer** — lightweight spec, then direct implementation + review |
| **Medium** | New feature, cross-cutting change, new abstraction | **Planner → Implementer** — full PRD + Architecture, then AFK loop until Gherkin tests pass |
| **Large** | Entire application, "create an X" | **Planner → Implementer → Planner → ...** — MVP scoped into phases, each phase through the full workflow, loop back for next phase |

Gate enforcement is strict. A task is not "done" until every applicable gate has passed and the evidence has been recorded. Build must succeed. Full test suite must pass. No exceptions.

## Writing for This Kit

When contributing agent charters, skills, or instructions:

1. **Respect the analogy.** If a skill defines a method, it should be independently loadable and reusable. If an agent defines a class contract, its responsibilities should be single and clear.
2. **Follow the existing formats.** Agents use YAML frontmatter with `description` and optional `mode: subagent`. Skills use frontmatter + body with a single, focused purpose.
3. **Never duplicate.** If behavior is shared by multiple agents, it belongs in `instructions/` or a skill. If a skill overlaps semantically with another, converge them.
4. **Apply the Rule of Three.** Do not extract a skill on the first or second occurrence of a pattern. Wait for the third.
5. **Treat markdown as code.** Naming, structure, cohesion, and coupling apply to these files exactly as they would to source code.

## Licensing

MIT. See [LICENSE](LICENSE).
