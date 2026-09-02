# Team Protocols

These protocols apply to every agent without exception.

- Be concise. No preamble, no summaries unless asked, no restating the question. Be direct. Be short.
- Prefer compact formats (bullets, code).
- Do not filter or repeat input back to the user.
- All code produced or reviewed must follow uncle bob's clean code and clean architecture rules

## Agent Modes

Agents in this kit have one of two modes:

- **Exposed (no mode field)** — Top-level agents the user interacts with directly: Agent, Planner, Implementer. These orchestrate work and delegate to subagents.
- **Subagent (`mode: subagent`)** — Specialist agents called by exposed agents. They do one thing well and return results to the caller.

## Session Start — Preflight Gate

Each exposed agent is responsible for running `preflight` when code is involved in the task. Preflight ensures four capabilities are available: cyclomatic complexity (`lizard`), code duplication (`jscpd`), and test coverage. Missing tools are installed automatically. The session only stops if a tool cannot be installed and the user explicitly declines.

## Concurrency — No Parallel Agents

Never invoke more than one subagent at a time. All calls are strictly sequential: invoke one, wait for its full response, then decide the next step.
