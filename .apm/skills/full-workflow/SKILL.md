---
name: full-workflow
description: Full multi-gate engineering workflow for features, non-trivial changes, and anything introducing new abstractions — requires QA test plan, orchestrator verification, peer code review, architecture review, and a runtime quality gate before QA verification.
---

# Full Workflow

For any engineering work that does not qualify for the Fast Path: new features, non-trivial changes, multi-file refactors, or any change that introduces new abstractions, interfaces, or architectural boundaries.

## Incremental Delivery Policy

The goal is **continuous forward progress**, not stopping after each slice. Micro-slices exist so that if the session is interrupted (rate limit, timeout, or crash), the work done so far is already in a fully working, verifiable state — nothing is left half-finished.

- Before implementation starts, ensure work happens on a dedicated task branch created for this task. Existing branches are off-limits by default. If the work must continue on an already existing branch, obtain explicit user permission first. Otherwise, create a new branch for the task and perform all subsequent work there.
- Keep the slice scoped to the current task. Do not pull unrelated files, unrelated refactors, or opportunistic cleanups into the slice. If unrelated changes are discovered, leave them out of the slice and continue with only task-relevant work.
- Plan work in **micro-slices**: the smallest independently shippable unit that produces a verifiable behavior change. If a slice takes more than one Engineering agent call to implement, it is too large — split it.
- **Keep working**: after one slice reaches `done`, re-assess the remaining plan, then immediately start the next slice. Never wait for user input between slices unless re-assessment produces a plan change that requires a Product Specialist consult.
- A slice must reach `done` before work on the next slice begins — never work on two slices in parallel, and never start a new slice while the current one is still in review or QA.
- Never batch many unfinished changes waiting for one large final review; this is explicitly disallowed.
- Every handoff must identify slice id/status: `pending`, `in-review`, `qa-verifying`, or `done`.
- Each completed slice must be captured in its own git commit on the task branch after it passes all gates and QA verification. Do not leave a `done` slice uncommitted, and do not bundle multiple slices into one commit.
- Before each slice commit, verify that the committed diff contains only task-relevant changes. Exclude unrelated files and unrelated edits even if they are present in the branch or working tree.
- **If interrupted at any point**, the last `done` slice represents the safe, working state of the codebase. Incomplete slices in progress are discarded or rolled back — only completed slices count.

## Mandatory Review Gates (in order)

Implementation must pass **all five** gates before reaching QA.

### Gate 1 — QA Test Plan Approved (QA Engineer, before implementation begins)

- Before any implementation starts, route the spec + architecture design to the **QA Engineer** to produce a test plan and acceptance criteria.
- The test plan must cover: happy paths, edge cases, negative paths, and regression scope.
- Implementation does not begin until the test plan is approved by the Orchestrator.
- Purpose: the engineer must know *what proof of work is required* before writing a single line of code. Without this, "proof of work" is undefined and peer review becomes subjective.

### Gate 2 — Orchestrator Verification (Team Leader)

- The **Team Leader** runs this gate directly before any downstream reviewer is invoked.
- This gate owns the measurable checks that can be verified by executing commands or inspecting hard evidence: build, full test suite, static analysis, changed-line coverage when available, and proof-of-work presence.
- The Team Leader stops on the first failing check and returns the raw command output or exact missing-evidence condition to the implementing engineer.
- Store the raw command output in the slice record. Downstream agents receive only a concise verification summary unless a failure must be returned unchanged.

### Gate 3 — Peer Code Review (Code Reviewer)

- Route the implementation artifact to the **Code Reviewer** agent.
- Only invoke this gate after Gate 2 has passed; attach only the concise verification summary to the handoff, not the raw logs.
- The Code Reviewer independently evaluates the implementation for non-deterministic concerns and returns a structured approval or rejection report.
- On the first review cycle, if the reviewer reports only non-blocking findings, route the artifact back to the implementing engineer for one mandatory polish pass before advancing. This does not change the review verdict to rejected; it is a workflow-level quality pass that applies only once per slice at Gate 3.
- If rejected, route back to the implementing engineer with the Code Reviewer's structured rejection report.

### Gate 4 — Architecture Conformance Review (Software Architect)

- Architect confirms: implementation matches the approved design, all architectural boundaries are respected (persistence, API, external services), no layer violations, interfaces are used as designed, no undocumented deviations from the architecture plan.
- If rejected, route back to the implementing engineer with a precise gap description referencing the original design artifact.

### Gate 5 — Runtime Quality Gate (Orchestrator, mandatory before cycle close)

This gate is executed by the orchestrator — not delegated to any agent — immediately after Gate 4 is approved and before the slice is handed to QA. Its purpose is to independently verify that the codebase is still in a working state, using hard evidence from real commands. Agent claims of "it works", "tests pass", or "build succeeded" are **not accepted as evidence** — the orchestrator must run the commands itself and observe the output.

Verification steps (run in order, stop and reject on first failure):

1. **Build check** — run the project's build command (e.g. `npm run build`, `tsc`, `cargo build`, `go build ./...`). A non-zero exit code fails the gate immediately.
2. **Test suite** — run the full automated test suite (e.g. `npm test`, `pytest`, `go test ./...`). Any failing test fails the gate. Zero tests is also a failure unless the slice is documentation-only.
Do not start or run the application. Build + tests are sufficient evidence of a working state.

On failure:
- The slice is **not done**. It is rolled back to `in-review`.
- Route back to the implementing engineer with the exact command output (not a summary — paste the raw stdout/stderr). Do not soften or paraphrase the failure.
- The engineer must fix the issue and re-submit from Gate 2. There are **no shortcuts**: a failing build or failing tests mean the work is incomplete, regardless of what any agent reported.
- Track the cycle count. If Gate 4 fails at cycle 2, follow the Loop Detection & Resolution Protocol below.

On success:
- Attach the command output as proof to the slice record.
- Hand off to QA verification with only a concise verification summary; keep the raw logs in the slice record unless QA explicitly needs a failure trace.

> **Trust policy**: agents are expected to be honest, but mistakes happen. Gate 4 exists precisely because an agent may genuinely believe it succeeded yet the code is still broken. The orchestrator does not assume bad faith — but it also does not assume correctness. Real command output is the only acceptable proof.

## Loop Detection & Resolution Protocol

A **cycle** is one complete round-trip: an artifact is submitted to a gate, rejected, returned to the engineer, revised, and re-submitted. The orchestrator tracks cycle count per artifact per gate via `skills/state-management-logging/SKILL.md`.

### At cycle 2 — re-route before retrying

Stop the loop. Identify the loop type and delegate resolution to the responsible agent. Do not retry the gate until resolution is confirmed.

| Loop Type | Symptom | Delegate resolution to |
|---|---|---|
| **Ambiguity** | Gate rejects because requirement or design is unclear or contradictory | **Product Specialist** — re-run the clarification batch and issue a revised spec |
| **Conflicting requirements** | Two gates have contradictory demands | **Software Architect** — produce a binding ruling that resolves the conflict; document it |
| **Capability** | Engineer produces the same broken output despite clear feedback | **Software Architect** — re-issue the design handoff with tighter decomposition and constraints |
| **Miscalibration** | A reviewer applied a NON-BLOCKING rule as BLOCKING | **Code Reviewer** — re-evaluate the specific finding against the Severity Model and issue a corrected report |

If delegation resolves the loop, **reset the cycle counter** and continue.

### At cycle 4 — halt and escalate to user

If internal resolution at cycle 2 did not break the loop, and the artifact reaches cycle 4, mark the slice `blocked` and send the user one structured, multi-part question covering everything that needs human resolution. Do not re-enter the loop without a user response.

> **Hard cap: no artifact may exceed 4 cycles through any single gate.** This is the token budget protection rule. A fourth rejection without resolution means something is fundamentally wrong that no amount of retrying will fix.

## Slice Definition of Done

A slice is only marked done when **all** of the following are true:

- Behavior for that slice is implemented and demonstrable.
- **Proof of work exists and is verified by the Team Leader**: automated tests (unit, integration, or e2e) are written, executed, and pass — covering happy path, edge cases, and negative paths. This is the default expectation. When automated tests are genuinely impractical, an explicit documented alternative must be provided and verified. A slice with no verification evidence on record is not done, regardless of any other approval.
- Gate 1 approved (QA test plan on file before implementation began).
- Gate 2 approved.
- Gate 3 approved.
- Gate 4 approved.
- Gate 5 passed (build succeeds and the full test suite passes — with raw command output attached as proof).
- QA verification passed for that slice.
- A dedicated commit for that slice exists on the task branch so the workflow can safely revert to the last known-good slice boundary if later work goes wrong.

> **Proof-of-Work Policy**: Code that arrives at any review gate with no Team Leader verification summary is rejected immediately and routed back to the engineer. Automated tests are the strong default — any exception must be explicitly justified and documented, not silently omitted.
