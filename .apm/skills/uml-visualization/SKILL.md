---
name: uml-visualization
description: Use only when explicitly loaded by the user to generate an interactive, reproducible view of static TypeScript and Java module dependencies.
---

# UML Visualization

## Purpose

Generate a local, interactive UML-inspired dependency view from source files.

## Run

Requires Python 3.9 or newer. Run the script from the directory where output should be written, passing the project root and the installed skill script's path:

```bash
python3 /path/to/uml-visualization/scripts/visualize.py /path/to/project
```

To review selected modules, repeat `--scope` with project-relative files or directories:

```bash
python3 /path/to/uml-visualization/scripts/visualize.py /path/to/project --scope src/auth --scope src/app.ts
```

To review uncommitted changes instead:

```bash
python3 /path/to/uml-visualization/scripts/visualize.py /path/to/project --changed
```

This includes existing source files with staged, unstaged, or untracked Git changes under the project root, not committed branch changes. Deleted files are omitted; renames include the existing destination. Git must be available and the project must be inside a repository. No changes produces an empty graph. The options cannot be combined. Scope paths must exist inside the project. Both modes retain edges only when both endpoints are selected; imports of files outside the selection are not reported as unresolved. Normal source exclusions still apply.

The default output is `.agent-craft-work/uml-visualization/dependencies.html` under the current working directory. Use `--output <path>` for a different location inside that directory; paths outside it, including symlink escapes, are rejected. Existing files are not overwritten unless `--force` is supplied. Generate again after changing source with `--force` or a new output path. Identical source trees produce identical output bytes.

Open the generated HTML locally in a browser. Select a module to highlight its incoming and outgoing edges; use the filter to narrow the view. The viewer follows the system color scheme initially; use the theme button to switch between light and dark mode.

## Interpretation

Each file is a module; directory paths group modules into components. Arrows point from importer to imported module. The graph is a static approximation, not runtime interactions or a complete UML model. The lightweight pattern-based scanner recognizes TypeScript/JavaScript imports, re-exports, literal dynamic imports, and local `tsconfig.json` `baseUrl`/`paths` aliases, plus Java explicit and wildcard imports. Java wildcard edges are inferred from matching type names and can be ambiguous. Unresolved imports, including external libraries, and unsupported inherited or invalid TypeScript configuration are listed in the viewer rather than drawn as edges. The scanner can misidentify import-like text in strings; it does not resolve inherited TypeScript configuration, computed imports, Java same-package references, inheritance without imports, reflection, runtime calls, or cross-language links. Tests are included; dependency, build and hidden directories are excluded. Review source before drawing architectural conclusions.

Do not invent dependency directions or layers. Treat missing edges as unknown, not proof of independence. The script reads source and writes only the output and its parent directories inside the current working directory; it does not execute project code or access the network.
