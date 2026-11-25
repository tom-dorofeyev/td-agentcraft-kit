#!/usr/bin/env python3
"""Create a deterministic, offline view of conservative static dependencies."""

import argparse
import json
import os
import re
import subprocess
from pathlib import Path

EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.java'}
IGNORED = {'node_modules', 'dist', 'build', 'target', 'vendor'}
IMPORT = re.compile(r'\b(?:import|export)\s+(?:[^;\n]*?\s+from\s+)?[\'"]([^\'"]+)[\'"]')
DYNAMIC_IMPORT = re.compile(r'\bimport\s*\(\s*([\'"])([^\'"]+)\1\s*\)')
COMPUTED_IMPORT = re.compile(r'\bimport\s*\(\s*(?![\s\'"])')
JAVA_PACKAGE = re.compile(r'\bpackage\s+([\w.]+)\s*;')
JAVA_IMPORT = re.compile(r'\bimport\s+(static\s+)?([\w.]+(?:\.\*)?)\s*;')
COMMENTS = re.compile(r'/\*.*?\*/|//[^\n]*|"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'', re.S)


def strip_comments(text):
    return COMMENTS.sub(lambda m: m.group() if m.group().startswith(('"', "'")) else ' ' * len(m.group()), text)


def source_files(root):
    return sorted(p for p in root.rglob('*') if p.is_file() and not p.is_symlink()
                  and p.suffix in EXTENSIONS and not any(
                      part.startswith('.') or part in IGNORED for part in p.relative_to(root).parts))


def java_names(files, texts):
    names = {}
    for path in files:
        if path.suffix != '.java':
            continue
        package = JAVA_PACKAGE.search(texts[path])
        if package:
            names[package.group(1) + '.' + path.stem] = path
    return names


def resolve_file(base, known):
    base = base.resolve()
    candidates = [base] + [Path(str(base) + ext) for ext in sorted(EXTENSIONS - {'.java'})]
    if base.suffix in {'.js', '.jsx', '.mjs', '.cjs'}:
        candidates += [base.with_suffix(ext) for ext in ('.ts', '.tsx')]
    candidates += [base / ('index' + ext) for ext in sorted(EXTENSIONS - {'.java'})]
    return next((candidate for candidate in candidates if candidate in known), None)


def config_for(path, root):
    for directory in (path.parent, *path.parent.parents):
        if directory == root.parent:
            break
        config = directory / 'tsconfig.json'
        if config.is_file():
            try:
                content = strip_comments(config.read_text(encoding='utf-8'))
                return config, json.loads(re.sub(r',\s*([}\]])', r'\1', content))
            except (ValueError, OSError) as error:
                return config, {'error': str(error)}
    return None, {}


def alias_match(pattern, specifier):
    prefix, star, suffix = pattern.partition('*')
    if not star:
        return '' if specifier == pattern else None
    if not specifier.startswith(prefix) or not specifier.endswith(suffix):
        return None
    if len(specifier) < len(prefix) + len(suffix):
        return None
    return specifier[len(prefix):len(specifier) - len(suffix) if suffix else None]


def alias_candidates(specifier, config, settings):
    options = settings.get('compilerOptions', {})
    base = config.parent / options.get('baseUrl', '.')
    paths = options.get('paths', {})
    for pattern in sorted(paths, key=lambda item: (-len(item.replace('*', '')), item)):
        match = alias_match(pattern, specifier)
        if match is None:
            continue
        for target in paths[pattern]:
            yield base / target.replace('*', match)
    if 'baseUrl' in options:
        yield base / specifier


def resolve_ts(path, specifier, known, config, settings):
    if specifier.startswith('.'):
        return resolve_file(path.parent / specifier, known)
    if config:
        for candidate in alias_candidates(specifier, config, settings):
            result = resolve_file(candidate, known)
            if result:
                return result
    return None


def java_import_target(name, names):
    while name:
        if name in names:
            return names[name]
        name = name.rpartition('.')[0]
    return None


def java_targets(text, names):
    body = JAVA_IMPORT.sub('', text)
    for match in JAVA_IMPORT.finditer(text):
        static, name = match.groups()
        if name.endswith('.*') and not static:
            package = name[:-2]
            candidates = [path for qualified, path in names.items()
                          if qualified.rpartition('.')[0] == package
                          and re.search(r'\b' + re.escape(path.stem) + r'\b', body)]
            yield name, candidates
        else:
            target = java_import_target(name.removesuffix('.*'), names)
            yield name, [target] if target else []


def add_targets(path, entries, root, edges, unresolved):
    source = path.relative_to(root).as_posix()
    for specifier, targets in entries:
        if not targets:
            unresolved.add((source, specifier))
        for target in targets:
            if target != path:
                edges.add((source, target.relative_to(root).as_posix()))


def ts_targets(path, text, known, config, settings):
    specifiers = [match.group(1) for match in IMPORT.finditer(text)]
    specifiers += [match.group(2) for match in DYNAMIC_IMPORT.finditer(text)]
    for specifier in specifiers:
        target = resolve_ts(path, specifier, known, config, settings)
        yield specifier, [target] if target else []
    if COMPUTED_IMPORT.search(text):
        yield '<computed dynamic import>', []


def selected_files(root, files, paths):
    selected = set()
    for value in paths:
        path = Path(value)
        if path.is_absolute() or '..' in path.parts:
            raise ValueError(f'scope must be project-relative: {value}')
        target = (root / path).resolve()
        if not target.is_relative_to(root) or not target.exists():
            raise ValueError(f'scope must exist inside the project: {value}')
        selected.update(file for file in files if file == target or target in file.parents)
    return selected


def changed_files(root, files):
    try:
        repo = subprocess.run(
            ['git', '-C', str(root), 'rev-parse', '--show-toplevel'],
            capture_output=True, check=False)
        if repo.returncode:
            raise ValueError('could not read Git repository: ' + repo.stderr.decode(errors='replace').strip())
        repo_root = Path(os.fsdecode(repo.stdout).rstrip('\n')).resolve()
        result = subprocess.run(
            ['git', '-C', str(root), 'status', '--porcelain=v1', '-z',
             '--untracked-files=all', '--no-renames', '--', '.'],
            capture_output=True, check=False)
    except OSError as error:
        raise ValueError(f'could not read Git status: {error}') from error
    if result.returncode:
        raise ValueError('could not read Git status: ' + result.stderr.decode(errors='replace').strip())
    changed = {repo_root / os.fsdecode(entry[3:]) for entry in result.stdout.split(b'\0') if entry}
    return set(files) & changed


def graph(root, selected=None):
    files = source_files(root)
    texts = {path: strip_comments(path.read_text(encoding='utf-8')) for path in files}
    names = java_names(files, texts)
    known = set(files)
    edges = set()
    unresolved = set()
    warnings = set()
    for path in files:
        if path.suffix == '.java':
            targets = java_targets(texts[path], names)
        else:
            config, settings = config_for(path, root)
            if ('extends' in settings or 'error' in settings) and (selected is None or path in selected):
                warnings.add(f'{config.relative_to(root)}: inherited or invalid configuration is not resolved')
            targets = ts_targets(path, texts[path], known, config, settings)
        add_targets(path, targets, root, edges, unresolved)
    included = set(files) if selected is None else set(files) & selected
    paths = {path.relative_to(root).as_posix() for path in included}
    return {'nodes': sorted(paths),
            'edges': [list(edge) for edge in sorted(edges) if edge[0] in paths and edge[1] in paths],
            'unresolved': [list(item) for item in sorted(unresolved) if item[0] in paths],
            'warnings': sorted(warnings)}


def render(data):
    payload = json.dumps(data, ensure_ascii=True, separators=(',', ':')).replace('<', '\\u003c')
    template = Path(__file__).with_name('viewer.html').read_text(encoding='utf-8')
    return template.replace('/* GRAPH_DATA */', payload)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', type=Path)
    parser.add_argument('--output', type=Path, default=Path('.agent-craft-work/uml-visualization/dependencies.html'))
    parser.add_argument('--force', action='store_true', help='overwrite an existing output file')
    scope = parser.add_mutually_exclusive_group()
    scope.add_argument('--scope', action='append', metavar='PATH', help='include a project-relative file or directory; repeatable')
    scope.add_argument('--changed', action='store_true', help='include Git changed and untracked source files')
    args = parser.parse_args()
    root = args.root.resolve(strict=True)
    if not root.is_dir():
        parser.error('root must be a directory')
    output = args.output.resolve()
    if not output.is_relative_to(Path.cwd().resolve()):
        parser.error('output must be inside the current working directory')
    try:
        files = source_files(root)
        selected = selected_files(root, files, args.scope) if args.scope else None
        if args.changed:
            selected = changed_files(root, files)
    except ValueError as error:
        parser.error(str(error))
    content = render(graph(root, selected))
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open('w' if args.force else 'x', encoding='utf-8') as file:
        file.write(content)
    print(f'Wrote {output}')


if __name__ == '__main__':
    main()
