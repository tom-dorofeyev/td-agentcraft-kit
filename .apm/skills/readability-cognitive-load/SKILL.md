---
name: readability-cognitive-load
description: Rules for reducing cognitive load and maintaining human readability. Evaluates nesting depth, mental stack size, boolean complexity, control flow linearity, and the working memory cost imposed on the reader.
---

# SKILL: Readability & Cognitive Load

## Purpose

Cognitive load is the total mental effort required to read, understand, and reason about a piece of code. High cognitive load directly increases defect rate and slows maintenance. This skill measures the reader's burden — not correctness, not architecture — purely: *how hard is this to understand in a single focused pass?*

The goal is code a qualified developer can read and fully understand **within one focused pass**, without backtracking, without consulting other files, and without holding more than five to seven things in working memory at once.

## Dimensions

### 1. Nesting Depth

**Maximum 2 levels** of nesting inside a function body. Each additional indentation level multiplies the mental stack the reader must maintain — the outer condition remains live while the inner block is parsed.

Resolution: invert conditions into guard clauses; extract nested blocks into named functions.

**Bad** (3 levels):
```
function process(order) {
  if (order.isValid()) {
    if (order.hasItems()) {
      for (const item of order.items) {
        if (item.isAvailable()) { ... }
      }
    }
  }
}
```

**Good** (max 1 level per function):
```
function process(order) {
  if (!order.isValid() || !order.hasItems()) return;
  order.items.filter(isAvailable).forEach(processItem);
}
```

### 2. Linear Happy Path

The main success path must read top-to-bottom without branching. Errors and edge cases exit early via guard clauses, leaving the happy path unindented and unobstructed.

Readers scan for the normal flow first. Burying it inside an `if` forces them to hold the condition's inverse in mind for the entire function body.

### 3. Boolean Expression Complexity

**No compound boolean expression with more than 3 operands** joined by `&&` or `||` in a single expression. Beyond 3, the reader must evaluate truth table combinations mentally.

Extract complex boolean expressions into a named predicate function that expresses intent, not mechanics.

**Bad:**
```
if (user.age >= 18 && user.isVerified && !user.isBanned && user.subscription !== 'expired') {
```

**Good:**
```
if (isEligibleForAccess(user)) {
```

### 4. Working Memory Load

Limit **simultaneous live, mutable local variables** in any single function to **5 or fewer**. A variable is live from declaration to last use. Beyond 5 overlapping live variables, working memory is saturated and errors become more likely.

Immutable constants and single-use loop variables do not count toward this limit.

### 5. Function Self-Containment

Any function must be **fully understandable from its signature and body alone** — no mental overhead from caller context, setup preconditions, or global state. Temporal coupling (where A must be called before B, or B silently depends on prior state) is a cognitive load violation because the constraint is invisible at the call site.

### 6. Abstraction Consistency

All statements within a function body must operate at the **same level of abstraction**. Mixing high-level orchestration calls (`submitOrder`, `notifyCustomer`) with low-level mechanics (`db.execute("INSERT …")`, `sha256.update(…).digest("hex")`) forces the reader to context-switch mid-read.

> This dimension overlaps with `clean-code-functions`. Flag here only when the mixing is severe enough to materially degrade first-read comprehension.

### 7. Surprise Factor

Code must do exactly what its name and visible signature imply — nothing more, nothing less. Hidden side effects, silent mutations, and counter-intuitive return values force the reader to mentally simulate execution rather than relying on declared contracts.

Check: does calling this produce any state change not visible in the name? Does the return value behave differently than a first-time reader would naturally predict?

### 8. Visual Density

- **Line length**: 120 characters maximum. Horizontal scrolling breaks the mental scan.
- **Vertical spacing**: do not remove blank lines to compress code. Blank lines are paragraph breaks — they signal where one logical thought ends and another begins.
- **Chain length**: no method chain exceeding 4 calls on a single expression. Long chains require left-to-right evaluation while tracking accumulated type transformations.

## When Reviewing

Evaluate every changed function against all 8 dimensions.

**BLOCKING** — must be fixed before the review can approve:
- Nesting depth > 3 levels inside a single function
- Boolean expression with > 4 operands in one compound expression
- More than 7 simultaneous live mutable variables in a single function
- Function behavior contradicts its name (surprise factor violation — always blocking)
- Temporal coupling with no visible guard or assertion at the call site

**NON-BLOCKING** — advisory; should be fixed but does not block:
- Nesting depth at exactly 3 levels — recommend guard clause refactor
- Boolean expression with 3–4 operands — recommend named predicate
- Abstraction mixing that is noticeable but not severe
- Chain length of 4–5 calls — advisory
- Line length > 120 characters — advisory

Cite format:
`[READABILITY / <dimension>] <file>:<line or function> — <what was found and why it increases cognitive load>`

## Checklist

1. No function body has more than 2 levels of nesting (3 is borderline; flag and recommend).
2. Every function's happy path flows top-to-bottom without the reader needing to track nested conditions.
3. No compound boolean expression has more than 3 operands joined by `&&` or `||`.
4. No single function has more than 5 simultaneous live, mutable local variables.
5. Every function is fully understandable from its signature and body alone — no hidden temporal dependencies.
6. All statements within a function body operate at the same level of abstraction.
7. Every function, method, and variable does exactly what its name promises — no hidden effects.
8. No line exceeds 120 characters; logical blocks are separated by blank lines.
