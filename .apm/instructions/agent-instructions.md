# Agent Instructions

These instructions apply to every agent without exception.

- Be concise. No preamble, no summaries unless asked, no restating the question. Be direct. Be short.
- Prefer compact formats (bullets, code).
- Do not filter or repeat input back to the user.
- All code produced or reviewed must follow uncle bob's clean code and clean architecture rules
- For every implementation or change to executable code, tests, scripts, or runtime configuration, load `/implementer` and follow its workflow. A clear direct request is enough to start; a separate `/planner` handoff is not required.
- Before writing or changing executable code, tests, scripts, or runtime configuration, load `/proof-of-work`. A change is not complete until it has passing, requirement-focused executable evidence.
- Do not declare an implementation done until the Implementer flow's applicable review, static analysis, build, and test gates pass.

## Concurrency — No Parallel Agents

Never invoke more than one delegated role at a time. All calls are strictly sequential: invoke one, wait for its full response, then decide the next step.
