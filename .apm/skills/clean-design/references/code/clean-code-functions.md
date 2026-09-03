# Clean Code — Functions

## Rules

- **Small**: functions should rarely exceed 20 lines. Most should be under 10. If you need to scroll past a function, it is too long.
- **Do one thing**: a function does one thing if you cannot extract a meaningful sub-function from it. If you need "and" to describe what it does, split it.
- **One level of abstraction per function**: do not mix high-level orchestration (`processOrder`) with low-level details (`query("SELECT …")`) in the same function body. Read top to bottom as a newspaper narrative.
- **Descriptive names**: a long descriptive name is better than a short cryptic name or a comment. `findUsersByActiveSubscription` beats `getUsers`.
- **Minimal arguments**:
  - 0 args: ideal
  - 1 arg: good
  - 2 args: acceptable, consider naming
  - 3 args: avoid — use a parameter object instead
  - 4+ args: never — always use an object/struct
- **No flag arguments**: a boolean parameter announces that the function does two things. Split it into two functions.
- **Command-Query Separation (CQS)**: a function either *does* something (command — returns void, changes state) or *answers* something (query — returns a value, no side effects). Never both. `setAndCheckName()` is a violation.
- **No side effects**: functions that appear to query should not secretly mutate state. Temporal coupling and hidden state changes are the result.
- **Prefer exceptions to error codes**: returning error codes forces callers to handle errors inline and pollutes the call site. Throw typed exceptions instead.
- **Extract try/catch bodies**: the body of a try block and the catch block should each be extracted into their own functions. Error handling is its own concern.
- **DRY**: every occurrence of duplicated logic is a missed abstraction. Apply the Rule of Three — extract on the third occurrence, not the first or second.

## When Writing

Write the complete function first — do not stop mid-implementation to extract. Stopping to refactor before the function is finished breaks flow and creates half-formed logic. Once the function is complete and working, apply the checklist below before committing.

Post-completion checklist:
1. Can I state what this function does in one phrase without "and"? If not, identify the boundary and extract.
2. Are all statements at the same level of abstraction? If not, pull the low-level steps into named sub-functions.
3. Does it have 3 or fewer arguments? If not, can I make a parameter object?
4. Does it either return a value *or* change state — but not both?
5. Is any logic here duplicated elsewhere in the codebase (Rule of Three)?

The goal after completing a function is to end up with many small, named functions — but arrive at them by extracting from a working whole, not by guessing structure upfront.

## When Reviewing

Flag any function that:
- Exceeds 20 lines without a clear structural justification
- Requires "and" to describe its purpose
- Mixes levels of abstraction (e.g., a high-level orchestration call alongside a raw SQL string or bit-manipulation)
- Has 3 or more arguments where a parameter object is clearly applicable
- Has a boolean (`true`/`false`) as a direct argument
- Both changes state and returns a meaningful value (CQS violation)
- Has a try/catch whose body is more than a single delegating call
- Contains logic that appears verbatim or near-verbatim elsewhere in the codebase

Cite: `[FUNCTIONS] <file>:<line or function name> — <rule violated and why>`
