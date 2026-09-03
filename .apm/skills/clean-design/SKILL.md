---
name: clean-design
description: Use when designing, implementing, refactoring, or reviewing software to apply clean design, clean code, tests, security, and code-smell guidance. Load only the references selected by the task.
---

# Clean Design

This skill contains the existing clean-code and clean-design standards as references. Load only the references selected below; do not load the whole catalogue.

## Design references

- For HLD, LLD, layer boundaries, dependency direction, adapters, repositories, controllers, or external-service boundaries, load [Clean Architecture](references/design/clean-architecture.md).
- For bounded contexts, ubiquitous language, subdomains, aggregates, entities, value objects, domain events, or context mapping, load [Domain-Driven Design](references/design/domain-driven-design.md).
- For responsibilities, extension points, substitutability, interface scope, or dependency inversion at any level, load [SOLID](references/design/clean-code-solid.md).

## Code references

- For variables, functions, classes, interfaces, tests, or files whose names are being written or reviewed, load [Naming](references/code/clean-code-naming.md).
- For functions or methods, including abstraction level, arguments, command-query separation, side effects, or duplication, load [Functions](references/code/clean-code-functions.md).
- For classes, interfaces, or modules, including cohesion, responsibility, literals, or predicates, load [Classes](references/code/clean-code-classes.md).
- For comments, documentation comments, TODOs, banners, or commented-out code, load [Comments](references/code/clean-code-comments.md).
- For exceptions, error codes, null handling, try/catch blocks, or third-party failures, load [Error Handling](references/code/clean-code-error-handling.md).
- For writing or reviewing tests, load [Tests](references/code/clean-code-tests.md), plus the production-code references relevant to the test code.
- For a review or refactoring diagnosis with concrete evidence of a structural problem, load [Code Smells](references/code/code-smells.md). Do not use it for speculative findings.

## Security reference

- For external input, authentication, authorisation, data persistence, secrets, cryptography, user-controlled URLs or paths, deserialisation, or a security review, load [Security](references/security/clean-code-security.md). Every security finding is blocking.

## Review selection

For a quality or architecture review, load each reference relevant to the changed code and requested review scope. Load design references for architectural or domain-model changes, code references for the implementation concerns present, and the security reference whenever a security boundary is affected.
