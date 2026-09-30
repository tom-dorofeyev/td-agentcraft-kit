# Install Globally

Use this when you want the kit available in your user config for all projects.

## Install Directly From GitHub

macOS / Linux:

```sh
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,copilot
```

Windows PowerShell:

```powershell
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,copilot
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
```

Windows PowerShell:

```powershell
apm install --global $PWD.Path --target opencode,copilot
```

## Deployment Paths

Global files are deployed to:

macOS / Linux:

- OpenCode: `~/.config/opencode/`
- GitHub Copilot: `~/.copilot/`

Windows PowerShell:

- OpenCode: `~\.config\opencode\`
- GitHub Copilot: `~\.copilot\`

If you also want Telegram notifications, see [telegram-notifications.md](telegram-notifications.md).
