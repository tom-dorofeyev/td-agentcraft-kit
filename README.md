# td-agentcraft-kit

APM kit for Copilot, Claude, and OpenCode.

## Install APM

macOS / Linux:

```sh
curl -sSL https://aka.ms/apm-unix | sh
apm --version
```

Windows PowerShell:

```powershell
irm https://aka.ms/apm-windows | iex
apm --version
```

## Install In A Repo

Use this when you want the kit inside a specific project.

```sh
cd your-project
apm init --target opencode,claude,copilot
apm install https://github.com/tom-dorofeyev/td-agentcraft-kit#main
```

## Install Globally

Use this when you want the kit available in your user config.

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

Set these environment variables if you want Telegram notifications:

- `TELEGRAM_TOKEN`
- `TELEGRAM_CHAT_ID`

Current shell session:

macOS / Linux:

```sh
export TELEGRAM_TOKEN="your-telegram-bot-token"
export TELEGRAM_CHAT_ID="your-chat-id"
```

Windows PowerShell:

```powershell
$env:TELEGRAM_TOKEN="your-telegram-bot-token"
$env:TELEGRAM_CHAT_ID="your-chat-id"
```

Persist for future sessions:

macOS / Linux:

```sh
printf '\nexport TELEGRAM_TOKEN="your-telegram-bot-token"\nexport TELEGRAM_CHAT_ID="your-chat-id"\n' >> ~/.zshrc
source ~/.zshrc
```

Windows PowerShell:

```powershell
[Environment]::SetEnvironmentVariable("TELEGRAM_TOKEN", "your-telegram-bot-token", "User")
[Environment]::SetEnvironmentVariable("TELEGRAM_CHAT_ID", "your-chat-id", "User")
```

macOS GUI apps started outside the shell may also need these in the current login session:

```sh
launchctl setenv TELEGRAM_TOKEN "your-telegram-bot-token"
launchctl setenv TELEGRAM_CHAT_ID "your-chat-id"
```
