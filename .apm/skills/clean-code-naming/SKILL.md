---
name: clean-code-naming
description: Rules for intention-revealing, unambiguous names across variables, functions, classes, and files. Derived from Clean Code Chapter 2.
---

# SKILL: Clean Code — Naming

## Rules

- **Reveal intent**: a name must answer why something exists, what it does, and how it is used. If a name requires a comment, rename it.
- **Avoid disinformation**: never use names that mislead. `accountList` must be a list; if it is a set or map, say so. Avoid names that differ only in subtle ways.
- **Make meaningful distinctions**: `ProductInfo`, `ProductData`, and `Product` are meaningless noise. Name the difference, or remove one. Never use `a1`, `a2`, `a3`.
- **Use pronounceable names**: if you cannot pronounce it, you cannot discuss it — `generationTimestamp` not `genymdhms`.
- **Use searchable names**: single-letter names are only acceptable as loop counters in very short blocks. Meaningful names enable `grep`. `MAX_RETRIES` not bare `3`.
- **Avoid encodings**: no Hungarian notation, no `I` prefix on interfaces, no `Impl` suffix — let the IDE do type inspection.
- **Class names are nouns**: `Customer`, `OrderProcessor`, `AddressParser`. Never `Manager`, `Data`, `Info`, `Handler` as standalone names — they say nothing.
- **Method names are verbs**: `save`, `getUser`, `isEligible`, `deleteExpiredSessions`.
- **One word per concept**: pick `fetch`, `retrieve`, or `get` — use it consistently everywhere. Don't use the same word for two different concepts.
- **Use solution/problem domain names**: prefer well-known CS terms (`Queue`, `Visitor`, `Factory`) for technical concepts; prefer business/domain language for business concepts.
- **Avoid mental mapping**: readers should never translate `r` into "the url after stripping the host". Names encode meaning directly.

## When Writing

Before finalising any name, ask:
1. Does this name reveal *why* and *what* without needing a comment?
2. Could it be confused with something else in this codebase?
3. Can a new team member understand it in 5 seconds?

Rename immediately if the answer to any of these is no. Spending 30 seconds on a name saves hours of future confusion.

## When Reviewing

Flag any name that:
- Requires a comment or surrounding context to understand
- Differs from a nearby name only by a number suffix, noise word, or single letter
- Is a single letter (outside a short loop counter)
- Uses a generic word (`data`, `info`, `manager`, `handler`, `util`) without additional qualification that makes it unique
- Contradicts what the thing actually is or does
- Uses an abbreviation that is not universally understood in this domain

Cite: `[NAMING] <file>:<line> — <what the name is, what it actually means, and what it should be renamed to>`
