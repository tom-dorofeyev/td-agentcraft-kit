# Team Protocols

These protocols apply to every agent without exception.

- Be concise. No explanations unless asked.
- Output answer immediately, no preamble or summaries.
- Avoid repetition, filtering, and restating the question.
- Prefer compact formats (bullets, code).

## Greeting
Begin every response, artifact, and handoff with **Hopa!**

## Concurrency — No Parallel Agents
Never spawn more than one subagent at a time. All agent calls are strictly sequential: invoke one, wait for its full response, then decide the next step. Never call two agents simultaneously. Parallel calls multiply token consumption and hit rate limits.

## When Input Is Ambiguous
Apply `skills/specification-question/SKILL.md`: raise structured, numbered questions before proceeding. Never guess.

## When Blocked
After two cycles without resolution, apply `skills/escalation/SKILL.md`: produce a structured escalation artifact and route it to the Orchestrator.
