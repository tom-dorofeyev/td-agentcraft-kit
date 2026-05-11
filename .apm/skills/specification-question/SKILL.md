---
name: specification-question
description: Provides a standard way to raise, track, and resolve requirement clarifications and blockers.
---

# SKILL: Specification-Question

## Purpose & Scope
Gives all agents a standard way to raise, document, and track clarifying questions or blockers about any requirement, spec, or prompt. Promotes clarity and ensures that no project proceeds with silent ambiguities. Requires that every open question be promptly addressed (“no silent ambiguity passes through”) and phrased in a way that communicates both the “what” and “why.”

## Application
- Any agent, upon receiving ambiguous, conflicting, or incomplete input, formulates a structured question using the template provided.
- Questions are routed (via orchestrator) to the owner of the requirement or product specialist/product owner.

## Major Capabilities
- Questions are numbered, logged, and tracked until answered/resolved.
- All responses must explicitly reference the question they address.
- Agents can block further work on an aspect pending an unresolved question.

## Robustness Protocols
- Questions appear in project state/log and are visible to all relevant agents.
- Unanswered questions after two rounds automatically escalate.

## Example Question Format
```
QUESTION #17
From: QA Engineer
Context: New onboarding flow - missing error handling requirement
Detail: Should a user be redirected or shown an error page if email verification fails?
Blocking: Test plan for onboarding
Required for: QA acceptance criteria.
```
