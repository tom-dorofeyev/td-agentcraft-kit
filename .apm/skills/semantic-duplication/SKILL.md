---
name: semantic-duplication
description: Detect semantic duplication that clone tools miss. Search for existing implementations, reuse them, and converge on the right abstraction.
---

# SKILL: Semantic Duplication

## Purpose

Catch duplication by meaning, not just by text.

Same idea in many places = duplication.

Same responsibility with different names = duplication.

Repeated knowledge must converge into the right abstraction.

## Core Rule

Before writing new code, search the codebase for the same responsibility.

Look for:
- helper
- fixture
- builder
- mapper
- validator
- adapter
- hook
- policy
- test setup
- workflow

If it already exists:
- reuse it
- adhere to its abstraction
- extend it if the abstraction is correct

Do not create a second version of the same idea.

## Abstraction Rule

Do not avoid abstraction when duplication is real.

If the same rule, setup, mapping, or workflow appears in multiple places, the agent must move toward one clear abstraction.

Wrong: many concrete copies.

Right: one named owner for one shared responsibility.

## What Counts As Duplication

- repeated test mocks or render/setup blocks
- repeated mapping or normalization
- repeated validation rules
- repeated branching for the same business rule
- repeated error-handling around the same dependency
- repeated UI state wiring
- repeated orchestration of the same calls
- new helpers that overlap with old helpers

## Search Rule

Search by intent, not exact text.

Use:
- domain names
- synonyms
- nearby modules
- similar tests
- related types
- dependency names

Search for both:
- existing implementation
- existing abstraction

## Decision Rule

Reuse when the same problem is already solved.

Adhere when the abstraction already exists.

Extract or introduce an abstraction when the duplication is real and stable.

Do not extract when similarity is tiny, accidental, or likely to diverge.

Do not hide duplication inside vague `utils` or `helpers` buckets.

## Tests

Repeated test setup is real duplication.

If many tests build the same world, use one fixture, builder, helper, or shared setup with clear ownership.

If a test abstraction already exists, use it.

## Review Output

`[SEMANTIC DUPLICATION] <file>:<line or block> — <what is duplicated>, <where similar logic already exists>, <required consolidation>`

`[ABSTRACTION DRIFT] <file>:<line or block> — <responsibility duplicated outside the proper abstraction>, <where the abstraction exists or should exist>, <required convergence>`

## Anti-Patterns

- new helper without codebase search
- renamed copy of existing logic
- repeated setup left in many tests
- parallel abstractions for one concept
- refusing abstraction after duplication is already real

## Done Check

Ask:
1. Did I search for this responsibility?
2. Did I search for the abstraction that should own it?
3. Am I adding a new concept, or repeating an old one?
4. If similar code exists, why am I not reusing or converging?

If the answers are weak, the work is not ready.
