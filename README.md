# td-agentcraft-kit

Run the same APM workflow across Copilot, OpenCode, and Codex with one install.

Best if you want a fast, reusable setup without rebuilding the same agent structure in each tool.

## Why Use It

- One kit for Copilot, OpenCode, and Codex
- Safer project-level install by default
- Optional global install and Telegram notifications

## Recommended For Most People

Install APM once: [APM Quickstart](https://microsoft.github.io/apm/quickstart/)

Then install this kit in the repository you are working on:

```sh
cd your-project
apm install https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,copilot,codex
apm compile --target opencode,copilot,codex
```

This is the default recommendation because it stays local to one repo and is easier to change later.

## Want It Available Everywhere Instead?

Use the global install only if you want the same kit across all projects on your machine:

```sh
apm install --global https://github.com/tom-dorofeyev/td-agentcraft-kit#main --target opencode,copilot,codex
apm compile --global
```

If you already have a user-level APM manifest, check its `targets:` before compiling. See [docs/install-globally.md](docs/install-globally.md) for details.

## Optional

- Telegram notifications: [docs/telegram-notifications.md](docs/telegram-notifications.md)
- Project install details: [docs/install-in-a-project.md](docs/install-in-a-project.md)
- Model selection and setup: [docs/models](docs/models/README.md)
- All docs: [docs](docs)

## Contributing

With Node.js and npm installed, run `npm ci` after cloning to install dependencies and enable the Git pre-commit hook. The hook checks Markdown formatting and blocks commits if it fails; Git does not activate repository hooks automatically on clone.

Run `npm run format` to format the project's Markdown, including table alignment, then stage the changes. Run `npm run format:check` to check formatting without changing files. Prose line wrapping is preserved to keep diffs focused. The hook checks the working tree, so unstaged Markdown changes must also be formatted.
