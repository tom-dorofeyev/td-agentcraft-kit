# Work-item runner

Copy `implement-todo-work-items.sh` into your project's `scripts/` folder. The script is standalone; the tests and fixtures are only for maintaining this kit. No APM script registration is needed.

The runner processes the queue unattended, automatically starting a fresh implementation session for each item. Its CLI flags grant broad execution permissions, including shell commands. Codex's sandbox is disabled. Run it in an isolated development container or VM with only the project and credentials needed for the work available.

Install the kit's skills in the target project and make your selected agent CLI available on `PATH`. Run the commands for your harness from your own terminal, at the project root. The first command checks that the CLI is available; the second previews the queue; the third starts it.

## Codex

```sh
command -v codex
bash scripts/implement-todo-work-items.sh --harness codex --dry-run
bash scripts/implement-todo-work-items.sh --harness codex
```

The runner invokes `codex exec --dangerously-bypass-approvals-and-sandbox "<work-item prompt>"`. It exits automatically when the implementation session ends, with no approval prompts and no Codex sandbox. See the [Codex CLI reference](https://developers.openai.com/codex/cli/reference/).

## OpenCode

```sh
command -v opencode
bash scripts/implement-todo-work-items.sh --harness opencode --dry-run
bash scripts/implement-todo-work-items.sh --harness opencode
```

The runner invokes `opencode run --auto "<work-item prompt>"`. This is non-interactive mode with automatic approval of permissions that are not explicitly denied. Use a CLI version that supports `--auto` (check `opencode run --help`). See the [OpenCode CLI reference](https://opencode.ai/docs/cli/#run).

## Copilot

```sh
command -v copilot
bash scripts/implement-todo-work-items.sh --harness copilot --dry-run
bash scripts/implement-todo-work-items.sh --harness copilot
```

The runner invokes `copilot --allow-all --no-ask-user -p "<work-item prompt>"`. This grants tool, path, and URL permissions and prevents requests for user input. Explicit deny rules still apply. See the [Copilot programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference).

## Queue and permissions

Each session is asked to use the `implementer` skill. The runner searches `.agent-craft-work` under the current directory; set `AGENT_CRAFT_WORK_ROOT` to use another work-item directory.

Items run sequentially in sorted path order. The runner stops on a CLI failure or if the item has not moved from `todo/` to `done/`. Resolve incomplete items before starting the runner again.

Authenticate your selected CLI and set up required services before starting. Sessions receive no stdin and are instructed to resolve routine decisions without questions. If a session cannot complete, it should record the blocker and exit with the item incomplete. CLI flags cannot override OS permissions, organizational policies, missing credentials, or unavailable services.

Completion is checked through the CLI exit status and the work-item file location; the runner does not independently rerun quality gates. There is no timeout for a hung CLI or test process.

## Tests

To run the runner's tests in this kit:

```sh
bash scripts/implement-todo-work-items.test.sh
```
