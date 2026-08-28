# Agent System

This kit is organized as a small agent system rather than a flat set of prompts.

## Core Idea

The main idea behind this kit is to treat the agent system like software that should be designed cleanly.

> Agents are classes. Skills are methods. Instructions are the base class.

That analogy is the point of the structure:

- `instructions/` contains the shared behavior every agent inherits
- `agents/` defines the role-specific contracts
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

## What Ships In This Kit

The agent layer includes dedicated roles for product, engineering, deterministic review, judgment-based review, architecture, and orchestration.

The skills layer includes reusable modules for areas such as:

- workflow routing
- quality and review gates
- clean code and architecture standards
- test planning and static analysis
- escalation and specification handling

## Why The Structure Matters

This separation keeps the system easier to evolve:

- shared rules live once in `instructions/`
- role-specific behavior stays in each agent file
- reusable guidance is extracted into skills instead of duplicated

That makes the kit easier to maintain and easier to adapt across Copilot, Claude, and OpenCode.