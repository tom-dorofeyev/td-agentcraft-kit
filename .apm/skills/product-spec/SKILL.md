---
name: product-spec
description: Defines what a well-formed product specification looks like — the required structure, slice rules, and acceptance criteria standards. Used by Product Specialist when writing specs and by downstream agents when validating them.
---

# SKILL: Product Spec

## Spec Structure (Required)

Every spec must include these sections in order. Omitting any section makes the spec incomplete and it must be returned for revision.

- `# {Feature Name}`
- `## Overview` — what this work is and why it matters. When changing existing behavior, document the current behavior explicitly alongside the desired behavior so the delta is unambiguous.
- `## Affected Users / Areas` — who is impacted and which parts of the product are touched.
- `## Success Criteria` — checkbox list, measurable from a user/business perspective. Each item must be independently verifiable without guessing.
- `## Scope`
  - `### In Scope` — what this work covers
  - `### Out of Scope` — explicit exclusions; prevents scope creep
- `## Requirements`
  - `### Functional` — user-facing behaviors only; no technical implementation details
  - `### Experience & Constraints` — performance, accessibility, and reliability expectations expressed as user outcomes, not technical specs
- `## User Stories` — one per behavior change; Epic is optional
- `## Open Questions` — every unresolved ambiguity; none may be silently omitted
- `## Notes` — assumptions, edge cases, scope creep flags

## Slice Rules

A slice is the unit of work the team delivers, reviews, and verifies independently. These rules define what makes a slice valid.

- **Micro-slices only**: the smallest unit of user-visible behavior that delivers value on its own. If a slice takes more than one engineer implementation call to build, it is too large — split it.
- **One behavior per slice**: each slice represents exactly one meaningful behavior change visible to the user or stakeholder.
- **Independent verifiability**: a slice must be reviewable without waiting for any other slice to be complete. If it can't, split it further.
- **Smaller is always better**: fewer, smaller slices complete the review cycle faster and keep the team unblocked.
- **Never layer-based**: slices are never defined around technical layers, internal refactors, infrastructure changes, or framework upgrades — those are engineering concerns, not product slices.

## Acceptance Criteria Standards

Acceptance criteria are the contract between Product and the delivery team. They must be:

- **Objectively testable**: a reviewer must be able to verify each criterion from a user perspective without asking for clarification.
- **Behavior-oriented**: describe what the user can observe or do, not how the system implements it.
- **Independent**: each criterion stands alone; passing one does not depend on passing another.
- **Expressed as outcomes**: use "Given / When / Then" or plain outcome statements — never implementation assertions.

## When Reviewing a Spec (Team Leader and Architect)

A spec is incomplete and must be returned if:
- Any required section is missing or empty
- A success criterion is subjective or unverifiable
- A slice depends on another unfinished slice
- A slice is defined around a technical layer rather than a user-visible behavior
- Open questions are present but no answer or assumption is documented
