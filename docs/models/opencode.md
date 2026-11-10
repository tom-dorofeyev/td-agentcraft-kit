# OpenCode Model Setup

[Model guidance and setup precautions](README.md)

These instructions target OpenCode V2, including when GitHub Copilot supplies the models.

## Find IDs

Connect your provider, then open `/models` in the target project. IDs use `provider/model`; append `#variant` only when OpenCode advertises that variant.

For public GitHub Copilot catalog IDs, run this with `curl` and `jq` (no credentials required):

```sh
curl -fsSL https://models.dev/model-schema.json |
  jq -er '."$defs".Model.enum[] | select(startswith("github-copilot/"))'
```

Replace `github-copilot/` to search another provider. Confirm availability in `/models`: the [public enum](https://models.dev/model-schema.json#/$defs/Model) does not prove account access or include your local aliases/custom models.

## Set a Default and Optional Overrides

Merge into your project's `opencode.jsonc` (or existing `.opencode/opencode.jsonc`):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "PROVIDER/DEFAULT_MODEL_ID",
  "agents": {
    "builder": { "model": "PROVIDER/CODING_MODEL_ID" }
  }
}
```

For Copilot-backed models, use the full `github-copilot/...` IDs. The optional `builder` entry pins that specialist; add other installed role IDs only as needed. Unpinned subagents inherit the parent session's model.

Configuration reloads automatically. An existing session's selected model takes precedence over the default; use `/models` to change it.

References: [Models](https://opencode.ai/v2/docs/models), [Configuration](https://opencode.ai/v2/docs/config), [Agent models](https://opencode.ai/v2/docs/agents#model).
