# AGENTS.md — td-agentcraft-kit

## What This Project Is

A reusable APM kit that ships a multi-agent engineering workflow system to Copilot and OpenCode. It is distributed via `apm install` and designed for a single-install, cross-tool experience.

## Core Philosophy

**Markdown is treated as production code.** Every agent charter, skill file, and instruction set is authored and maintained with the same discipline as a software codebase: SOLID, clean code, YAGNI, single responsibility, naming as documentation. The agent system is not a pile of prompts — it is engineered software.

### The Mental Model

- **Agent** → default user-facing entry point
- **Orchestration skills** → Planner and Implementer workflows
- **Workflow roles** → portable role contracts loaded by `specialized-agent`
- **Skills** → reusable capabilities loaded on demand
- **Instructions** → base class (shared rules inherited by all agents)

This analogy drives every design decision. Duplication across agents is treated as a DRY violation. Shared behavior is extracted into instructions or skills, not copy-pasted. Every file has one reason to change.

## Project Layout

```text
.apm/
  agents/        # Default Agent and thin native role adapters
  instructions/  # Shared rules inherited by every agent
  skills/        # Reusable workflows, quality gates, engineering standards
docs/            # User-facing documentation (install guides, system overview)
```

The default Agent and each skill use YAML frontmatter for metadata. Workflow role contracts are plain Markdown references in `specialized-agent`; native role agents load them through that skill. The `apm.yml` manifest declares targets, version, and dependencies.

## Workflow Roles

`planner` and `implementer` orchestrate their workflows. `specialized-agent` loads these portable contracts and uses native delegation for one bounded, sequential task; `delegate` is its fallback for ordinary callers. Specialists may make only bounded native Investigator handoffs for missing broad discovery; Investigator never delegates:

| Role | Purpose |
|---|---|---|
| Specifier | Gherkin acceptance criteria |
| Architect | HLD + LLD architectural design |
| Builder | Production implementation |
| Reviser | Separate scope or quality/architecture review with in-review remediation |
| Refactorer | Measured complexity and duplication reduction |
| Investigator | Read-only codebase investigation |

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

- **No parallel roles.** All delegated role calls are strictly sequential. Never invoke two roles simultaneously.
- **Conciseness is mandatory.** No preamble, no summaries unless asked, no restating the question. Be direct. Be short.

## Workflow Overview

Ordinary work uses `/code-workflow` with the request and conversation context; no formal files or mandatory Planner/Implementer handoff. Use `/planner` and `/implementer` primarily when complex work needs approved, durable planning and tracked delivery. An explicitly requested lightweight plan can stay in the session.

| Scope | Signal | Path |
|---|---|---|
| **Ordinary** | Clear request, including a small change | **`/code-workflow`** — sequential roles and gates, using conversation context |
| **Complex** | Cross-cutting feature or durable handoff | **`/planner` → `/implementer`** — approved plan decomposed into independently verifiable deliverables |
| **Large** | Application or platform | **`/planner` → `/implementer` → `/planner` → ...** — approved current-phase deliverables; later phases remain summaries until planned |

Formal plans use `.agent-craft-work/<plan-slug>/plan.md` for shared scope, decisions, ordered IDs, and future phase summaries; each small deliverable has its own `todo/<KEY>-001-<title>/work-item.md` and moves as a whole directory through `in-progress/` to `done/` only after its gates pass. `/work-item-tracking` is the lifecycle and format authority; do not create executable mega-items.

Gate enforcement is strict. A task is not "done" until every applicable gate has passed and the evidence has been recorded. Build must succeed. Full test suite must pass. No exceptions.

## Writing for This Kit

When contributing role contracts, skills, or instructions:

1. **Respect the analogy.** A role contract has one responsibility. A skill is independently loadable and reusable.
2. **Follow the existing formats.** The default Agent and skills use YAML frontmatter. Workflow role contracts are plain Markdown in `specialized-agent/references/`.
3. **Never duplicate.** Orchestration behavior belongs only in `planner` or `implementer`; role behavior belongs only in `specialized-agent/references/`. Shared discovery routing belongs in `specialized-agent`, not shared instructions. If a skill overlaps semantically with another, converge them.
4. **Apply the Rule of Three.** Do not extract a skill on the first or second occurrence of a pattern. Wait for the third.
5. **Treat markdown as code.** Naming, structure, cohesion, and coupling apply to these files exactly as they would to source code.

## Licensing

MIT. See [LICENSE](LICENSE).
