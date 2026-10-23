# Install Globally

Use this when you want the kit available in your user config for all projects.

If you already have a user-level APM setup, check [Global Target Scope](#global-target-scope) before running `apm compile --global`.

## Install Directly From GitHub

macOS / Linux:

```sh
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,copilot
apm compile --global
```

Windows PowerShell:

```powershell
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,copilot
apm compile --global
```

## Install From A Local Clone With A Model Profile

Clone the kit and run one setup command. It asks which profile to use, applies the selected agent models, then runs APM install and compile globally:

```sh
git clone https://github.com/tom-dorofeyev/td-agentcraft-kit td-agentcraft-kit
node td-agentcraft-kit/scripts/install.mjs --global
```

For automation, add `--profile opencode-openai`, `--profile opencode-copilot`, `--profile copilot`, or `--profile default`. Noninteractive runs require `--profile`. Edit `model-profiles.json` to define custom profiles with a `target` and `models` map; see [project setup](install-in-a-project.md#select-models-per-agent). Omitted agents and `null` values inherit the runtime default. The command updates `.apm/agents/*.md` in the clone before installing; select `default` to remove all pins. Keep the clone at a stable path because APM records a local dependency reference.

## Global Target Scope

On a fresh user-level APM setup, install records the selected targets. If `~/.apm/apm.yml` already exists (Windows: `%USERPROFILE%\.apm\apm.yml`), check its `targets:` before compiling. To limit compilation to this kit's two targets, use:

```yaml
targets: [opencode, copilot]
```

`apm compile --global` reads the manifest's targets, not the preceding install command's `--target` flag. If the manifest declares no targets, it writes context files for every supported user-level target.
When using a model profile, set `targets:` to that profile's target before later bare global install or compile runs, so those runs do not deploy its model pins to another harness.

## Deployment Paths

`apm compile --global` writes the user-level `AGENTS.md` for OpenCode. APM preserves an existing hand-written root context file; review the compile output if one is already present. Global APM metadata and the lockfile live under `~/.apm/` (or `%USERPROFILE%\.apm\` on Windows).

Global files are deployed to:

macOS / Linux:

- OpenCode: `~/.config/opencode/`
- GitHub Copilot: `~/.copilot/`

Windows PowerShell:

- OpenCode: `~\.config\opencode\`
- GitHub Copilot: `~\.copilot\`

If you also want Telegram notifications, see [telegram-notifications.md](telegram-notifications.md).
