# td-agentcraft-kit

APM kit for Copilot, Claude, and OpenCode.

## Install APM

Checkout APM official quickstart [here](https://microsoft.github.io/apm/quickstart/)

## Install In A Repo

Use this when you want the kit inside a specific project.

```sh
cd your-project
apm init --target opencode,claude,copilot
apm install https://github.com/tom-dorofeyev/td-agentcraft-kit#main
```

## Install Globally

Use this when you want the kit available in your user config.
Either by directly accessing github:

macOS / Linux:

```
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,claude,copilot
```

Windows PowerShell:

```
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,claude,copilot
```

Or clone locally and install after adding some custom changes:

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

Global files are deployed to:

macOS / Linux:

- OpenCode: `~/.config/opencode/`
- Claude Code: `~/.claude/`
- GitHub Copilot: `~/.copilot/`

Windows PowerShell:

- OpenCode: `~\.config\opencode\`
- Claude Code: `~\.claude\`
- GitHub Copilot: `~\.copilot\`

## Telegram Notifications

Telegram setup instructions live in [docs/telegram-notifications.md](docs/telegram-notifications.md).
