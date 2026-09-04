---
name: static-code-analysis
description: Runs a static code analysis gate using lizard for cyclomatic complexity and jscpd for duplication.
---

# SKILL: Static Code Analysis

## Purpose

Run a lightweight static code analysis gate for one or more source files. The skill currently enforces cyclomatic complexity via `lizard` or `lizard.exe` and duplication percentage via `jscpd`.

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

Run the bundled script; do not construct `lizard` or `jscpd` commands manually:

```bash
node .apm/skills/static-code-analysis/scripts/run-static-analysis.mjs <file-or-directory> [...]
```

Pass `--report-dir <directory>` only when reports must be retained. Otherwise the script writes them to a temporary directory and prints its path. It exits non-zero for missing tools, invalid targets, complexity-tool failures, or duplication above the configured threshold.

The caller must compare findings against the current diff and only treat overlapping findings as blocking.

## Gate Semantics

- The script invokes `lizard` and `jscpd` with the skill's thresholds.
- The script reports the temporary or requested JSON report directory.
- Default thresholds come from this skill.
- Reported findings must be scoped back to the current diff before they are treated as blocking.
- If `lizard` or `jscpd` is not installed, the result is an environment prerequisite failure.
