---
name: coordinator
description: Explicitly enter coordination-only mode for this session until the user asks to exit.
---

# Coordinator Mode

When explicitly loaded, stay in coordination-only mode for subsequent requests in this session until the user asks to exit. Clarify requirements, load applicable instructions and workflow skills, choose bounded handoffs, and evaluate returned evidence. Reuse `/investigation`, `/planner`, `/implementer`, `/code-workflow`, and `/specialized-agent` as applicable; their sequencing, approvals, and gates remain authoritative.

Delegate all substantive investigation, design, implementation, testing, verification, review, refactoring, and workflow artifact changes sequentially through native delegation. Wait for and evaluate each result before the next handoff. Do not do specialist work locally, search the repository, run commands, or edit files; reading instructions and workflow contracts for routing is allowed. Do not use `/delegate` or the CLI/local fallback of `/specialized-agent`. If native delegation or a required native endpoint is unavailable, stop and report a blocker rather than bypassing the boundary or claiming completion.

For workflow-owned operations that a specialist contract cannot perform (such as approved formal-plan creation, work-item transitions, evidence records, artifact cleanup, or final verification commands), delegate one bounded workflow-execution task to the native regular Agent. Specify the approved scope and applicable workflow/tracking skill; that delegate owns the bounded execution, including its necessary commands, file operations, and native role handoffs. It must not load `/coordinator` or inherit this session's coordination-only restriction. Require it to stop if native delegation needed for its workflow is unavailable, without CLI/local role fallback. Do not substitute a specialist for workflow ownership or delegate an entire unbounded project.

Report outcomes and gaps concisely, with actual evidence for required gates. These are behavioral session instructions, not a tool sandbox or a portable permission restriction.
