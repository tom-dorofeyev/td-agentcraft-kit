# Choosing Models

The kit ships without model pins. Start with one capable coding model; assign different models only when quality, speed, or cost warrants it.

## Match Capabilities to Roles

| Agent | Prioritize |
|---|---|
| Agent | Reliable tool use and coordination; stronger reasoning for complex planning. |
| Architect | Deep reasoning about boundaries, dependencies, and tradeoffs. |
| Builder | Accurate code edits, testing, and debugging. |
| Investigator | Fast search, careful reading, and evidence synthesis; start lower-cost and escalate for ambiguity. |
| Refactorer | Strong coding and structural reasoning with behavior-preserving edits. |
| Reviser | Critical reasoning, security awareness, and verified fixes—not just summarization. |
| Specifier | Precise requirements, ambiguity detection, and testable acceptance criteria. |

Planner and Implementer are skills, not separate agents; they use the executing agent's model. Per-agent overrides depend on your runtime's support.

## Find Models and Exact IDs

Sign in with the intended account first. Availability depends on your plan, organization policies, and runtime. Copy IDs; do not guess them from display names.

| Runtime | Find and select models | ID format |
|---|---|---|
| [OpenCode V2](https://opencode.ai/v2/docs/models) | Connect your provider, then open `/models` in the target project. For public catalog IDs, use the lookup below. | `provider/model`; optional `#variant` only when advertised by OpenCode. |
| [Copilot CLI](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) | Open `/model`. For command-line selection, use `copilot --model MODEL_ID`. | Copilot's model ID, without OpenCode's provider prefix. |
| [Copilot in an IDE](https://docs.github.com/copilot/reference/ai-models/supported-models) | Use the IDE chat model picker. Follow that IDE's documentation for custom-agent model settings. | IDE-specific; do not assume CLI IDs transfer unchanged. |
| [Codex](https://learn.chatgpt.com/docs/models) | Use the client's model selector. For command-line selection, use `codex --model MODEL_ID`. | Codex's model ID, without OpenCode's provider prefix. |

`MODEL_ID` is a placeholder, not a literal value. Selecting a session model does not necessarily override models assigned to specialist agents.

### Public OpenCode Catalog: GitHub Copilot

Requires `curl` and `jq`; no credentials needed:

```sh
curl -fsSL https://models.dev/model-schema.json |
  jq -er '."$defs".Model.enum[] | select(startswith("github-copilot/"))'
```

This reads the [models.dev model enum](https://models.dev/model-schema.json#/$defs/Model). Replace `github-copilot/` to search another provider. Confirm availability in OpenCode's `/models`: public catalog entries do not prove account access, and local aliases/custom models may not appear here.

### Programmatic Discovery

For integrations, use the runtime's documented interface rather than maintaining a model list:

- **Copilot SDK:** [`listModels()`](https://docs.github.com/en/copilot/how-tos/copilot-sdk/troubleshooting/compatibility) returns model IDs and metadata.
- **Codex app-server:** [`model/list`](https://learn.chatgpt.com/docs/app-server#list-models-modellist), after protocol initialization; use each entry's `model` value and follow `nextCursor`. Results may be cached.

These require their own SDK/protocol setup; they are not shell commands. OpenAI's API-key model inventory is not a substitute for a Codex subscription's model selector. Never extract stored login tokens or commit credentials.
