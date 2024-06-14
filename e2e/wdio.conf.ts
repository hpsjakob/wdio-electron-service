import url from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

import type { Options } from '@wdio/types';
import type { PackageJson } from 'read-package-up';

import { getBinaryPath } from './utils.js';

const exampleDir = process.env.EXAMPLE_DIR || 'forge-esm';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'examples', exampleDir, 'package.json'), { encoding: 'utf-8' }),
) as PackageJson;

globalThis.packageJson = packageJson;
process.env.TEST = 'true';

export const config: Options.Testrunner = {
  services: ['electron'],
  capabilities: [
    {
      'browserName': 'electron',
      'wdio:electronServiceOptions': {
        appBinaryPath: getBinaryPath(exampleDir, path.join(__dirname, '..')),
        appArgs: ['foo', 'bar=baz'],
        restoreMocks: true,
      },
    } as WebdriverIO.Capabilities,
  ],
  waitforTimeout: 5000,
  connectionRetryCount: 10,
  connectionRetryTimeout: 30000,
  logLevel: 'debug',
  runner: 'local',
  outputDir: `wdio-logs-${exampleDir}`,
  specs: [`./*.spec.ts`],
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      files: true,
      project: path.join(__dirname, 'tsconfig.json'),
    },
  },
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 30000,
  },
};
