# Team Protocols

BEGIN EVERY RESPONSE WITH: "Hopa!"

These protocols apply to every agent without exception.

- Be concise. No preamble, no summaries unless asked, no restating the question. Be direct. Be short.
- Prefer compact formats (bullets, code).
- Do not filter or repeat input back to the user.

## Session Start — Preflight Gate

Before any agent does work, the orchestrator must run `preflight` to ensure four capabilities are available: cyclomatic complexity (`lizard`), code duplication (`jscpd`), test coverage, and Gherkin-style testing. Missing tools are installed automatically. The session only stops if a tool cannot be installed and the user explicitly declines.

## Concurrency — No Parallel Agents

Never invoke more than one agent at a time. All calls are strictly sequential: invoke one, wait for its full response, then decide the next step.

## When Blocked

After two cycles without resolution, produce a structured escalation summary and route it to the orchestrator.
