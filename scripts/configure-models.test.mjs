import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { configureModels } from './configure-models.mjs';

async function fixture(profiles) {
  const root = await mkdtemp(join(tmpdir(), 'model-profiles-'));
  const agentsDir = join(root, '.apm', 'agents');
  await mkdir(agentsDir, { recursive: true });
  await writeFile(join(root, 'model-profiles.json'), JSON.stringify({ profiles }));
  await writeFile(join(agentsDir, 'builder.md'), '---\ndescription: Builds things.\nmode: subagent\n---\n\nBody.\n');
  return { root, path: join(agentsDir, 'builder.md') };
}

test('a selected profile pins its model and the default restores inheritance', async () => {
  const { root, path } = await fixture({ default: {}, fast: { builder: 'provider/fast-model' } });
  await configureModels(root, 'fast');
  assert.match(await readFile(path, 'utf8'), /model: "provider\/fast-model"/);
  await configureModels(root, 'default');
  assert.equal(await readFile(path, 'utf8'), '---\ndescription: Builds things.\nmode: subagent\n---\n\nBody.\n');
});

test('an unknown agent fails before changing any agent', async () => {
  const { root, path } = await fixture({ broken: { builder: 'valid', typo: 'model' } });
  const before = await readFile(path, 'utf8');
  await assert.rejects(configureModels(root, 'broken'), /Unknown agent/);
  assert.equal(await readFile(path, 'utf8'), before);
});
