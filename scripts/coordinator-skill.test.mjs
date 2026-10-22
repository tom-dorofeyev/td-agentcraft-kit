import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillPath = join(root, '.apm', 'skills', 'coordinator', 'SKILL.md');

test('coordinator is an explicit session mode with a native-only boundary', async () => {
  const skill = await readFile(skillPath, 'utf8');

  assert.match(skill, /^---\nname: coordinator\ndescription: .+\n---/);
  assert.match(skill, /until the user asks to exit/);
  assert.match(skill, /sequentially through native delegation/);
  assert.match(skill, /Do not do specialist work locally, search the repository, run commands, or edit files/);
  assert.match(skill, /Do not use `\/delegate` or the CLI\/local fallback/);
  assert.match(skill, /stop and report a blocker/);
  assert.match(skill, /not a tool sandbox/);
});

test('coordinator reuses workflows and gives formal artifact ownership to a bounded regular Agent', async () => {
  const skill = await readFile(skillPath, 'utf8');

  for (const workflow of ['investigation', 'planner', 'implementer', 'code-workflow', 'specialized-agent']) {
    assert.ok(skill.includes(`/${workflow}`), `${workflow} workflow is reused`);
  }
  assert.match(skill, /delegate one bounded workflow-execution task to the native regular Agent/);
  assert.match(skill, /formal-plan creation, work-item transitions, evidence records/);
  assert.match(skill, /must not load `\/coordinator` or inherit this session's coordination-only restriction/);
});
