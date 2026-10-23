import { spawn } from 'node:child_process';
import { realpathSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { configureModels } from './configure-models.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const supportedTargets = new Set(['opencode', 'copilot']);

function parseTarget(target) {
  const names = target?.split(',').map((name) => name.trim());
  if (!names?.length || names.some((name) => !supportedTargets.has(name)) || new Set(names).size !== names.length) {
    throw new Error(`Invalid target: ${target}. Use opencode, copilot, or opencode,copilot.`);
  }
  return names.join(',');
}

async function loadProfiles(root) {
  const config = JSON.parse(await readFile(join(root, 'model-profiles.json'), 'utf8'));
  if (!config.profiles || typeof config.profiles !== 'object' || Array.isArray(config.profiles)) {
    throw new Error('model-profiles.json must contain a profiles object');
  }
  return config.profiles;
}

function profileTarget(profiles, profile) {
  const selected = profiles[profile];
  if (!selected || typeof selected !== 'object' || Array.isArray(selected)) {
    throw new Error(`Unknown model profile: ${profile}`);
  }
  return parseTarget(selected.target);
}

function validateLocation(global, project) {
  if (global === Boolean(project)) throw new Error('Choose exactly one of --global or --project <path>');
}

export async function installKit({ root = repositoryRoot, project, global = false, profile, run = runApm }) {
  validateLocation(global, project);
  const selectedTarget = profileTarget(await loadProfiles(root), profile);
  if (project && !(await stat(project)).isDirectory()) throw new Error(`Project is not a directory: ${project}`);
  await configureModels(root, profile);
  const installArgs = global
    ? ['install', '--global', root, '--target', selectedTarget]
    : ['install', root, '--target', selectedTarget];
  await run(installArgs, project);
  await run(global ? ['compile', '--global'] : ['compile', '--target', selectedTarget], project);
  return selectedTarget;
}

export function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const flag = args[index];
    if (flag === '--global') options.global = true;
    else if (['--project', '--profile'].includes(flag)) {
      if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`${flag} requires a value`);
      options[flag.slice(2)] = args[++index];
    } else throw new Error(`Unknown option: ${flag}`);
  }
  if (options.project) options.project = resolve(options.project);
  return options;
}

export async function chooseProfile(profiles, input = process.stdin, output = process.stdout) {
  if (!input.isTTY) throw new Error('Use --profile <name> when input is not interactive');
  const names = Object.keys(profiles);
  const terminal = createInterface({ input, output });
  try {
    output.write('Which profile to use?\n');
    names.forEach((name, index) => output.write(`  ${index + 1}. ${name} (${profiles[name].target ?? 'target required'})\n`));
    const answer = (await terminal.question('Profile name or number: ')).trim();
    return names[Number(answer) - 1] ?? answer;
  } finally {
    terminal.close();
  }
}

export async function setup(args, { root = repositoryRoot, input = process.stdin, output = process.stdout, run = runApm } = {}) {
  const options = parseArgs(args);
  validateLocation(options.global ?? false, options.project);
  options.profile ??= await chooseProfile(await loadProfiles(root), input, output);
  const target = await installKit({ ...options, root, run });
  output.write(`Installed ${options.profile} profile for ${target}\n`);
  return target;
}

export async function runApm(args, cwd, command = process.platform === 'win32' ? 'apm.exe' : 'apm') {
  await new Promise((done, fail) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit' });
    child.on('error', fail);
    child.on('exit', (code, signal) => {
      if (code === 0) done();
      else fail(new Error(`apm ${args[0]} failed (${signal ?? `exit ${code}`})`));
    });
  });
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    await setup(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
