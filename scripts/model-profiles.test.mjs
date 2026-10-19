import assert from 'node:assert/strict';
import { copyFile, mkdtemp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { configureModels } from './configure-models.mjs';

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'shipped-model-profiles-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const agentsDir = join('.apm', 'agents');
  await mkdir(join(root, agentsDir), { recursive: true });
  await copyFile(join(sourceRoot, 'model-profiles.json'), join(root, 'model-profiles.json'));
  const agents = (await readdir(join(sourceRoot, agentsDir))).filter((name) => name.endsWith('.md'));
  await Promise.all(agents.map((name) => copyFile(join(sourceRoot, agentsDir, name), join(root, agentsDir, name))));
  return root;
}

async function assertAgentModel(root, agent, model) {
  const source = await readFile(join(root, '.apm', 'agents', `${agent}.md`), 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1];
  assert.ok(frontmatter, `${agent} has frontmatter`);
  assert.deepEqual(frontmatter.split('\n').filter((line) => line.startsWith('model: ')), [`model: ${JSON.stringify(model)}`]);
}

for (const [profile, builder, reviewer] of [
  ['opencode-copilot', 'github-copilot/claude-sonnet-5.5', 'github-copilot/gpt-6-sol'],
  ['copilot', 'Claude Sonnet 5.5', 'GPT-6 Sol'],
]) {
  test(`shipped ${profile} sets builder and reviewer models`, async (t) => {
    const root = await fixture(t);

    await configureModels(root, profile);

    await assertAgentModel(root, 'builder', builder);
    await assertAgentModel(root, 'reviewer', reviewer);
  });
}
