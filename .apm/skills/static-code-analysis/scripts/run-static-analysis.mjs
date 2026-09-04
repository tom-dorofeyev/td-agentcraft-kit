#!/usr/bin/env node

import { existsSync, mkdtempSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const COMPLEXITY_LIMIT = '10';
const DUPLICATION_LIMIT = '10';

function usage() {
  console.log('Usage: node run-static-analysis.mjs [--report-dir <directory>] <file-or-directory> [...]');
}

function parseArguments(arguments_) {
  const targets = [];
  let reportDirectory;

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];

    if (argument === '--report-dir') {
      if (!arguments_[index + 1] || arguments_[index + 1].startsWith('-')) {
        return { error: '--report-dir requires a directory.', targets };
      }

      reportDirectory = arguments_[index + 1];
      index += 1;
      continue;
    }

    targets.push(argument);
  }

  return { reportDirectory, targets };
}

function run(command, arguments_) {
  const result = spawnSync(command, arguments_, { encoding: 'utf8' });

  if (result.error?.code === 'ENOENT') {
    console.error(`Missing required tool: ${command}`);
    return 2;
  }

  if (result.error) {
    console.error(result.error.message);
    return 2;
  }

  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  return result.status ?? 1;
}

function validateTargets(targets) {
  if (targets.length === 0) {
    return 'At least one analysis target is required.';
  }

  if (targets.some((target) => target.startsWith('-'))) {
    return 'Analysis targets cannot be options.';
  }

  return undefined;
}

function createReportDirectory(requestedReportDirectory) {
  const reportDirectory = requestedReportDirectory
    ? resolve(requestedReportDirectory)
    : mkdtempSync(join(tmpdir(), 'static-code-analysis-'));
  mkdirSync(reportDirectory, { recursive: true });
  return reportDirectory;
}

function runAnalyzers(reportDirectory, targets) {
  const complexityStatus = run('lizard', [
    '--warnings_only',
    '--CCN',
    COMPLEXITY_LIMIT,
    '--ignore_warnings',
    '-1',
    ...targets,
  ]);
  const duplicationStatus = run('jscpd', [
    '--threshold',
    DUPLICATION_LIMIT,
    '--reporters',
    'json',
    '--output',
    reportDirectory,
    ...targets,
  ]);

  return complexityStatus === 0 && duplicationStatus === 0 ? 0 : 1;
}

function main(arguments_) {
  if (arguments_.includes('--help') || arguments_.includes('-h')) {
    usage();
    return 0;
  }

  const { error, reportDirectory: requestedReportDirectory, targets } = parseArguments(arguments_);
  const targetError = validateTargets(targets);

  if (error || targetError) {
    console.error(error ?? targetError);
    usage();
    return 2;
  }

  const resolvedTargets = targets.map((target) => resolve(target));
  const missingTargets = resolvedTargets.filter((target) => !existsSync(target));

  if (missingTargets.length > 0) {
    console.error(`Analysis target does not exist: ${missingTargets.join(', ')}`);
    return 2;
  }

  const reportDirectory = createReportDirectory(requestedReportDirectory);

  console.log(`Static analysis reports: ${reportDirectory}`);
  console.log(`Duplication report: ${join(reportDirectory, 'jscpd-report.json')}`);
  return runAnalyzers(reportDirectory, resolvedTargets);
}

process.exitCode = main(process.argv.slice(2));
