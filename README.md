# dream-team-kit

An APM-based agent kit for multi-agent workflows across Copilot, Claude, and OpenCode.

This repository packages a shared set of agents, skills, and instructions so the same working model can be deployed to multiple agent platforms from one source of truth.

## Install

### 1. Install APM

On macOS or Linux:

```sh
curl -sSL https://aka.ms/apm-unix | sh
```

Verify the CLI is available:

```sh
apm --version
```

### 2. Use this kit in another APM project

If you want to use this kit in your own repo, you normally do not clone this repository.

Instead, install it as an APM package from your target project:

```sh
cd your-project
apm init
apm install <owner>/td-agentcraft-kit#main
```

That adds this kit to your `apm.yml`, resolves it into `apm_modules/`, and deploys its agents, skills, and instructions into the directories your AI tools read.

If the GitHub repository is private, authenticate first with `gh auth login`.

## Project Purpose

The kit is structured around role-based agents such as:

- team leader
- software engineer
- software architect
- qa engineer
- code reviewer
- product specialist

It also includes workflow skills for architecture, code review, testing, escalation, investigation, and notifications.

## Telegram Notifications

This repo includes a notifier at `.apm/skills/notify/notify.mjs` that can send Telegram messages.

To enable it, set these environment variables at the system level:

- `TELEGRAM_TOKEN`
- `TELEGRAM_CHAT_ID`

Example for a shell-based setup:

```sh
export TELEGRAM_TOKEN="your-telegram-bot-token"
export TELEGRAM_CHAT_ID="your-chat-id"
```

For persistent local setup on macOS, add those exports to your shell profile such as `~/.zshrc` or `~/.zprofile`. If your editor or agent runner is launched outside the shell session, make sure those variables are available to the process at the OS level as well.

## Notes

- `apm_modules/` is ignored by git and should remain generated/local state.
- The repo currently keeps operational configuration in source and expects secrets to come from the environment.
- If you add more notification providers later, follow the same pattern: read credentials from environment variables, not from committed files.
- When `apm.yml` changes, run `apm install` again so deployed agent files stay in sync with the manifest and lockfile.
