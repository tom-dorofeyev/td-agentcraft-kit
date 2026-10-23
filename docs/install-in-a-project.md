# Install In A Project

Use this when you want the kit inside a specific repository.

```sh
cd your-project
apm init --target opencode,copilot
apm install https://github.com/tom-dorofeyev/td-agentcraft-kit#main
```

If you also want Telegram notifications, see [telegram-notifications.md](telegram-notifications.md).

To coordinate without doing substantive work in the current session, explicitly load `/coordinator`. The mode lasts until you ask to exit it. It requires native delegation and stops when unavailable; its no-command/no-edit rules are session instructions, not a tool sandbox.

## Select Models Per Agent

Clone the kit, edit `model-profiles.json`, and add a profile with model IDs for the agents you want to pin. Apply it before installing from the local clone:

```sh
git clone https://github.com/tom-dorofeyev/td-agentcraft-kit td-agentcraft-kit
cd td-agentcraft-kit
node scripts/configure-models.mjs my-profile
cd ../your-project
apm install ../td-agentcraft-kit
```

For example, `model-profiles.json` can assign `builder` and `reviser` independently:

```json
{
  "profiles": {
    "default": {},
    "my-profile": {
      "builder": "provider/model-id",
      "reviser": "provider/another-model-id"
    }
  }
}
```

Use the model ID syntax supported by your target runtime. Omitted agents and `null` values inherit its default. Select `default` to remove all pins before another install. Model profiles are applied to the source agent files, so use a separate clone or reapply the appropriate profile when installing into different setups.
