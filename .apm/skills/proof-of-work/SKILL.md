---
name: proof-of-work
description: Require executable, requirement-focused proof whenever writing or changing production code, tests, scripts, or configuration that changes runtime behavior.
---

# Proof of Work

Every code change needs evidence that the requested behavior works. Before editing executable code, identify the observable requirement and the smallest automated check that proves it.

## Required Evidence

- Add or update a test that would fail if the requested behavior were absent or wrong. Test observable behavior, not implementation details.
- Run that focused test after the change. Run the project's build and full relevant test suite when available.
- Report the exact commands and their pass/fail results with the completed change.

Use the repository's existing test framework and conventions. For a bug fix, first reproduce the defect with a failing test where practical. For a new behavior, write the acceptance or unit/integration test before or alongside the implementation.

## Valid Alternatives

When an automated test cannot exercise the change, use the strongest executable verification available, such as a compiler/type check, linter with a behavior-specific rule, integration harness, smoke test, or reproducible command. State why a conventional test is not possible, what was run, and the remaining gap.

Build success, type checking, linting, code review, and an assertion-free command alone are not proof of the requested behavior when a behavior-focused test is feasible.

## Gate

Do not describe a code change as complete, working, or ready until its evidence passes. If verification is blocked or fails, keep the change incomplete, report the blocker or failure, and do not claim proof.
