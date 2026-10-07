---
name: investigation
description: Workflow for question-driven codebase investigation. Guides the caller to delegate the right specialist agents, gather evidence, and return a direct answer without defaulting to implementation.
---

# Investigation Workflow

Use this workflow when the user's primary intent is to **understand** rather than **change**: questions about how the codebase works, where behavior lives, why something happens, what changed, what is risky, what tests cover, or what likely caused a bug.

## Purpose

Produce a direct, evidence-based answer to the user's question by delegating targeted investigation to the right agent(s). Do not default to implementation, specs, or refactors unless the user explicitly asks for them.

## Entry Criteria

Use this workflow when one or more of these are true:

- The user asks a question about the codebase, architecture, current behavior, tests, dependencies, risks, or likely root cause.
- The user asks "how does this work?", "where is X handled?", "why is Y happening?", or "what would break if we changed Z?"
- The desired output is an explanation, diagnosis, comparison, or recommendation rather than a code change.

Do **not** use this workflow for implementation requests, even if they begin with a question. If the user ultimately wants code changed, route to an engineering workflow instead.

## Orchestrator Responsibilities

- Restate the investigation objective in one sentence before delegating.
- Delegate only to the minimum necessary specialist agent.
- Prefer a single specialist when the question is narrow.
- Use sequential delegation only. Never investigate with parallel agents.
- Require evidence in every handoff: relevant files, functions, commands, or artifacts that support the conclusion.
- Synthesize the final answer for the user in direct language. Do not dump raw agent output without interpretation.

## Delegation Guide

Choose the narrowest capable delegate first:

| Question Type | Delegate To | Expected Output |
|---|---|---|
| Existing code behavior, architecture, dependency flow, integration points, root-cause hypothesis, test locations | **Investigator** | Read-only findings with file references, relevant constraints, and uncertainty |
| Test coverage, acceptance scope, regression risk, reproducibility, verification gaps | **Investigator**, then **Reviewer** if an assessment is needed | Evidence first; then a coverage or risk assessment grounded in it |
| Code quality risk, review of a suspicious implementation, likely bug patterns, non-obvious correctness concerns | **Investigator**, then **Reviewer** | Relevant code evidence first; then findings with severity and file references |
| Architectural decision for an approved plan | **Investigator**, then **Architect** | Repository evidence first; then a design decision based on it |
| Business intent or expected user-facing behavior when the request is fundamentally product-facing rather than technical | **Specifier** | Clarified product explanation grounded in user outcomes |

Pass the Investigator's concise findings and file references to the decision-making specialist. That specialist may inspect the few relevant files directly when needed. If an answer reveals a new unanswered dimension, use one targeted follow-up; keep the chain tight and sequential.

## Investigation Steps

1. Classify the question precisely.
2. Delegate to the best-fit specialist with explicit instructions:
   - answer the question directly
   - cite concrete evidence
   - state assumptions and uncertainty
   - do not implement changes
3. Review the returned evidence.
4. If the answer needs a review or design judgment, delegate that judgment with the evidence. If factual evidence is incomplete, request one targeted Investigator follow-up.
5. Return a concise, synthesized answer to the user.

## Answer Standard

The final answer should contain:

- The direct answer first.
- Supporting evidence with file references or concrete artifacts.
- Clear separation between facts, inference, and uncertainty.
- Risks or follow-up options only if they are useful to the user's question.

## Completion Criteria

An investigation is complete when all of the following are true:

- The user's question is answered directly.
- The answer is supported by concrete evidence.
- Any uncertainty is explicitly called out.
- No implementation work was started unless the user separately requested it.

## Escalation

If the investigation cannot proceed because the question is fundamentally ambiguous, ask the user one structured batch of clarifying questions. Never guess.

If two investigation handoffs still do not resolve the answer, produce a blocked investigation summary and route it to the caller.
