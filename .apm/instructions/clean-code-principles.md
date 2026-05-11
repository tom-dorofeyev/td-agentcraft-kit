# Engineering Quality Standards

These standards are always-on for engineering agents.

`software_engineer`, `code_reviewer`, `software_architect`, and `qa_engineer` must treat the relevant clean-code, testing, SOLID, and architecture skills under `skills/` as part of their base contract on every task in their domain.

Skill loading is still useful for pulling in the full procedure and examples, but compliance with those standards does not depend on a separate load step being remembered at runtime.

At minimum:
- `software_engineer` always applies naming, functions, comments, classes, SOLID, error handling, tests, clean architecture, and semantic duplication standards while implementing.
- `code_reviewer` always applies the same implementation-quality standards, plus security and readability, while reviewing.
- `software_architect` always applies clean architecture, SOLID, class design, code smell, and design decision standards while designing and doing conformance review.
- `qa_engineer` always applies test-plan and test-code-quality standards while planning and verifying behavior.

Non-engineering agents do not apply these rules unless their task explicitly calls for them.
