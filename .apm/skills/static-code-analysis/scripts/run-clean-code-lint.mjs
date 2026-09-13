#!/usr/bin/env node

import { existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, extname, join, relative, resolve } from 'node:path';

const ESLINT_VERSION = '9.39.1';
const TYPESCRIPT_PARSER_VERSION = '8.50.0';
const TYPESCRIPT_VERSION = '5.9.3';
const JAVASCRIPT_EXTENSIONS = new Set(['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts', '.tsx']);
const TYPESCRIPT_EXTENSIONS = new Set(['.ts', '.mts', '.cts', '.tsx']);
const SKIPPED_DIRECTORIES = new Set(['.git', 'node_modules']);
const REMEDIATIONS = {
  'max-lines-per-function': 'Extract one cohesive block into a named function. Keep each function at 20 non-blank, non-comment lines or fewer.',
  'max-params': 'Replace positional parameters with an intention-revealing options object. Keep no more than three parameters.',
  'no-restricted-syntax': 'Replace the boolean literal with separate intention-revealing functions for each behavior. Do not add a boolean option.',
};
const RULES = {
  'max-lines-per-function': ['error', { max: 20, skipBlankLines: true, skipComments: true, IIFEs: true }],
  'max-params': ['error', 3],
  'no-restricted-syntax': [
    'error',
    {
      selector: 'CallExpression > Literal[value=true], CallExpression > Literal[value=false]',
      message: 'Do not pass boolean literals as arguments. Split the behavior into intention-revealing functions.',
    },
  ],
};

function usage() {
  console.log('Usage: node run-clean-code-lint.mjs <file-or-directory> [...]');
}

function collectJavaScriptFiles(target) {
  if (!existsSync(target)) {
    throw new Error(`Analysis target does not exist: ${target}`);
  }

  const resolvedTarget = realpathSync(target);

  if (statSync(resolvedTarget).isFile()) {
    return JAVASCRIPT_EXTENSIONS.has(extname(resolvedTarget)) ? [resolvedTarget] : [];
  }

  return readdirSync(resolvedTarget, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) {
      return [];
    }

    return collectJavaScriptFiles(join(resolvedTarget, entry.name));
  });
}

function commonDirectory(files) {
  let directory = dirname(files[0]);

  while (files.some((file) => relative(directory, file).startsWith('..'))) {
    directory = dirname(directory);
  }

  return directory;
}

function usesTypeScript(files) {
  return files.some((file) => TYPESCRIPT_EXTENSIONS.has(extname(file)));
}

function parserOptionArguments(parserPath) {
  return parserPath
    ? ['--parser', parserPath]
    : [];
}

function extensionArguments(files) {
  return usesTypeScript(files) ? ['--ext', '.ts', '--ext', '.mts', '--ext', '.cts', '--ext', '.tsx'] : [];
}

function printFindings(reportFile) {
  if (!existsSync(reportFile)) {
    return;
  }

  const report = JSON.parse(readFileSync(reportFile, 'utf8'));

  for (const file of report) {
    for (const finding of file.messages) {
      const remediation = REMEDIATIONS[finding.ruleId];

      if (remediation) {
        console.error(`CLEAN-CODE ERROR ${file.filePath}:${finding.line}:${finding.column} [${finding.ruleId}] ${finding.message}`);
        console.error(`Fix: ${remediation}`);
      }
    }
  }
}

function eslintArguments(reportFile, files, parserPath) {
  return [
    '--no-config-lookup', '--no-inline-config', '--no-ignore', '--format', 'json', '--output-file', reportFile, '--rule', JSON.stringify(RULES),
    ...parserOptionArguments(parserPath), ...extensionArguments(files), ...files,
  ];
}

function typeScriptEslint(files) {
  if (!usesTypeScript(files)) {
    return undefined;
  }

  const toolDirectory = realpathSync(mkdtempSync(join(tmpdir(), 'clean-code-typescript-eslint-')));
  const result = spawnSync(
    'npm',
    ['install', '--prefix', toolDirectory, '--no-save', '--ignore-scripts', '--package-lock=false', '--no-audit', '--no-fund', `eslint@${ESLINT_VERSION}`, `@typescript-eslint/parser@${TYPESCRIPT_PARSER_VERSION}`, `typescript@${TYPESCRIPT_VERSION}`],
    { encoding: 'utf8' },
  );

  if (result.status !== 0) {
    console.error(result.stderr || 'Unable to install the pinned TypeScript lint tools.');
    return null;
  }

  return {
    executable: join(toolDirectory, 'node_modules', '.bin', process.platform === 'win32' ? 'eslint.cmd' : 'eslint'),
    parserPath: join(toolDirectory, 'node_modules', '@typescript-eslint', 'parser', 'dist', 'index.js'),
  };
}

function eslintResult(files, reportFile, typeScriptTools) {
  const parserPath = typeScriptTools?.parserPath;
  const command = typeScriptTools?.executable ?? 'npx';
  const arguments_ = typeScriptTools
    ? eslintArguments(reportFile, files, parserPath)
    : ['--yes', '--package', `eslint@${ESLINT_VERSION}`, 'eslint', ...eslintArguments(reportFile, files)];

  return spawnSync(command, arguments_, { cwd: commonDirectory(files), encoding: 'utf8' });
}

function eslintFailure(result) {
  if (result.error?.code === 'ENOENT') {
    return 'Missing required tool: npx (install Node.js and npm).';
  }

  return result.error?.message;
}

function runEslint(files) {
  const reportFile = join(mkdtempSync(join(tmpdir(), 'clean-code-lint-')), 'eslint-report.json');
  const typeScriptTools = typeScriptEslint(files);

  if (typeScriptTools === null) {
    return 2;
  }

  const result = eslintResult(files, reportFile, typeScriptTools);
  const failure = eslintFailure(result);

  if (failure) {
    console.error(failure);
    return 2;
  }

  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  printFindings(reportFile);
  console.log(`Clean-code lint report: ${reportFile}`);
  return result.status ?? 1;
}

function lintTargets(targets) {
  try {
    const files = targets.flatMap((target) => collectJavaScriptFiles(resolve(target)));

    if (files.length === 0) {
      console.log('Clean-code lint skipped: no JavaScript files in the supplied targets.');
      return 0;
    }

    return runEslint(files);
  } catch (error) {
    console.error(error.message);
    return 2;
  }
}

function main(arguments_) {
  if (arguments_.includes('--help') || arguments_.includes('-h')) {
    usage();
    return 0;
  }

  if (arguments_.length === 0 || arguments_.some((argument) => argument.startsWith('-'))) {
    usage();
    return 2;
  }

  return lintTargets(arguments_);
}

process.exitCode = main(process.argv.slice(2));
