import assert from 'node:assert/strict';
import { chmodSync, mkdtempSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const script = new URL('./run-static-analysis.mjs', import.meta.url).pathname;

function executable(directory, name, source) {
  const path = join(directory, name);
  writeFileSync(path, `#!/usr/bin/env node\n${source}`);
  chmodSync(path, 0o755);
}

function runAnalysis(directory) {
  return spawnSync(process.execPath, [script, join(directory, 'source.txt')], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${directory}:${process.env.PATH}` },
  });
}

function fixture(commandSource) {
  const directory = mkdtempSync(join(tmpdir(), 'static-analysis-test-'));
  writeFileSync(join(directory, 'source.txt'), 'source');
  executable(directory, 'lizard', commandSource);
  executable(directory, 'jscpd', 'process.exit(0);');
  return directory;
}

test('reports completion only after every analyzer exits successfully', () => {
  const result = runAnalysis(fixture('process.exit(0);'));

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Static analysis completed successfully\./);
});
