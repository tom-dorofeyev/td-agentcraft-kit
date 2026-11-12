# Clean Code — Tests

## Rules

### F.I.R.S.T.
- **Fast**: keep tests as fast as their purpose permits. Use test doubles for slow or unreliable dependencies when they do not obscure the behaviour under test.
- **Independent**: tests must not depend on each other. Any test can run in any order, in isolation, and must produce the same result. Shared mutable state between tests is a violation.
- **Repeatable**: tests produce consistent results across environments. Control external dependencies, time, and randomness; use isolated temporary files when filesystem behaviour matters.
- **Self-validating**: a test passes or fails — no manual inspection of output or logs. Every test has an assertion.
- **Timely**: tests are written before or alongside the code they cover, never weeks later.

### Test Structure and Clarity
- **One behaviour per test**: focus each test on one behaviour; related assertions may verify its observable outcomes. A failing test name must identify what broke.
- **No `should` prefix**: `should return user when found` — remove "should". Name tests as statements of fact: `returnsUserForValidId`, `throws when id is missing`.
- **AAA — Arrange, Act, Assert**: keep setup, actions, and assertions clear. Multiple actions are appropriate when the behaviour requires a sequence.
- **Short tests signal healthy design**: keep tests focused and readable; extract setup or split behaviours when it improves clarity.
- **Extract shared setup**: use factories or fixtures when they reduce duplication without hiding relevant test details.

### Test Scope and Integrity
- **Test observable outcomes, not implementation**: derive expected results from requirements, examples, or contracts, not by repeating production logic. An equivalent refactor must not break the test.
- **Use doubles at boundaries**: avoid asserting private collaboration or call order unless an interaction is itself required behaviour. Do not mock the behaviour being tested.
- **Test code is production code**: Clean Code, naming, functions, and comments rules apply equally to test files.
- **No magic values in tests**: use named constants or descriptive builder parameters — `userId: KNOWN_ACTIVE_USER_ID` instead of bare `42`.

## When Writing

Before committing any test:
1. Does the test name state a fact about behaviour without "should"?
2. Does the test focus on one behaviour, with expected results independent of the implementation?
3. Are external dependencies, time, and randomness controlled without replacing the behaviour under test?
4. Would a semantically equivalent refactor of the production code break this test? If yes, it is testing implementation — rewrite.
5. Would a plausible defect in the requested behaviour make the test fail?
6. Does shared setup improve clarity without hiding the scenario?

## When Reviewing

Flag any test that:
- Has `should` in its name
- Derives expected results from production logic or would pass despite a plausible behavioural defect
- Asserts on internals or incidental interactions rather than observable behaviour
- Would break if the production code was correctly refactored to produce the same output
- Has setup or fixtures that obscure the scenario
- Has more than one distinct behaviour as its subject
- Relies on uncontrolled time, external I/O, network, randomness, or environment variables
- Has no assertion (silent pass)
- Has test code that violates naming, functions, or comments rules
- Contains bare magic literals with no explanation

Cite: `[TEST QUALITY] <test file>:<test name or line> — <rule violated and concrete improvement>`
