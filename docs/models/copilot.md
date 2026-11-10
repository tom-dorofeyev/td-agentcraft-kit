# GitHub Copilot Model Setup

[Model guidance and setup precautions](README.md)

For Copilot used as an OpenCode provider, follow the [OpenCode guide](opencode.md) instead.

## Find IDs and Select a Default

- **CLI:** open `/model`. For command-line selection, use `copilot --model MODEL_ID` with a real Copilot model ID, without an OpenCode provider prefix.
- **IDE:** use the chat model picker. Follow that IDE's custom-agent documentation; model identifiers can differ from CLI IDs.

Choose models offered to your signed-in account. Do not derive IDs from display names.

## Pin an Installed Agent

In `.github/agents/<agent-file>.agent.md` (use the actual deployed filename), add or replace only the YAML `model` field between the existing `---` delimiters:

```yaml
model: "MODEL_ID"
```

Keep the remaining metadata and instructions intact. Omit the field to inherit the default. In Copilot CLI, an explicit `--model` can override an agent's preference.

## Programmatic Discovery

The Copilot SDK's `listModels()` returns model IDs and metadata. This requires SDK setup; it is not a shell command.

References: [CLI commands](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference), [Supported models](https://docs.github.com/copilot/reference/ai-models/supported-models), [Custom-agent configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration), [SDK capabilities](https://docs.github.com/en/copilot/how-tos/copilot-sdk/troubleshooting/compatibility).
