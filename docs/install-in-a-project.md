# Install In A Project

Use this when you want the kit inside a specific repository.

```sh
cd your-project
apm install https://github.com/tom-dorofeyev/td-agentcraft-kit#v5.0.12 --target opencode,copilot,codex
apm compile --target opencode,copilot,codex
```

`apm install` deploys agents and skills for all three targets, plus Copilot instructions. Codex agents go to `.codex/agents/`, and shared skills go to `.agents/skills/`. `apm compile` writes the root `AGENTS.md` that Codex and OpenCode read for shared instructions when that file is absent or APM-generated. APM preserves an existing hand-written `AGENTS.md`; if your project has one, use [managed-section mode](https://microsoft.github.io/apm/producer/compile/#managed-section-mode) to add the shared instructions without replacing your own content.

For later installs and compiles without `--target`, add `targets: [opencode, copilot, codex]` to the generated `apm.yml`.

Commit the resulting `apm.yml`, `apm.lock.yaml`, and APM-deployed files in your project, including agents, skills, instructions, and any generated `AGENTS.md`. Keep `apm_modules/` ignored; contributors run `apm install` after cloning to restore package resources.

If you also want Telegram notifications, see [telegram-notifications.md](telegram-notifications.md).

To coordinate without doing substantive work in the current session, explicitly load `/coordinator`. The mode lasts until you ask to exit it. It requires native delegation and stops when unavailable; its no-command/no-edit rules are session instructions, not a tool sandbox.

## Choosing Models

See [Choosing Models](model-selection.md) for capability recommendations for each agent. Select models in your runtime; the kit does not pin them.
