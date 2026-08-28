---
name: state-management-logging
description: Establishes consistent state tracking and activity logging for workflow transparency and recovery.
---

# SKILL: State Management & Logging

## Purpose & Scope
Enables agents and orchestrator to reliably track the full workflow state, including all artifacts, agent progress, task queues, revision histories, and loop counters. Ensures traceability, transparency, and reproducibility of decision-making during a project.

## Application
- All artifacts, actions, routing decisions, and outputs must be logged with sufficient context (actor, timestamp, reason, linkage to prior artifacts).
- Task states (pending, in_progress, completed, escalated) are always updated in real time.
- Orchestrator maintains the global state but agents can log/annotate actions independently.

## Major Capabilities
- Artifact ledger: source, destination, type, version, timestamps, prior action(s).
- Activity history per agent and overall project.
- Loop detection: Track revision numbers for all issues/artifacts to identify repeats.
- Export/Reporting functions for audit and post-mortem review.

## Robustness Protocols
- If agent/system fails, log last known good state for immediate recovery.
- Only progress if latest state is committed; prevent race conditions or lost updates.

## Example Log Record Format
```
[2024-03-31T09:05:01Z] ACTION: QAEngineer | TYPE: test-plan-submitted | FOR: Orchestrator | LINK: Feature#128c | REVISION: 1 | CONTEXT: Unit/integration/E2E plan for new feature
```
