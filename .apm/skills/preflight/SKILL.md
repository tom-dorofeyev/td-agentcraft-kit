---
name: preflight
description: Validates that all required quality measurement tools are available. Installs missing tools globally. Never touches project files unless user approves.
---

# Preflight Check

Run at the start of every session before any agent does work. Bias for action: install globally, keep git clean, never block over a tool if there's a fallback.

## Golden Rule

Tools must work. Git must stay clean. Project-level changes are opt-in only.

- **Install tools globally or user-local** (`pip install --user`, `npm install -g`). These never touch the project repo.
- **If a tool absolutely needs project-level config** (JaCoCo in `pom.xml`, `nyc` in `package.json`, etc.), tell the user what would change and ask. If they decline (team decision, big company), use the global fallback instead.
- **Tool artifacts** (reports, coverage data, temp files) → always add to `.gitignore` without asking.

## Gitignore — Always Auto-Applied

Never ask. These are build artifacts, not code:

| Tool | Patterns |
|---|---|
| `nyc` | `.nyc_output/`, `coverage/` |
| `c8` | `coverage/` |
| `pytest-cov` / `coverage` | `.coverage`, `htmlcov/`, `coverage.xml` |
| JaCoCo (Maven) | `target/site/jacoco/`, `target/jacoco.exec` |
| JaCoCo (Gradle) | `build/reports/jacoco/`, `build/jacoco/` |
| `jscpd` | `.jscpd-report/`, `.jscpd-report.json` |
| `lizard` | (no artifacts) |

## Step 1 — Complexity & Duplication

Install globally. Never touches project files.

```bash
lizard --version 2>/dev/null || pip install --user lizard
```

```bash
jscpd --version 2>/dev/null || npm install -g jscpd
```

**Fallback for jscpd if global install fails or user declines:** `npx jscpd` — runs without installing globally.

If both global and fallback fail → tell the user and ask. Only block if they say no.

## Step 2 — Detect Language & Coverage Tool

| Signal | Language | Coverage tool | Global/preferred install |
|---|---|---|---|
| `package.json` | JS/TS | `nyc`, `c8`, `vitest`, or `jest` | `npm install -g nyc` or use `npx` |
| `pyproject.toml`, `setup.py`, `requirements*.txt` | Python | `pytest-cov` | `pip install --user pytest-cov coverage` |
| `go.mod` | Go | built-in | `go test -cover` (no install needed) |
| `pom.xml` | Java (Maven) | JaCoCo | Needs plugin in `pom.xml` — ask before editing |
| `build.gradle` / `build.gradle.kts` | Java (Gradle) | JaCoCo | Needs plugin in `build.gradle` — ask before editing |
| None detected | Unknown | Ask the user | — |

### Project-level changes (only if user approves)

Only JaCoCo for Java requires project config. Before touching `pom.xml` or `build.gradle`:

> "JaCoCo needs a plugin entry in pom.xml/build.gradle. This won't change any code — it enables coverage measurement. Add it? If not, coverage gates will run on whatever the project already has."

If user says no → pass with warning. Coverage gates will still check whatever coverage setup already exists.

### Verify it works

```bash
# JS/TS — prefer npx (no install), fall back to global
npx nyc --version 2>/dev/null || nyc --version 2>/dev/null || echo "missing"

# Python
python -c "import coverage" 2>/dev/null || pip install --user coverage

# Go (built-in)
go version 2>/dev/null && go test -cover ./... 2>&1 | head -1

# Java (Maven) — only if user approved plugin
mvn jacoco:help 2>/dev/null || echo "JaCoCo plugin not in pom.xml (user declined)"

# Java (Gradle) — only if user approved plugin
gradle tasks --all 2>/dev/null | grep -q jacoco || echo "JaCoCo plugin not in build.gradle (user declined)"
```

## Step 3 — Gherkin-Style Testing

Check for `.feature` files:

```bash
find . -name "*.feature" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null | head -5
```

| Signal | Runner | Install (prefer global) |
|---|---|---|
| `.feature` files in JS/TS project | `cucumber-js` | `npm install -g @cucumber/cucumber` or `npx cucumber-js` |
| `features/` or `.feature` in Python | `behave` | `pip install --user behave` |
| `.feature` in Java (Maven) | cucumber-jvm | Needs maven dependency — ask before editing `pom.xml` |
| `.feature` in Java (Gradle) | cucumber-jvm | Needs gradle dependency — ask before editing `build.gradle` |
| No `.feature` files, no source files | — | Pass with reminder. New project. |
| No `.feature` files, existing source files | — | Pass with note: no BDD runner configured. |

If a Gherkin runner is missing and the project has `.feature` files: install globally if possible. If it requires project config, ask. If user says no → pass with warning.

## Step 4 — Report

```
Preflight — td-agentcraft-kit
==============================
✓ Cyclomatic complexity (lizard)
✓ Code duplication (jscpd)
✓ Test coverage (nyc via npx)
✓ Gherkin-style testing (behave)
✓ .gitignore updated (3 patterns added)

All capabilities present. Proceeding.
```

```
Preflight — td-agentcraft-kit
==============================
✓ Cyclomatic complexity (lizard)
✓ Code duplication (jscpd)
✓ Test coverage (JaCoCo — plugin in pom.xml, user approved)
✗ Gherkin-style testing (cucumber-jvm declined by user)
✓ .gitignore updated (2 patterns added)

Proceeding with logged gap. Gherkin gates will be skipped.
```

**Block only if:** `lizard` or `jscpd` cannot be installed at all (no global, no npx, and user says no). Everything else passes with a warning.
