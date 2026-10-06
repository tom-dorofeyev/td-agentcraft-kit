import assert from 'node:assert/strict';
import { chmodSync, existsSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import test from 'node:test';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

const script = new URL('./run-static-analysis.mjs', import.meta.url).pathname;

function executable(directory, name, source) {
  const path = join(directory, name);
  writeFileSync(path, `#!/usr/bin/env node\n${source}`);
  chmodSync(path, 0o755);
}

function runAnalysis(directory, arguments_ = []) {
  return spawnSync(process.execPath, [script, ...arguments_, join(directory, 'source.txt')], {
    encoding: 'utf8',
    cwd: directory,
    env: { ...process.env, PATH: `${directory}:${process.env.PATH}` },
  });
}

function runAnalysisConcurrent(directory) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, join(directory, 'source.txt')], {
      cwd: directory,
      env: { ...process.env, PATH: `${directory}:${process.env.PATH}` },
    });
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.on('error', reject);
    child.on('close', (status) => resolve({ status, stdout }));
  });
}

function duplicationReport(output) {
  return output.match(/Duplication report: (.+)/)?.[1];
}

function fixture(commandSource) {
  const directory = mkdtempSync(join(tmpdir(), 'static-analysis-test-'));
  writeFileSync(join(directory, 'source.txt'), 'source');
  executable(directory, 'lizard', commandSource);
  executable(directory, 'jscpd', "const fs = require('node:fs'); const path = require('node:path'); const output = process.argv[process.argv.indexOf('--output') + 1]; fs.writeFileSync(path.join(output, 'jscpd-report.json'), '{}');");
  return directory;
}

test('reports completion only after every analyzer exits successfully', () => {
  const result = runAnalysis(fixture('process.exit(0);'));

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Static analysis completed successfully\./);
});

test('writes repeated duplication reports under one project-local parent without overwriting', () => {
  const directory = fixture('process.exit(0);');
  const expectedParent = join(realpathSync(directory), '.agent-craft-work', 'static-code-analysis');

  const first = runAnalysis(directory);
  const second = runAnalysis(directory);

  assert.equal(first.status, 0, first.stderr);
  assert.equal(second.status, 0, second.stderr);
  assert.equal(dirname(dirname(duplicationReport(first.stdout))), expectedParent);
  assert.equal(dirname(dirname(duplicationReport(second.stdout))), expectedParent);
  assert.notEqual(duplicationReport(first.stdout), duplicationReport(second.stdout));
  assert.ok(existsSync(duplicationReport(first.stdout)));
  assert.ok(existsSync(duplicationReport(second.stdout)));
});

test('keeps overlapping duplication reports separate', async () => {
  const directory = fixture('setTimeout(() => process.exit(0), 200);');

  const [first, second] = await Promise.all([runAnalysisConcurrent(directory), runAnalysisConcurrent(directory)]);

  assert.equal(first.status, 0);
  assert.equal(second.status, 0);
  assert.notEqual(duplicationReport(first.stdout), duplicationReport(second.stdout));
  assert.ok(existsSync(duplicationReport(first.stdout)));
  assert.ok(existsSync(duplicationReport(second.stdout)));
});

test('honors an explicit duplication report directory', () => {
  const directory = fixture('process.exit(0);');
  const reportDirectory = join(directory, 'custom-reports');

  const result = runAnalysis(directory, ['--report-dir', reportDirectory]);

  assert.equal(result.status, 0, result.stderr);
  assert.ok(existsSync(join(reportDirectory, 'jscpd-report.json')));
  assert.match(result.stdout, /Static analysis reports: .*custom-reports/);
});
