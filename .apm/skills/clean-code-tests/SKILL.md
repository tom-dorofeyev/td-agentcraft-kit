---
name: clean-code-tests
description: Use when writing, modifying, refactoring, or reviewing tests to enforce clean, reliable, single-behaviour test code following F.I.R.S.T. and TDD discipline. Derived from Clean Code Chapter 9.
---

# SKILL: Clean Code — Tests

## Rules

### F.I.R.S.T.
- **Fast**: tests must run in milliseconds. Slow tests stop being run. If a test is slow, it is hitting real infrastructure — inject a test double instead.
- **Independent**: tests must not depend on each other. Any test can run in any order, in isolation, and must produce the same result. Shared mutable state between tests is a violation.
- **Repeatable**: tests produce identical results in any environment — dev machine, CI, any time of day. No reliance on network, real filesystem, wall-clock time, or random values.
- **Self-validating**: a test passes or fails — no manual inspection of output or logs. Every test has an assertion.
- **Timely**: tests are written before or alongside the code they cover, never weeks later.

### Test Structure and Clarity
- **One behaviour per test**: each test verifies exactly one observable outcome. A failing test name alone must identify what broke — without reading the body.
- **No `should` prefix**: `should return user when found` — remove "should". Name tests as statements of fact: `returnsUserForValidId`, `throws when id is missing`.
- **AAA — Arrange, Act, Assert**: one setup block, one action, one assertion block. Never interleave setup and assertions. Never repeat the action.
- **Short tests signal healthy design**: aim for under 15 lines per test body. Long tests signal repeated setup (extract a factory/fixture) or multiple behaviours (split into focused tests).
- **Extract shared setup**: repeated arrange code across tests must be extracted into factory helpers or a `beforeEach` fixture. Test code follows the same DRY rule as production code.

### Test Scope and Integrity
- **Test observable outcomes, not implementation**: assert on the public, visible result. Never assert on internal state, private methods, or the sequence of method calls. An equivalent refactor that produces the same output must not break any test.
- **Never test internals via mocks**: if you need a mock to assert that a private collaborator was called in a certain way, the production design likely needs refactoring.
- **Test code is production code**: Clean Code, naming, functions, and comments rules apply equally to test files.
- **No magic values in tests**: use named constants or descriptive builder parameters — `userId: KNOWN_ACTIVE_USER_ID` instead of bare `42`.

## When Writing

Before committing any test:
1. Does the test name state a fact about behaviour without "should"?
2. Is there exactly one action and one assertion focus?
3. Is the test touching real network, filesystem, clock, or random values? Replace with test doubles.
4. Would a semantically equivalent refactor of the production code break this test? If yes, it is testing implementation — rewrite.
5. Does the arrange block exceed 5–8 lines? Extract a factory or fixture.

## When Reviewing

Flag any test that:
- Has `should` in its name
- Asserts on internal state, private methods, or call order rather than on observable output
- Would break if the production code was correctly refactored to produce the same output
- Has an arrange block longer than ~8 lines without extraction
- Has more than one distinct behaviour as its subject
- Relies on wall-clock time, real I/O, real network, or environment variables
- Has no assertion (silent pass)
- Has test code that violates naming, functions, or comments rules
- Contains bare magic literals with no explanation

Cite: `[TEST QUALITY] <test file>:<test name or line> — <rule violated and concrete improvement>`
