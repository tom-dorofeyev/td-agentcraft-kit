import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { copyFile, mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough } from 'node:stream';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { chooseProfile, installKit, parseArgs, runApm, setup } from './install.mjs';

const execFileAsync = promisify(execFile);

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'kit-install-'));
  const project = join(root, 'project');
  await mkdir(join(root, '.apm', 'agents'), { recursive: true });
  await mkdir(project);
  await writeFile(join(root, '.apm', 'agents', 'builder.md'), '---\ndescription: Builder\n---\nBody\n');
  await writeFile(join(root, 'model-profiles.json'), JSON.stringify({ profiles: {
    default: { target: 'opencode,copilot', models: { builder: null } },
    fast: { target: 'opencode', models: { builder: 'provider/fast' } },
  } }));
  return { root, project };
}

test('selected profile is applied before installing and compiling its target', async () => {
  const { root, project } = await fixture();
  await writeFile(join(project, 'apm.yml'), 'targets: [opencode, copilot]\n');
  const calls = [];
  await installKit({ root, project, profile: 'fast', run: async (args, cwd) => {
    calls.push({ args, cwd, source: await readFile(join(root, '.apm', 'agents', 'builder.md'), 'utf8') });
  } });
  assert.deepEqual(calls.map(({ args }) => args), [
    ['install', root, '--target', 'opencode'],
    ['compile', '--target', 'opencode'],
  ]);
  assert.ok(calls.every(({ cwd, source }) => cwd === project && source.includes('model: "provider/fast"')));
});

test('invalid profile fails without changing source or invoking APM', async () => {
  const { root, project } = await fixture();
  let calls = 0;
  await assert.rejects(installKit({ root, project, profile: 'missing', run: async () => { calls += 1; } }), /Unknown model profile/);
  assert.equal(calls, 0);
  assert.doesNotMatch(await readFile(join(root, '.apm', 'agents', 'builder.md'), 'utf8'), /model:/);
});

test('invalid target fails before changing source or invoking APM', async () => {
  const { root, project } = await fixture();
  const profiles = JSON.parse(await readFile(join(root, 'model-profiles.json'), 'utf8'));
  profiles.profiles.fast.target = 'opencode,copilot,other';
  await writeFile(join(root, 'model-profiles.json'), JSON.stringify(profiles));
  let calls = 0;
  await assert.rejects(installKit({ root, project, profile: 'fast', run: async () => { calls += 1; } }), /Invalid target/);
  assert.equal(calls, 0);
  assert.doesNotMatch(await readFile(join(root, '.apm', 'agents', 'builder.md'), 'utf8'), /model:/);
});

test('noninteractive CLI requests an explicit profile', async () => {
  await assert.rejects(execFileAsync(process.execPath, [fileURLToPath(new URL('./install.mjs', import.meta.url)), '--global']),
    /Use --profile <name> when input is not interactive/);
});

test('CLI runs from a clone reached through a symlinked path', async () => {
  const { root } = await fixture();
  await mkdir(join(root, 'scripts'));
  for (const file of ['install.mjs', 'configure-models.mjs']) {
    await copyFile(fileURLToPath(new URL(file, import.meta.url)), join(root, 'scripts', file));
  }
  await assert.rejects(
    execFileAsync(process.execPath, [join(root, 'scripts', 'install.mjs'), '--project', join(root, 'missing'), '--profile', 'default']),
    /ENOENT/,
  );
});

test('APM failure stops before compile', async () => {
  const { root, project } = await fixture();
  const calls = [];
  await assert.rejects(installKit({ root, project, profile: 'default', run: async (args) => {
    calls.push(args[0]);
    throw new Error('install failed');
  } }), /install failed/);
  assert.deepEqual(calls, ['install']);
});

test('global install passes global flags and compiles globally', async () => {
  const { root } = await fixture();
  const calls = [];
  await installKit({ root, global: true, profile: 'fast', run: async (args) => { calls.push(args); } });
  assert.deepEqual(calls, [
    ['install', '--global', root, '--target', 'opencode'],
    ['compile', '--global'],
  ]);
});

test('interactive setup asks for a profile and installs the selected target', async () => {
  const { root, project } = await fixture();
  const input = new PassThrough();
  const output = new PassThrough();
  input.isTTY = true;
  let transcript = '';
  output.on('data', (chunk) => {
    transcript += chunk;
    if (transcript.includes('Profile name or number: ')) input.write('2\n');
  });
  const calls = [];

  const target = await setup(['--project', project], {
    root, input, output, run: async (args) => { calls.push(args); },
  });

  assert.equal(target, 'opencode');
  assert.match(transcript, /Which profile to use\?/);
  assert.match(transcript, /Installed fast profile for opencode/);
  assert.deepEqual(calls.map((args) => args[0]), ['install', 'compile']);
  assert.match(await readFile(join(root, '.apm', 'agents', 'builder.md'), 'utf8'), /provider\/fast/);
});

test('profile may be selected by name without prompting', async () => {
  const { root } = await fixture();
  const output = new PassThrough();
  let transcript = '';
  output.on('data', (chunk) => { transcript += chunk; });
  const calls = [];

  await setup(['--global', '--profile', 'default'], {
    root, output, run: async (args) => { calls.push(args); },
  });

  assert.match(transcript, /Installed default profile for opencode,copilot/);
  assert.deepEqual(calls[0], ['install', '--global', root, '--target', 'opencode,copilot']);
});

test('invalid arguments fail before prompting or invoking APM', async () => {
  const { root, project } = await fixture();
  let calls = 0;
  const run = async () => { calls += 1; };

  await assert.rejects(setup(['--global', '--project', project], { root, run }), /exactly one/);
  await assert.rejects(setup(['--profile'], { root, run }), /requires a value/);
  await assert.rejects(setup(['--target', 'copilot'], { root, run }), /Unknown option/);
  assert.equal(calls, 0);
});

test('profile chooser accepts a name and rejects noninteractive input', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  input.isTTY = true;
  output.on('data', (chunk) => {
    if (chunk.toString().includes('Profile name or number: ')) input.write('fast\n');
  });

  assert.equal(await chooseProfile({ default: { target: 'copilot' }, fast: { target: 'opencode' } }, input, output), 'fast');
  await assert.rejects(chooseProfile({}, new PassThrough(), output), /Use --profile/);
});

test('malformed profile configuration stops before changing agents', async () => {
  const { root, project } = await fixture();
  await writeFile(join(root, 'model-profiles.json'), JSON.stringify({ profiles: [] }));
  let calls = 0;

  await assert.rejects(installKit({ root, project, profile: 'fast', run: async () => { calls += 1; } }), /profiles object/);
  assert.equal(calls, 0);
  assert.doesNotMatch(await readFile(join(root, '.apm', 'agents', 'builder.md'), 'utf8'), /model:/);
});

test('project path must be a directory', async () => {
  const { root } = await fixture();
  await assert.rejects(installKit({ root, project: join(root, 'model-profiles.json'), profile: 'fast' }), /Project is not a directory/);
});

test('argument parser resolves project paths and rejects missing values', () => {
  assert.equal(parseArgs(['--project', '.']).project, process.cwd());
  assert.throws(() => parseArgs(['--profile', '--global']), /requires a value/);
});

test('APM process failures propagate to setup', async () => {
  await runApm(['-e', 'process.exit(0)'], process.cwd(), process.execPath);
  await assert.rejects(runApm(['-e', 'process.exit(7)'], process.cwd(), process.execPath), /apm -e failed \(exit 7\)/);
  await assert.rejects(runApm(['install'], process.cwd(), join(process.cwd(), 'missing-apm')), /ENOENT/);
});
