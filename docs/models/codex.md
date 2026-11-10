# Codex Model Setup

[Model guidance and setup precautions](README.md)

## Find IDs

Use your Codex client's model selector. For command-line selection, use `codex --model MODEL_ID` with a real Codex model ID, without an OpenCode provider prefix. OpenAI's API-key inventory is not a substitute for your Codex subscription's model selector.

## Set a Default

Add or replace this at the top level of your project's `.codex/config.toml`, before any `[table]` headers:

```toml
model = "DEFAULT_MODEL_ID"
```

Project configuration requires a trusted project.

## Pin an Installed Agent

Add or replace the top-level `model` in `.codex/agents/<agent-file>.toml` (use the actual deployed filename):

```toml
model = "CODING_MODEL_ID"
```

Keep `name`, `description`, and `developer_instructions` intact. If you also set `model_reasoning_effort`, choose a value supported by that model. Without agent overrides, subagents inherit the parent's model and reasoning effort unless spawn settings or subagent defaults select others.

## Programmatic Discovery

Codex app-server exposes `model/list` after protocol initialization. Use each entry's `model` value and follow `nextCursor`. Results may be cached. This requires protocol setup; it is not a shell command.

References: [Models](https://learn.chatgpt.com/docs/models), [Custom agents](https://developers.openai.com/codex/agent-configuration/subagents), [App-server model listing](https://learn.chatgpt.com/docs/app-server#list-models-modellist).
