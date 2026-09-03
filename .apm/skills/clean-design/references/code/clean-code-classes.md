# Clean Code — Classes

> SOLID principles (SRP, OCP, LSP, ISP, DIP) are defined and applied via [SOLID](../design/clean-code-solid.md). This reference focuses on class-level design: size, cohesion, and organisation.

## Rules

### Class Size
- Classes should be small — measured in *responsibilities*, not lines. A class that is hard to name precisely is probably doing too much.
- If you need "and" to describe a class, treat it as two classes.

### Cohesion
- Every method in a class should operate on one or more of its instance variables. High cohesion means methods are deeply related to the data the class owns.
- A class where some methods use one set of fields and other methods use a completely different set is two classes living in one body — split them.
- High cohesion is the structural signal that confirms SRP (from the SOLID skill) is being met.

### Organise for Change
- Ask "what could cause this class to change?" before finalising it. Each distinct answer is a separate class.
- Classes that change frequently for unrelated reasons are a maintenance hazard — split before the damage compounds.

### No Magic Numbers
Every literal that carries domain meaning must be a named constant. `ONE_DAY_IN_MS` explains meaning; `86400000` does not.

### Avoid Negative Conditionals
`if (isActive)` is immediately clear. `if (!isNotActive)` requires two mental inversions. Prefer positive predicates; extract a named boolean if necessary.

## When Writing

Before finalising a class:
1. Can I describe its responsibility in one sentence without "and"?
2. Does every method manipulate at least one of its instance variables?
3. Do any subsets of methods and fields belong together independently? If yes, extract a class.
4. Are all meaningful literals extracted to named constants?
5. Are all conditionals expressed as positive predicates?

## When Reviewing

Flag any class that:
- Requires "and" to describe what it does
- Has subsets of methods that only use their own subset of fields (split signal)
- Contains bare numeric or string literals with domain meaning (magic numbers)
- Uses double-negation predicates (`!isNotX`, `!isDisabled`)

Cite: `[CLASSES] <file>:<line or class name> — <what the problem is and why>`

For SOLID violations found during class review, cite using the SOLID skill format: `[SOLID/<principle>] ...`
