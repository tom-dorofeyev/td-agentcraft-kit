# Install In A Project

Use this when you want the kit inside a specific repository.

```sh
cd your-project
apm install https://github.com/tom-dorofeyev/td-agentcraft-kit#v5.0.11 --target opencode,copilot,codex
apm compile --target opencode,copilot,codex
```

`apm install` deploys agents and skills for all three targets, plus Copilot instructions. Codex agents go to `.codex/agents/`, and shared skills go to `.agents/skills/`. `apm compile` writes the root `AGENTS.md` that Codex and OpenCode read for shared instructions when that file is absent or APM-generated. APM preserves an existing hand-written `AGENTS.md`; if your project has one, use [managed-section mode](https://microsoft.github.io/apm/producer/compile/#managed-section-mode) to add the shared instructions without replacing your own content.

For later installs and compiles without `--target`, add `targets: [opencode, copilot, codex]` to the generated `apm.yml`.

Commit the resulting `apm.yml`, `apm.lock.yaml`, and APM-deployed files in your project, including agents, skills, instructions, and any generated `AGENTS.md`. Keep `apm_modules/` ignored; contributors run `apm install` after cloning to restore package resources.

If you also want Telegram notifications, see [telegram-notifications.md](telegram-notifications.md).

To coordinate without doing substantive work in the current session, explicitly load `/coordinator`. The mode lasts until you ask to exit it. It requires native delegation and stops when unavailable; its no-command/no-edit rules are session instructions, not a tool sandbox.

## Select Models Per Agent

Clone the kit, edit `model-profiles.json`, and add a profile with model IDs for the agents you want to pin. Apply it before installing from the local clone:

```sh
git clone https://github.com/tom-dorofeyev/td-agentcraft-kit td-agentcraft-kit
cd td-agentcraft-kit
node scripts/configure-models.mjs my-profile
cd ../your-project
apm install ../td-agentcraft-kit --target opencode,copilot,codex
apm compile --target opencode,copilot,codex
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
