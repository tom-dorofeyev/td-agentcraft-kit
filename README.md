# td-agentcraft-kit

Run the same APM workflow across Copilot, Claude, and OpenCode with one install.

Best if you want a fast, reusable setup without rebuilding the same agent structure in each tool.

## Why Use It

- One kit for Copilot, Claude, and OpenCode
- Safer project-level install by default
- Optional global install and Telegram notifications

## Recommended For Most People

Install APM once: [APM Quickstart](https://microsoft.github.io/apm/quickstart/)

Then install this kit in the repository you are working on:

```sh
cd your-project
apm init --target opencode,claude,copilot
apm install https://github.com/tom-dorofeyev/td-agentcraft-kit#main
```

This is the default recommendation because it stays local to one repo and is easier to change later.

## Want It Available Everywhere Instead?

Use the global install only if you want the same kit across all projects on your machine:

```sh
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,claude,copilot
```

Full global setup details: [docs/install-globally.md](docs/install-globally.md)

## Optional

- Telegram notifications: [docs/telegram-notifications.md](docs/telegram-notifications.md)
- Project install details: [docs/install-in-a-project.md](docs/install-in-a-project.md)
- All docs: [docs](docs)
