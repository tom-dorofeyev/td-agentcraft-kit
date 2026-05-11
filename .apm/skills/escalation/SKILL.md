---
name: escalation
description: Defines a clear escalation protocol for deadlocks, unresolved blockers, and conflicting requirements.
---

# SKILL: Escalation

## Purpose & Scope
Provides a unified, explicit protocol for surfacing deadlocks, unanswered/blocking questions, contradictions, or technical/functional stalls 
to the Orchestrator and, if needed, to the product owner.

## Application
- Any agent can trigger escalation if it cannot proceed after two full cycles, due to lack of input, ambiguity, contradiction, or irreconcilable requirements.
- Orchestrator routes escalated issues up to product owner when required.

## Major Capabilities
- Escalation artifacts include: root cause, attempted resolutions, impact of blocking, all relevant context/artifacts.
- Escalation notification is immediate and blocks dependent work until resolved.
- Standardized "ESCALATED" state in work tracking.

## Robustness Protocols
- Escalation artifacts must be logged in state management.
- Resolution of escalation requires explicit sign-off from product owner or agent assigned by orchestrator.

## Example Escalation Artifact
```
ESCALATION
From: Software Architect
Context: API design conflict with product spec
Attempts: Consulted QA and Product via orchestrator, contradiction persists
Impact: No secure way to implement authentication as described.
Blocking: API work, integration plan
Requested action: Product clarification or spec rewrite.
```
