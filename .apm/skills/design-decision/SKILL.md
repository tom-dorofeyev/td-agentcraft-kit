---
name: design-decision
description: Ensures technical decisions include explicit rationale, trade-offs, and documented alternatives.
---

# SKILL: Design Decision

## Purpose & Scope
Forces every technical or design artifact to be accompanied by clear, deliberate rationale and explicit trade-off commentary. Rationale should reference Clean Code, SOLID, YAGNI, and team standards wherever possible. Ensures downstream agents and stakeholders can understand, evaluate, and question every major decision, always including both "what" and "why."

## Application
- Attach a "Decision Record" section to every relevant architectural doc, interface, or design proposal.
- Document rejected alternatives and why they were not chosen.
- Rationale should clearly describe the business/technical driver.

## Major Capabilities
- Standardized decision record section in every relevant artifact.
- Can be referenced by artifact ID for auditability and architecture review.
- Reconciles disagreements by making design intent explicit and open.

## Robustness Protocols
- All major architecture and code change artifacts must reference/designate a decision record.
- Changes to decisions require an amendment with full context/history.

## Example Decision Record
```
DECISION: Use CQRS pattern for user event stream
Why: High write volume and reporting separation. Required by new analytics.
Alternatives considered: Classic CRUD (too rigid), event sourcing (too heavy for now).
Risks: Slightly higher code complexity up front, mitigated by team CQRS familiarity.
```
