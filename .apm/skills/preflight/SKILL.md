---
name: preflight
description: Validates that all required quality measurement tools are available. Installs missing tools globally. Caches confirmed tool state so subsequent runs skip checks.
---

# Preflight Check

Bias for action: install globally, keep git clean. Once tools are confirmed, state is cached and subsequent runs are instant.

## Golden Rule

- Install globally or user-local (`pip install --user`, `npm install -g`). Never touch project files.
- If a tool needs project-level config (JaCoCo in pom.xml, etc.), ask. If declined, use global fallback.
- Tool artifacts (reports, coverage data) → always add to `.gitignore` without asking.

## Step 0 — Cache Check

```bash
cat .apm/preflight-state.yaml 2>/dev/null || echo "missing"
```

- **All tools `available: true`** → skip all checks, report "All 4 capabilities confirmed (cached)", exit.
- **Some tools missing/declined** → re-check only those.
- **File missing** → full run.
- **Force re-check** if user requests or `last_check` > 30 days.

## Gitignore — Auto-Applied

| Tool | Patterns |
|---|---|
| `nyc` / `c8` | `.nyc_output/`, `coverage/` |
| `pytest-cov` / `coverage` | `.coverage`, `htmlcov/`, `coverage.xml` |
| JaCoCo (Maven) | `target/site/jacoco/`, `target/jacoco.exec` |
| JaCoCo (Gradle) | `build/reports/jacoco/`, `build/jacoco/` |
| `jscpd` | `.jscpd-report/`, `.jscpd-report.json` |

## Step 1 — Complexity & Duplication

```bash
lizard --version 2>/dev/null || pip install --user lizard
jscpd --version 2>/dev/null || npm install -g jscpd
```

Fallback for jscpd: `npx jscpd`. If both fail → record as missing for collective prompt.

## Step 2 — Coverage

| Signal | Language | Tool | Install |
|---|---|---|---|
| `package.json` | JS/TS | nyc, c8, vitest, jest | `npm install -g nyc` or `npx` |
| `pyproject.toml`, `setup.py`, `requirements*.txt` | Python | pytest-cov | `pip install --user pytest-cov coverage` |
| `go.mod` | Go | built-in | `go test -cover` (no install) |
| `pom.xml` | Java (Maven) | JaCoCo | Ask before editing pom.xml |
| `build.gradle(.kts)` | Java (Gradle) | JaCoCo | Ask before editing build.gradle |
| None detected | Unknown | — | Ask the user |

Verify:
```bash
# JS/TS
npx nyc --version 2>/dev/null || nyc --version 2>/dev/null || echo "missing"
# Python
python -c "import coverage" 2>/dev/null || pip install --user coverage
# Go
go version 2>/dev/null && go test -cover ./... 2>&1 | head -1
# Java — only if user approved plugin
mvn jacoco:help 2>/dev/null || echo "JaCoCo not configured (user declined)"
```

## Step 3 — Collective Prompt

After Steps 1-3, present all tools that could not be auto-installed in a single prompt:

```
Preflight — tools needed: jscpd, pytest-cov, cucumber-jvm
[y] install now  [s] skip (gate will warn)  [a] abort
```

Never auto-skip. Every gap must be explicitly acknowledged. `s` → record as `declined` and continue with warning. `a` → stop.

## Step 4 — Cache

Write `.apm/preflight-state.yaml`:

```yaml
last_check: "<ISO-8601>"
project_language: "<js|python|go|java|unknown>"
tools:
  lizard:    { available: true,  install_method: "pip install --user lizard" }
  jscpd:     { available: true,  install_method: "npm install -g jscpd" }
  coverage:  { available: true,  tool: "nyc", install_method: "npx nyc" }
gitignore_updated: true
warnings: []
```

Add `.apm/preflight-state.yaml` to `.gitignore`.

## Step 6 — Report

```
Preflight — <project>
=====================
✓ lizard  ✓ jscpd  ✓ coverage (nyc)
✓ .gitignore updated  ✓ State cached
All capabilities present.
```

If gaps: show `✗` with reason, note which gates are skipped. Block only on `a` (abort).
