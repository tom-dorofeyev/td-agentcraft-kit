# Install In A Project

Use this when you want the kit inside a specific repository.

```sh
cd your-project
apm init --target opencode,copilot
apm install https://github.com/tom-dorofeyev/td-agentcraft-kit#main
```

If you also want Telegram notifications, see [telegram-notifications.md](telegram-notifications.md).

## Select Models Per Agent

Clone the kit, edit `model-profiles.json`, and add a profile with model IDs for the agents you want to pin. Apply it before installing from the local clone:

```sh
git clone https://github.com/tom-dorofeyev/td-agentcraft-kit td-agentcraft-kit
cd td-agentcraft-kit
node scripts/configure-models.mjs my-profile
cd ../your-project
apm install ../td-agentcraft-kit
```

For example, `model-profiles.json` can assign `builder` and `reviewer` independently:

```json
{
  "profiles": {
    "default": {},
    "my-profile": {
      "builder": "provider/model-id",
      "reviewer": "provider/another-model-id"
    }
  }
}
```

Use the model ID syntax supported by your target runtime. Omitted agents and `null` values inherit its default. Select `default` to remove all pins before another install. Model profiles are applied to the source agent files, so use a separate clone or reapply the appropriate profile when installing into different setups.
