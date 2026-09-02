---
name: mutation-hardening
description: Runs mutation testing to harden Java, TypeScript/JavaScript, and Go tests. Use when asked to kill mutants, measure mutation score, or strengthen tests with mutation testing.
---

# Mutation Hardening

## Purpose

Expose inadequate tests by applying controlled source mutations and requiring every non-equivalent mutant in the agreed scope to be killed. This skill is reusable: it does not require or name any agent.

## Inputs

- The source and test scope to harden
- The project build and test command
- The language and build system, if already known
- Any existing mutation-tool configuration and score policy

## Preconditions

1. Detect the project before choosing a tool:
   - `pom.xml` or `build.gradle(.kts)` → Java: PIT
   - `package.json` → TypeScript/JavaScript: Stryker
   - `go.mod` → Go: gremlins
2. Run the project's relevant tests unchanged. Stop on a failing baseline; mutation results are invalid until it passes.
3. Reuse existing tool configuration. Do not replace a project's test runner, build system, or configured mutation tool.
4. If configuration must be added or changed, ask before modifying project manifests or build files.

## Tool Setup

Prefer project-local, versioned tooling for reproducibility. A global executable is an acceptable fallback only when it does not require project configuration.

| Language | Tool | Global fallback |
|---|---|---|
| Java | PIT, configured through the Maven or Gradle plugin | No standalone fallback; request approval to configure the build plugin. |
| TypeScript/JavaScript | Stryker, configured for the installed test runner | `npm install -g @stryker-mutator/core`; prefer `npx stryker run`. |
| Go | gremlins | `go install github.com/go-gremlins/gremlins/cmd/gremlins@latest` |

Do not install a tool or edit a manifest without the user's approval when it changes project dependencies or build configuration.

## Execution

1. Limit mutations to the agreed production-code scope. Exclude generated code, vendored code, and test code.
2. Run the language-appropriate mutation command using the project configuration:
   - Java: `mvn pitest:mutationCoverage` or the equivalent configured Gradle task.
   - TypeScript/JavaScript: `npx stryker run`.
   - Go: `gremlins unleash <package-or-file-scope>`.
3. Classify each surviving mutant:
   - **Missing test** — add or improve a test that asserts the observable behavior, then rerun.
   - **Equivalent mutant** — document why no observable behavior can distinguish it; exclude only that precise mutation where the tool supports it.
   - **Invalid scope or tool configuration** — correct the scope/configuration after approval, then rerun.
4. Repeat until no non-equivalent mutant survives in scope.
5. Run the normal relevant tests and the full test suite after the final mutation run.

## Rules

- Never weaken, delete, or make assertions less specific to improve a score.
- Never change production behavior solely to kill a mutant; report a likely defect instead.
- Do not claim that every mutant is killable. Equivalent mutants are an explicit, evidence-backed exception.
- Do not use broad exclusions, disable mutation operators, or lower a configured score threshold to produce a pass.
- Keep mutations and reports out of version control; add only generated report paths to `.gitignore` when needed.

## Output

Report:

- tool and version, language, and mutated scope;
- baseline, mutation, relevant-test, and full-suite commands with results;
- killed, survived, no-coverage, timeout, and equivalent-mutant counts;
- each documented equivalent-mutant exclusion and rationale;
- remaining blocker, if any.

## Gate

Pass only when the baseline and full suite pass, the mutation run completes, and every in-scope non-equivalent mutant is killed. A tool/setup failure or an unexplained survivor is blocking.
