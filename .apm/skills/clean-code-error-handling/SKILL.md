---
name: clean-code-error-handling
description: Rules for robust, readable error handling using exceptions instead of error codes or nulls. Derived from Clean Code Chapter 7.
---

# SKILL: Clean Code — Error Handling

## Rules

- **Use exceptions, not error codes**: returning error codes forces every caller to check the return value inline, polluting the call site with defensive logic. Throw typed, named exceptions instead.
- **Write the try/catch first**: start error-handling code with the `try` block. Define what the call site can expect (what succeeds, what is thrown) before filling in the happy path.
- **Extract try/catch bodies**: the body inside `try` and the body inside `catch` should each be a single delegating call to an extracted function. Error handling is its own responsibility; do not mix it with logic.
- **Define exceptions in terms of the caller's needs**: categorise exceptions by how the *caller* needs to respond, not by where in the system the error originated. Wrap third-party exceptions at the boundary so domain code never sees vendor-specific exception types.
- **Never return null**: returning null forces every caller to check for null — a discipline that always fails eventually. Throw an exception if the case is truly erroneous, or return a Null Object / empty collection if absence is normal.
- **Never pass null**: passing null as an argument is an invitation for a runtime error. If an argument can be absent, use an `Optional` type or overload the function. Treat null as an unchecked error at system boundaries, not a valid value inside business logic.
- **Provide context in exceptions**: include enough information in the exception message to understand what was being attempted and why it failed. A stack trace alone is not enough.
- **Do not swallow exceptions**: `catch (Exception e) {}` hides failures silently. Either handle the error meaningfully or let it propagate.

## When Writing

Before committing any error-handling code:
1. Am I communicating failure via exception or via return value? Switch to exception if using return value.
2. Is my try block body a single call to an extracted function?
3. Could the caller receive `null` from this function? If yes, throw or return a Null Object instead.
4. Am I exposing a third-party exception type across a boundary? Wrap it.
5. Does my exception message tell a new developer what went wrong and where?

## When Reviewing

Flag any code that:
- Returns an error code, sentinel value (`-1`, `""`, `false`), or null to signal failure where an exception is appropriate
- Has a `try` block body longer than a single delegating call (error-handling mixed with logic)
- Has an empty `catch` block or a catch that only logs without rethrowing or handling
- Returns `null` from a function where absence is an error condition
- Accepts `null` as a parameter in business logic
- Exposes a third-party exception type (`SQLException`, `AxiosError`, etc.) in application or domain code
- Uses a generic `Exception` catch without justification
- Has uninformative exception messages that provide no actionable context

Cite: `[ERROR HANDLING] <file>:<line or function name> — <rule violated and concrete improvement>`
