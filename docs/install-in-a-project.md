# Install In A Project

Use this when you want the kit inside a specific repository.

```sh
cd your-project
apm init --target opencode,copilot
apm install https://github.com/tom-dorofeyev/td-agentcraft-kit#main
apm compile
```

`apm install` deploys the agents, skills, and Copilot instructions. `apm compile` writes the root `AGENTS.md` that OpenCode reads for shared instructions when that file is absent or APM-generated. APM preserves an existing hand-written `AGENTS.md`; if your project has one, use [managed-section mode](https://microsoft.github.io/apm/producer/compile/#managed-section-mode) to add the shared instructions without replacing your own content.

Commit the resulting `apm.yml`, `apm.lock.yaml`, and APM-deployed files in your project, including agents, skills, instructions, and any generated `AGENTS.md`. Keep `apm_modules/` ignored; contributors run `apm install` after cloning to restore package resources.

If you also want Telegram notifications, see [telegram-notifications.md](telegram-notifications.md).

To coordinate without doing substantive work in the current session, explicitly load `/coordinator`. The mode lasts until you ask to exit it. It requires native delegation and stops when unavailable; its no-command/no-edit rules are session instructions, not a tool sandbox.

## Select Models Per Agent

Clone the kit and run one setup command. It asks which profile to use, applies its agent models, then runs APM install and compile in the project:

```sh
git clone https://github.com/tom-dorofeyev/td-agentcraft-kit td-agentcraft-kit
node td-agentcraft-kit/scripts/install.mjs --project ./your-project
```

For automation, pass `--profile opencode-openai`, `--profile opencode-copilot`, `--profile copilot`, or `--profile default`. Noninteractive runs require `--profile`.

Add a custom profile to `model-profiles.json` before running the command:

```json
{
  "profiles": {
    "my-profile": {
      "target": "opencode",
      "models": {
        "builder": "provider/model-id",
        "reviser": "provider/another-model-id"
      }
    }
  }
}
```

Use `target: "copilot"` for Copilot model names or `target: "opencode,copilot"` only when all model pins work on both runtimes. Omitted agents and `null` values inherit the runtime default. The command updates `.apm/agents/*.md` in the local clone before installation; select `default` to remove all pins. Use a separate clone or select the desired profile again when installing into another setup.

Keep the local clone at a stable path: the consuming project's APM dependency points to it. The setup command passes the profile's target to both install and compile, including when the project already has `apm.yml` with other targets. For later bare `apm install` or `apm compile` runs, set that manifest's `targets:` to the profile's target.
