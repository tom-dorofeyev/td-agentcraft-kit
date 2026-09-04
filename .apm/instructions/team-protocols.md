# Team Protocols

These protocols apply to every agent without exception.

- Be concise. No preamble, no summaries unless asked, no restating the question. Be direct. Be short.
- Prefer compact formats (bullets, code).
- Do not filter or repeat input back to the user.
- All code produced or reviewed must follow uncle bob's clean code and clean architecture rules

## Role Routing

The kit ships one exposed `Agent` for everyday work. `/planner` and `/implementer` orchestrate multi-step workflows; `/specialized-agent` uses native delegation for bounded leaf specialists and `/delegate` only as a fallback. None are registered platform agents.

## Concurrency — No Parallel Agents

Never invoke more than one delegated role at a time. All calls are strictly sequential: invoke one, wait for its full response, then decide the next step.
