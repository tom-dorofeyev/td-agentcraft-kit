import assert from 'node:assert/strict';
import { chmodSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const script = new URL('./run-static-analysis.mjs', import.meta.url).pathname;

function writeTool(directory, name) {
  const tool = join(directory, name);
  writeFileSync(
    tool,
    `#!/usr/bin/env node\nimport { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';\nimport { join } from 'node:path';\nconst [,, ...arguments_] = process.argv;\nappendFileSync(process.env.INVOCATION_LOG, JSON.stringify({ name: process.argv[1].split('/').pop(), arguments_ }) + '\\n');\nif (process.argv[1].endsWith('jscpd')) { const output = arguments_[arguments_.indexOf('--output') + 1]; mkdirSync(output, { recursive: true }); writeFileSync(join(output, 'jscpd-report.json'), '{}'); }\n`,
  );
  chmodSync(tool, 0o755);
}

test('runs both analyzers with the gate thresholds and report directory', () => {
  const directory = mkdtempSync(join(tmpdir(), 'static-analysis-test-'));
  const tools = join(directory, 'tools');
  const reports = join(directory, 'reports');
  const source = join(directory, 'source.js');
  const log = join(directory, 'invocations.jsonl');

  mkdirSync(tools);
  writeFileSync(source, 'export const answer = 42;\n');
  writeTool(tools, 'lizard');
  writeTool(tools, 'jscpd');

  const result = spawnSync(process.execPath, [script, '--report-dir', reports, source], {
    encoding: 'utf8',
    env: { ...process.env, INVOCATION_LOG: log, PATH: `${tools}:${process.env.PATH}` },
  });

  assert.equal(result.status, 0, result.stderr);
  const invocations = readFileSync(log, 'utf8').trim().split('\n').map(JSON.parse);
  assert.deepEqual(invocations[0], {
    name: 'lizard',
    arguments_: ['--warnings_only', '--CCN', '10', '--ignore_warnings', '-1', source],
  });
  assert.deepEqual(invocations[1], {
    name: 'jscpd',
    arguments_: ['--threshold', '10', '--reporters', 'json', '--output', reports, source],
  });
  assert.equal(readFileSync(join(reports, 'jscpd-report.json'), 'utf8'), '{}');
});

test('rejects a missing report directory before invoking analyzers', () => {
  const result = spawnSync(process.execPath, [script, '--report-dir'], { encoding: 'utf8' });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /--report-dir requires a directory/);
});
