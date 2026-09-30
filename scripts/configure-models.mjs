import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function validateModel(model, agent) {
  if (model === null) return;
  if (typeof model !== 'string' || !model.trim() || model !== model.trim()) {
    throw new Error(`${agent}: model must be a non-empty string or null`);
  }
}

function updateFrontmatter(source, model, agent) {
  const match = source.match(/^---\n([\s\S]*?)\n---(?=\n|$)/);
  if (!match) throw new Error(`${agent}: missing YAML frontmatter`);
  const lines = match[1].split('\n').filter((line) => !/^model\s*:/.test(line));
  if (model !== null) lines.splice(1, 0, `model: ${JSON.stringify(model)}`);
  return `---\n${lines.join('\n')}\n---${source.slice(match[0].length)}`;
}

function validateProfile(profile, profileName, agents) {
  const names = new Set(agents.map((name) => name.slice(0, -3)));
  for (const name of Object.keys(profile)) {
    if (!names.has(name)) throw new Error(`Unknown agent in ${profileName}: ${name}`);
    validateModel(profile[name], name);
  }
}

export async function configureModels(root, profileName = 'default') {
  const config = JSON.parse(await readFile(join(root, 'model-profiles.json'), 'utf8'));
  const profile = config.profiles?.[profileName];
  if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
    throw new Error(`Unknown model profile: ${profileName}`);
  }
  const agentsDir = join(root, '.apm', 'agents');
  const agents = (await readdir(agentsDir)).filter((name) => name.endsWith('.md'));
  validateProfile(profile, profileName, agents);
  const changes = await Promise.all(agents.map(async (file) => {
    const name = file.slice(0, -3);
    const path = join(agentsDir, file);
    const source = await readFile(path, 'utf8');
    return { path, content: updateFrontmatter(source, profile[name] ?? null, name) };
  }));
  await Promise.all(changes.map(({ path, content }) => writeFile(path, content)));
  return profileName;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  configureModels(repositoryRoot, process.argv[2])
    .then((name) => console.log(`Applied model profile: ${name}`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
