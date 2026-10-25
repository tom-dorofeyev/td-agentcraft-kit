# Install Globally

Use this when you want the kit available in your user config for all projects.

If you already have a user-level APM setup, check [Global Target Scope](#global-target-scope) before running `apm compile --global`.

## Install Directly From GitHub

macOS / Linux:

```sh
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#v5.0.10 --target opencode,copilot
apm compile --global
```

Windows PowerShell:

```powershell
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#v5.0.10 --target opencode,copilot
apm compile --global
```

## Install From A Local Clone

Use this if you want to customize the kit before installing it.

```sh
git clone https://github.com/tom-dorofeyev/td-agentcraft-kit td-agentcraft-kit
cd td-agentcraft-kit
```

To assign models to individual agents, edit `model-profiles.json`, add a named profile, then apply it before installing:

```sh
node scripts/configure-models.mjs my-profile
```

Use model IDs accepted by the target runtime. An omitted or `null` entry inherits that runtime's default. Run `node scripts/configure-models.mjs default` to remove all model pins. The command updates `.apm/agents/*.md` in the clone; inspect those changes before installing.

Then run one of these:

macOS / Linux:

```sh
apm install --global "$PWD" --target opencode,copilot
apm compile --global
```

Windows PowerShell:

```powershell
apm install --global $PWD.Path --target opencode,copilot
apm compile --global
```

## Global Target Scope

On a fresh user-level APM setup, install records the selected targets. If `~/.apm/apm.yml` already exists (Windows: `%USERPROFILE%\.apm\apm.yml`), check its `targets:` before compiling. To limit compilation to this kit's two targets, use:

```yaml
targets: [opencode, copilot]
```

`apm compile --global` reads the manifest's targets, not the preceding install command's `--target` flag. If the manifest declares no targets, it writes context files for every supported user-level target.

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
