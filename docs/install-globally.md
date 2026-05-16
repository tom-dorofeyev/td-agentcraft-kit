# Install Globally

Use this when you want the kit available in your user config for all projects.

## Install Directly From GitHub

macOS / Linux:

```sh
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,claude,copilot
```

Windows PowerShell:

```powershell
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,claude,copilot
```

## Install From A Local Clone

Use this if you want to customize the kit before installing it.

```sh
git clone https://github.com/tom-dorofeyev/td-agentcraft-kit td-agentcraft-kit
cd td-agentcraft-kit
```

Then run one of these:

macOS / Linux:

```sh
apm install --global "$PWD" --target opencode,claude,copilot
```

Windows PowerShell:

```powershell
apm install --global $PWD.Path --target opencode,claude,copilot
```

## Deployment Paths

Global files are deployed to:

macOS / Linux:

- OpenCode: `~/.config/opencode/`
- Claude Code: `~/.claude/`
- GitHub Copilot: `~/.copilot/`

Windows PowerShell:

- OpenCode: `~\.config\opencode\`
- Claude Code: `~\.claude\`
- GitHub Copilot: `~\.copilot\`

If you also want Telegram notifications, see [telegram-notifications.md](telegram-notifications.md).