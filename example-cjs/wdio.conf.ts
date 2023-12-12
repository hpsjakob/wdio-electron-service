import path from 'node:path';
import fs from 'node:fs';
import type { PackageJson } from 'read-package-up';

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'package.json'), { encoding: 'utf-8' }),
) as PackageJson;

globalThis.packageJson = packageJson;
process.env.TEST = 'true';

exports.config = {
  services: ['electron'],
  capabilities: [
    {
      'browserName': 'electron',
      'wdio:electronServiceOptions': {
        appArgs: ['foo', 'bar=baz'],
      },
    } as WebdriverIO.Capabilities,
  ],
  waitforTimeout: 5000,
  connectionRetryCount: 10,
  connectionRetryTimeout: 30000,
  logLevel: 'debug',
  runner: 'local',
  outputDir: 'wdio-logs',
  specFileRetries: 4,
  specs: ['./e2e/*.spec.ts'],
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      esm: false,
      project: path.join(__dirname, 'tsconfig.json'),
    },
  },
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 30000,
  },
};
