---
name: static-code-analysis
description: Require static-analysis quality gates for every executable code change.
---

# SKILL: Static Code Analysis

## Purpose

Every code change must pass this gate before it is described as complete, working, or ready. Run it for the changed production code, tests, scripts, and runtime-affecting configuration. The skill enforces cyclomatic complexity via `lizard` or `lizard.exe` and duplication percentage via `jscpd`.

## Inputs

- One or more file or directory paths to analyze
- The current change set, so findings can be scoped to in-diff lines versus legacy code
- Threshold values defined in this skill

## Outputs

- `lizard` warning output for over-threshold functions in the analyzed paths
- `jscpd` JSON duplication report for the analyzed paths
- A scoped result that separates findings attributable to the current change set from legacy findings outside it
- A pass/fail decision based only on findings attributable to the current change set

## Thresholds

All quality thresholds live in this skill.

- Cyclomatic complexity: max `10`
- Changed-line duplication: max `10%`
- Changed-line coverage: must be above `90%`

Do not repeat numeric thresholds anywhere else. Reference this skill instead.

## Scope Policy

Run whole-file tools, but enforce thresholds only for findings that intersect the current change set.

- Complexity fails only when an over-threshold function intersects changed lines in the current diff.
- Duplication fails only when duplicated blocks intersect changed lines and the duplicate can be attributed to the current change set.
- Coverage fails only when changed-line coverage is at or below the configured minimum.
- Existing out-of-scope violations elsewhere in touched files are recorded as legacy context, not forced as part of the current task.

## Run

Run the bundled script; do not construct analyzer commands manually:

```bash
node .apm/skills/static-code-analysis/scripts/run-static-analysis.mjs <file-or-directory> [...]
```

Pass `--report-dir <directory>` only when reports must be retained. Otherwise the script writes them to a temporary directory and prints its path. It exits non-zero for missing tools, invalid targets, complexity-tool failures, duplication above the configured threshold, or a clean-code violation.

Wait for the command to exit; partial output is not completion, and the gate passes only with exit status `0` plus `Static analysis completed successfully.`

For JavaScript and TypeScript files (`.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`, `.tsx`), it also runs pinned, temporary ESLint and TypeScript parser packages with an isolated ruleset. It does not read or modify the project's ESLint configuration, dependencies, source, or ignore files. The rule set enforces functions of at most 20 non-blank, non-comment lines; at most three parameters; and no direct `true` or `false` call arguments. Without type information, it deliberately enforces boolean literals only, not boolean variables.

Each JavaScript violation is an error. The runner prints its location, rule ID, and a rule-specific refactoring direction; treat that direction as required unless the rule itself is changed.

The caller must compare findings against the current diff and only treat overlapping findings as blocking.

## Gate Semantics

- The script invokes `lizard`, `jscpd`, and the isolated JavaScript clean-code linter with its own thresholds and rules.
- The script reports the temporary or requested JSON report directory plus the clean-code report location.
- Default thresholds come from this skill.
- Reported findings must be scoped back to the current diff before they are treated as blocking.
- If `lizard` or `jscpd` is not installed, the result is an environment prerequisite failure.

## Gate

Run this analysis after editing executable code and before declaring the change complete. Include the exact command and its pass/fail result with the completed change.

If the analysis fails, resolve every finding attributable to the current change or keep the work incomplete. Legacy findings outside the change set must be reported as context, but do not block the change.
