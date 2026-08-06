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

## Prerequisite

Install both tools once:

```bash
pip install lizard
npm install -g jscpd
```

If either tool is missing when the command runs, stop and tell the user exactly what to install before continuing:

- `pip install lizard`
- `npm install -g jscpd`

Do not treat a missing tool as a code failure. Treat it as an environment prerequisite that the user needs to satisfy.

## How to run

Run the tools directly.

Complexity:

```bash
lizard --warnings_only --CCN 10 <file-or-dir> [...]
```

Duplication:

```bash
jscpd --threshold 10 --reporters json --output .jscpd-report <file-or-dir> [...]
```

Or, without a global install:

```bash
npx jscpd --threshold 10 --reporters json --output .jscpd-report <file-or-dir> [...]
```

The tools analyze the provided paths. The caller must compare findings against the current diff and only treat overlapping findings as blocking.

## Examples

```bash
# Single file
lizard --warnings_only --CCN 10 src/app.ts

# Directory duplication report
jscpd --threshold 10 --reporters json --output .jscpd-report src/

# npx fallback
npx jscpd --threshold 10 --reporters json --output .jscpd-report src/
```

## Gate Semantics

- `lizard` enforces the per-function complexity budget.
- `jscpd` reports duplication across the provided paths.
- Default thresholds come from this skill.
- Reported findings must be scoped back to the current diff before they are treated as blocking.
- If `lizard` or `jscpd` is not installed, the result is an environment prerequisite failure with the required install command.
