import importlib.util
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch, Mock

SCRIPT = Path(__file__).parents[1] / 'scripts' / 'visualize.py'
spec = importlib.util.spec_from_file_location('visualize', SCRIPT)
visualize = importlib.util.module_from_spec(spec)
spec.loader.exec_module(visualize)


class VisualizationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name).resolve()

    def write(self, name, text):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8')

    def test_typescript_dependencies_and_exclusions(self):
        self.write('src/a.ts', 'import { b } from "./b";\nexport * from "./dir";\n// import "./missing"\nimport "library";')
        self.write('src/b.ts', 'export const b = 1;')
        self.write('src/dir/index.ts', '')
        self.write('node_modules/external.ts', '')
        self.assertEqual(visualize.graph(self.root), {
            'nodes': ['src/a.ts', 'src/b.ts', 'src/dir/index.ts'],
            'edges': [['src/a.ts', 'src/b.ts'], ['src/a.ts', 'src/dir/index.ts']],
            'unresolved': [['src/a.ts', 'library']], 'warnings': []})

    def test_java_imports_and_static_imports(self):
        self.write('one/A.java', 'package one; import two.B; import static two.B.method;')
        self.write('two/B.java', 'package two; class B {}')
        self.assertEqual(visualize.graph(self.root)['edges'], [['one/A.java', 'two/B.java']])

    def test_output_is_stable_and_script_safe(self):
        self.write('a.ts', '')
        result = visualize.graph(self.root)
        self.assertEqual(visualize.render(result), visualize.render(visualize.graph(self.root)))
        self.assertNotIn('</script><script>', visualize.render({'nodes': ['</script><script>'], 'edges': []}))

    def test_comment_scanner_preserves_import_strings(self):
        self.assertIn('"./b"', visualize.strip_comments('/* ignore */ import "./b"; // comment'))
        self.assertNotIn('comment', visualize.strip_comments('// comment'))

    def test_cli_writes_output(self):
        self.write('a.ts', '')
        output = self.root / 'diagram.html'
        previous = Path.cwd()
        os.chdir(self.root)
        self.addCleanup(os.chdir, previous)
        with patch('sys.argv', ['visualize.py', str(self.root), '--output', str(output)]):
            visualize.main()
        self.assertIn('a.ts', output.read_text(encoding='utf-8'))

    def test_default_output_and_overwrite_protection(self):
        previous = Path.cwd()
        os.chdir(self.root)
        self.addCleanup(os.chdir, previous)
        output = self.root / '.agent-craft-work/uml-visualization/dependencies.html'
        with patch('sys.argv', ['visualize.py', str(self.root)]):
            visualize.main()
            self.assertTrue(output.is_file())
            with self.assertRaises(FileExistsError):
                visualize.main()
        with patch('sys.argv', ['visualize.py', str(self.root), '--force']):
            visualize.main()

    def test_output_outside_current_directory_is_rejected(self):
        previous = Path.cwd()
        os.chdir(self.root)
        self.addCleanup(os.chdir, previous)
        with patch('sys.argv', ['visualize.py', str(self.root), '--output', '../outside.html']):
            with self.assertRaises(SystemExit):
                visualize.main()

    def test_symlink_escape_is_rejected(self):
        previous = Path.cwd()
        os.chdir(self.root)
        self.addCleanup(os.chdir, previous)
        (self.root / 'escape').symlink_to(self.root.parent, target_is_directory=True)
        with patch('sys.argv', ['visualize.py', str(self.root), '--output', 'escape/outside.html']):
            with self.assertRaises(SystemExit):
                visualize.main()

    def test_cli_rejects_file_as_root(self):
        self.write('a.ts', '')
        with patch('sys.argv', ['visualize.py', str(self.root / 'a.ts'), '--output', 'out']):
            with self.assertRaises(SystemExit):
                visualize.main()

    def test_typescript_aliases_and_dynamic_imports(self):
        self.write('tsconfig.json', '{"compilerOptions":{"baseUrl":".","paths":{"@/*":["src/*"]}}}')
        self.write('src/a.ts', 'import { b } from "@/b"; import("./b.js"); import("missing"); import(name);')
        self.write('src/b.ts', 'export const b = 1;')
        result = visualize.graph(self.root)
        self.assertEqual(result['edges'], [['src/a.ts', 'src/b.ts']])
        self.assertEqual(result['unresolved'], [['src/a.ts', '<computed dynamic import>'], ['src/a.ts', 'missing']])

    def test_java_wildcard_and_unresolved(self):
        self.write('one/A.java', 'package one; import two.*; import static two.B.*; import missing.X; class A { B b; }')
        self.write('two/B.java', 'package two; class B {}')
        self.write('two/C.java', 'package two; class C {}')
        result = visualize.graph(self.root)
        self.assertEqual(result['edges'], [['one/A.java', 'two/B.java']])
        self.assertEqual(result['unresolved'], [['one/A.java', 'missing.X']])

    def test_inherited_config_is_reported(self):
        self.write('tsconfig.json', '{"extends":"./base.json"}')
        self.write('a.ts', '')
        self.assertTrue(visualize.graph(self.root)['warnings'])

    def test_selected_files_and_directories_keep_only_internal_edges(self):
        self.write('src/a.ts', 'import "./b"; import "./c"; import "missing";')
        self.write('src/b.ts', '')
        self.write('src/c.ts', '')
        self.write('other/d.ts', '')
        files = visualize.source_files(self.root)
        selected = visualize.selected_files(self.root, files, ['src/a.ts', 'src/b.ts', 'other'])
        result = visualize.graph(self.root, selected)
        self.assertEqual(result['nodes'], ['other/d.ts', 'src/a.ts', 'src/b.ts'])
        self.assertEqual(result['edges'], [['src/a.ts', 'src/b.ts']])
        self.assertEqual(result['unresolved'], [['src/a.ts', 'missing']])

    def test_scope_rejects_missing_and_outside_paths(self):
        for path in ['../outside', '/outside', 'missing']:
            with self.subTest(path=path), self.assertRaises(ValueError):
                visualize.selected_files(self.root, [], [path])

    def test_changed_selection_includes_existing_source_files_only(self):
        self.write('staged.ts', '')
        self.write('new file.ts', '')
        self.write('unchanged.ts', '')
        status = b'M  staged.ts\0?? new file.ts\0 D deleted.ts\0?? notes.txt\0'
        repo = Mock(returncode=0, stdout=os.fsencode(str(self.root) + '\n'))
        with patch.object(visualize.subprocess, 'run', side_effect=[repo, Mock(returncode=0, stdout=status)]):
            selected = visualize.changed_files(self.root, visualize.source_files(self.root))
        self.assertEqual(visualize.graph(self.root, selected)['nodes'], ['new file.ts', 'staged.ts'])

    def test_changed_selection_for_project_inside_repository(self):
        self.write('project/a.ts', '')
        project = self.root / 'project'
        repo = Mock(returncode=0, stdout=os.fsencode(str(self.root) + '\n'))
        status = Mock(returncode=0, stdout=b' M project/a.ts\0')
        with patch.object(visualize.subprocess, 'run', side_effect=[repo, status]):
            selected = visualize.changed_files(project, visualize.source_files(project))
        self.assertEqual(visualize.graph(project, selected)['nodes'], ['a.ts'])

    def test_git_failure_is_reported(self):
        with patch.object(visualize.subprocess, 'run', return_value=Mock(returncode=128, stderr=b'not a repository')):
            with self.assertRaisesRegex(ValueError, 'not a repository'):
                visualize.changed_files(self.root, [])


if __name__ == '__main__':
    unittest.main()
