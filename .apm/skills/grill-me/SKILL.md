---
name: grill-me
description: Resolve unclear requirements through a temporary Markdown questionnaire with batched checkbox questions. Use when requirements or success criteria are unclear, the user wants to stress-test a plan, or explicitly mentions "grill me".
---

# Batched Requirement Clarification

Resolve requirements without a prolonged one-question-at-a-time interview. Ask only questions that materially affect scope, acceptance criteria, design, or delivery risk. Explore the codebase first for answers available there; do not ask the user to supply discoverable facts.

## Questionnaire

Create one temporary `clarification-<topic>.md` in the workspace root. Reuse this session's existing questionnaire; never overwrite an unrelated file. This is a temporary discussion aid, not a formal plan or tracked work item.

Put **all currently known questions up front**, grouped by topic and numbered with stable IDs. Provide concrete answer options as checkboxes for every question, identify the recommended option with a short rationale, and always include an `Other` option with space for a custom answer. State whether to select one or multiple options. Use this format:

```markdown
### Q1: What is the initial delivery scope? (Select one)
- [ ] Registration and login only — recommended to keep the first delivery bounded.
- [ ] Registration, login, and password reset.
- [ ] Other — custom answer:

Resolution: Unresolved
```

Checkboxes represent answer selections, not question completion; unselected alternatives need not be checked. The user may select options, write a custom answer when none fit, or answer in chat by question ID; reconcile chat answers into the file. A custom answer is valid without selecting a predefined option. Track each question's resolution separately; mark it resolved only when the answer is clear. Clarify conflicting selections rather than guessing. Recommendations are not accepted by silence. Mark conditional questions with their dependency so the user can identify those that do not apply.

Give the user the file path and ask them to answer the batch, then wait. Do not drip-feed questions in chat or start implementation while material decisions remain unresolved.

## Follow-up and cleanup

After the user responds, read the questionnaire and conversation together. Preserve answered questions; do not ask them again. If answers expose genuinely new blockers or leave questions unanswered, update the same file with one consolidated remaining batch. Do not expand into speculative concerns or reopen settled decisions without new contradictory information.

Stop when all applicable questions are answered and no material ambiguity remains. Mark inapplicable questions resolved with a reason. Capture the confirmed decisions in the conversation or approved plan so they survive cleanup, then delete only this session's questionnaire and verify its removal. Do not delete it while answers remain unresolved or before preserving the decisions. Do not commit the temporary questionnaire.
