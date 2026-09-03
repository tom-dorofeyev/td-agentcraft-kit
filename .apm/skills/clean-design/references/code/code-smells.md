# Code Smells & Heuristics

## Purpose
This skill is a diagnostic lens — a catalogue of recognisable patterns that signal design problems. It does not define rules for writing, but gives reviewers and refactoring-minded engineers a vocabulary for identifying *what is wrong* and *why*.

## Smell Catalogue

### Functions
| Smell | Signal |
|---|---|
| **Long Method** | Needs to scroll; mixes levels of abstraction |
| **Too Many Arguments** | 3+ args; consider parameter object |
| **Flag Argument** | Boolean passed directly; function does two things |
| **Dead Function** | Never called; delete it |
| **Output Argument** | Argument mutated instead of returning a new value |
| **Selector Argument** | Enum or string selects behaviour variant; split into multiple functions |

### Classes
| Smell | Signal |
|---|---|
| **Large Class** | Many fields; many methods; several distinct reasons to change |
| **Divergent Change** | Class changes for different, unrelated reasons (SRP violation) |
| **Shotgun Surgery** | One logical change requires edits in many unrelated classes |
| **Feature Envy** | Method uses more data from another class than from its own |
| **Data Clumps** | Same group of variables appears together in multiple places; make them an object |
| **Primitive Obsession** | Business concepts modelled as raw strings or numbers instead of value objects |
| **Data Class** | Class has only getters/setters; no behaviour; behaviour lives somewhere else |
| **Refused Bequest** | Subclass ignores or no-ops most inherited methods (LSP violation) |
| **Lazy Class** | Class barely justifies its existence; merge or delete |
| **Speculative Generality** | Abstraction or parameter added for a future use case that does not exist yet (YAGNI violation) |
| **Temporary Field** | Instance variable only set in some code paths; confusing lifecycle |

### Dependencies and Coupling
| Smell | Signal |
|---|---|
| **Inappropriate Intimacy** | Class accesses another's internals too deeply |
| **Message Chains** | `a.getB().getC().doD()` — Law of Demeter violation |
| **Middle Man** | Class delegates nearly everything; barely does anything itself |
| **Indecent Exposure** | Class or method is public with no external callers; reduce visibility |

### Names and Comments
| Smell | Signal |
|---|---|
| **Obscure Name** | Requires context or comment to understand |
| **Non-communicative Name** | Generic word (`data`, `manager`, `helper`, `util`) with no qualification |
| **Inconsistent Name** | Same concept named differently in different parts of the codebase |
| **Redundant Comment** | Comment says exactly what the code already says |
| **Outdated Comment** | Comment no longer matches what the code does |
| **Commented-Out Code** | Deleted code left as comments; visible dead matter |

### Tests
| Smell | Signal |
|---|---|
| **Fragile Test** | Breaks on equivalent refactors that do not change external behaviour |
| **Inspector Test** | Tests internal/private state or call sequences |
| **Slow Test** | Hits real I/O, network, or clock |
| **Unclear Test** | Cannot determine what behaviour is being tested from the name alone |
| **Chatty Arrange** | Setup block longer than the assertion; signals complex hidden coupling |

### General
| Smell | Signal |
|---|---|
| **Magic Number / Literal** | Bare numeric or string literal with domain meaning |
| **Duplicate Code** | Same logic in two or more places (Rule of Three: extract on third) |
| **Dead Code** | Unreachable branch, unused variable, commented-out block |
| **Negative Conditional** | `!isNotActive` style — rewrite as a positive predicate |
| **Switch on Type** | `switch (type)` or `if/else if` chain for variants; usually signals a missing polymorphism |
| **Inconsistent Abstraction Level** | High-level and low-level operations mixed in one block |

## When Reviewing

For each smell identified, cite the specific pattern:
`[SMELL / <smell name>] <file>:<line or block> — <why this is a problem and what the cleaner design looks like>`

Do not flag every potential smell without evidence. Each citation must name the specific lines and explain the concrete problem. Speculation about future pain is not a review finding.
