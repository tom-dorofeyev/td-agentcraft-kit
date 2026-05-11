---
name: clean-code-comments
description: Rules for when and when not to write comments. A comment is a failure to express intent in code. Derived from Clean Code Chapter 4.
---

# SKILL: Clean Code — Comments

## Rules

- **A comment is an admission of failure**: every comment acknowledges that you could not express the intent through naming or structure. Before writing a comment, try harder to rename or restructure.
- **Comments lie**: code changes; comments do not keep up. A misleading comment is worse than no comment. The older a comment, the less trustworthy it is.
- **Never describe what the code does**: `// increment i` above `i++` is pure noise. The code already says that.
- **Never use journal comments**: source control is the changelog. `// Added 2024-03-01: fixed null check` is clutter.
- **Never leave commented-out code**: delete it. It lives in git history. Commented-out code is a lie waiting to confuse someone.
- **Never use closing-brace comments**: `} // end if`, `} // end for`. If you need them, your function is too long. Shorten the function.
- **Never use noise comments**: `// Constructor`, `// Default constructor`, `// Returns the day of the month` — these say nothing and are worse than silence.
- **No position markers / banner comments**: `///// ---- Section A ---- /////` is a sign of a class that is too large and needs to be split.
- **Acceptable comments (rare)**:
  - Legal/license headers at the top of a file
  - Explanation of a non-obvious *external* constraint (e.g., a workaround for a documented third-party bug, with a link to the issue)
  - Public API documentation where a contract is not self-evident from types and names alone
  - TODO markers that are tracked and have an owner (but clean them up regularly)

## When Writing

Every time you reach for a comment, stop and ask:
1. Can I rename the variable, function, or class to make this obvious?
2. Can I extract a function with a descriptive name that replaces this comment?
3. Is this truly a rare case where the *external constraint* cannot be expressed in code?

If (1) or (2) is possible, do it instead of writing the comment. Only write a comment if (3) is true.

## When Reviewing

Flag any comment that:
- Describes what the code immediately below/around it already says
- Records change history or authorship
- Is commented-out code (regardless of how recently it was commented out)
- Closes a brace or block
- Divides a class or function into sections (signals the class/function is too large)
- Is a noise statement (`// Constructor`, `// method`, etc.)
- Could be replaced by a better name or an extracted function

Acceptable comments that should NOT be flagged: legal headers, documented third-party workarounds with links, public API docs where types alone are insufficient.

Cite: `[COMMENTS] <file>:<line> — <type of comment violation and what should replace it>`
