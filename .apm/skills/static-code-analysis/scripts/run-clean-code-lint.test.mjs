import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const script = new URL('./run-clean-code-lint.mjs', import.meta.url).pathname;

function lintSource(source, extension = 'js') {
  const directory = mkdtempSync(join(tmpdir(), 'clean-code-lint-test-'));
  const sourcePath = join(directory, `subject.${extension}`);
  writeFileSync(sourcePath, source);

  const result = spawnSync(process.execPath, [script, sourcePath], { encoding: 'utf8' });
  const reportPath = result.stdout.match(/Clean-code lint report: (.+)/)?.[1];
  const report = reportPath ? JSON.parse(readFileSync(reportPath, 'utf8')) : [];

  return { report, result };
}

function ruleIds(report) {
  return report.flatMap((file) => file.messages.map((message) => message.ruleId));
}

test('rejects functions with more than three parameters', () => {
  const result = lintSource('function createOrder(customer, items, address, payment) { return customer; }\n');

  assert.equal(result.result.status, 1);
  assert.deepEqual(ruleIds(result.report), ['max-params']);
  assert.match(result.result.stderr, /CLEAN-CODE ERROR .*\[max-params\]/);
  assert.match(result.result.stderr, /Replace positional parameters with an intention-revealing options object/);
});

test('rejects functions longer than twenty non-comment, non-blank lines', () => {
  const statements = Array.from({ length: 21 }, (_, index) => `  total += ${index};`).join('\n');
  const source = `function calculateTotal() {\n  let total = 0;\n${statements}\n  return total;\n}\n`;
  const result = lintSource(source);

  assert.equal(result.result.status, 1);
  assert.deepEqual(ruleIds(result.report), ['max-lines-per-function']);
  assert.match(result.result.stderr, /Extract one cohesive block into a named function/);
});

test('rejects true boolean literal call arguments', () => {
  const source = 'function enable(feature) { return feature; }\nenable(true);\n';
  const result = lintSource(source);

  assert.equal(result.result.status, 1);
  assert.deepEqual(ruleIds(result.report), ['no-restricted-syntax']);
  assert.match(result.result.stderr, /Replace the boolean literal with separate intention-revealing functions/);
});

test('rejects false boolean literal call arguments', () => {
  const source = 'function disable(feature) { return feature; }\ndisable(false);\n';
  const result = lintSource(source);

  assert.equal(result.result.status, 1);
  assert.deepEqual(ruleIds(result.report), ['no-restricted-syntax']);
  assert.match(result.result.stderr, /Do not add a boolean option/);
});

test('accepts compliant JavaScript', () => {
  const source = 'function createOrder(customer, items, address) { return { customer, items, address }; }\n';
  const result = lintSource(source);

  assert.equal(result.result.status, 0, result.result.stderr);
  assert.deepEqual(result.report[0].messages, []);
});

test('does not inspect node_modules while collecting JavaScript files', () => {
  const directory = mkdtempSync(join(tmpdir(), 'clean-code-lint-test-'));
  const dependencyDirectory = join(directory, 'node_modules', 'dependency');
  mkdirSync(dependencyDirectory, { recursive: true });
  writeFileSync(join(directory, 'source.js'), 'function createOrder(customer, items, address) { return customer; }\n');
  writeFileSync(join(dependencyDirectory, 'generated.js'), 'function generated(one, two, three, four) { return one; }\n');

  const result = spawnSync(process.execPath, [script, directory], { encoding: 'utf8' });

  assert.equal(result.status, 0, result.stderr);
});

test('rejects TypeScript functions with more than three parameters', () => {
  const source = 'function createOrder(customer: string, items: string[], address: string, payment: string) { return customer; }\n';
  const result = lintSource(source, 'ts');

  assert.equal(result.result.status, 1);
  assert.deepEqual(ruleIds(result.report), ['max-params']);
});

test('rejects TypeScript functions longer than twenty non-comment, non-blank lines', () => {
  const statements = Array.from({ length: 21 }, (_, index) => `  total += ${index};`).join('\n');
  const source = `function calculateTotal(): number {\n  let total = 0;\n${statements}\n  return total;\n}\n`;
  const result = lintSource(source, 'ts');

  assert.equal(result.result.status, 1);
  assert.deepEqual(ruleIds(result.report), ['max-lines-per-function']);
});

test('rejects TypeScript boolean literal call arguments', () => {
  const source = 'function enable(feature: boolean) { return feature; }\nenable(true);\n';
  const result = lintSource(source, 'ts');

  assert.equal(result.result.status, 1);
  assert.deepEqual(ruleIds(result.report), ['no-restricted-syntax']);
});

test('accepts compliant TypeScript', () => {
  const source = 'function createOrder(customer: string, items: string[], address: string) { return { customer, items, address }; }\n';
  const result = lintSource(source, 'ts');

  assert.equal(result.result.status, 0, result.result.stderr);
  assert.deepEqual(result.report[0].messages, []);
});
