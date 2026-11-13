# Choosing Models

The kit ships without model pins. Start with one capable coding model; assign different models only when quality, speed, or cost warrants it.

## Choose Your Tool

- [OpenCode](opencode.md), including GitHub Copilot as its provider
- [GitHub Copilot](copilot.md), used directly in the CLI or an IDE
- [Codex](codex.md)

Each guide covers model discovery and native configuration. Choose by the tool you run, not the company that made the model.

## Match Capabilities to Roles

| Agent | Prioritize |
|---|---|
| Agent | Reliable tool use and coordination; stronger reasoning for complex planning. |
| Architect | Deep reasoning about boundaries, dependencies, and tradeoffs. |
| Builder | Accurate code edits, testing, and debugging. |
| Investigator | Fast search, careful reading, and concise evidence gathering. |
| Refactorer | Strong coding and structural reasoning with behavior-preserving edits. |
| Reviser | Critical reasoning, security awareness, and verified fixes—not just summarization. |
| Specifier | Precise requirements, ambiguity detection, and testable acceptance criteria. |

Planner and Implementer are skills, not separate agents; they use the executing agent's model.

## Before Editing

Install the kit first. Edit your consuming project's configuration, not this kit's `.apm/` sources. Replace uppercase placeholders with real model IDs. Merge snippets into existing files without replacing instructions or permissions. Never commit credentials.

## Verify and Maintain

Start a fresh session and run a small read-only task with the configured agent. Check the runtime's session/subagent details for the actual model—not its self-reported name. Resolve unknown-model or access errors before real work; availability depends on your account and organization policies.

Leave unneeded overrides absent; remove a pin to restore inheritance. Reinstalling or updating the kit may overwrite edits to deployed agent files, so keep a copy. For user-wide settings, use your runtime's user configuration and the [global deployment paths](../install-globally.md#deployment-paths).
