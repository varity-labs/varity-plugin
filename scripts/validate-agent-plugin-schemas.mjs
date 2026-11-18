// Validates root plugin.json and mcp.json against the sha256-pinned Agent Plugins 1.0.0 schemas,
// and checks that every MCP config pins the same server and every manifest has the same version.
// Copy rules live in scripts/validate-copy.mjs. CI and the Ops verifier policy run this file.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const schemas = [
  { data: 'plugin.json', file: 'plugin.schema.json', sha256: '0a4aad95ce337878ad38802ebf0daa3fde76abe3f65400c86bcbb1ec0b3ab883' },
  { data: 'mcp.json', file: 'mcp.schema.json', sha256: '6539175bfcdf43085855183e86da40ea94b166547a72b47ae9a0a390516d3acb' },
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: root, stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    console.error(`${command} ${args.join(' ')} exited ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

const readJson = (file) => JSON.parse(readFileSync(join(root, file), 'utf8'));

const exactPin = /^@varity-labs\/mcp@\d+\.\d+\.\d+$/;
const pins = {};
for (const file of ['.mcp.json', 'mcp.json', 'gemini-extension.json']) {
  pins[file] = readJson(file).mcpServers?.varity?.args?.find((arg) => arg.startsWith('@varity-labs/mcp'));
}
for (const file of ['README.md', 'skills/deploy-with-varity/SKILL.md']) {
  const found = readFileSync(join(root, file), 'utf8').match(/@varity-labs\/mcp(@[^\s`"',)]*)?/g) ?? [];
  pins[file] = found.length > 0 && new Set(found).size === 1 ? found[0] : found.join(' | ') || undefined;
}
if (!Object.values(pins).every((pin) => exactPin.test(pin ?? '')) || new Set(Object.values(pins)).size !== 1) {
  console.error('MCP server pins differ or are not an exact version:', pins);
  process.exit(1);
}
const versions = Object.fromEntries(
  ['plugin.json', '.claude-plugin/plugin.json', '.cursor-plugin/plugin.json', 'gemini-extension.json'].map((file) => [file, readJson(file).version]),
);
if (!Object.values(versions).every((v) => /^\d+\.\d+\.\d+$/.test(v ?? '')) || new Set(Object.values(versions)).size !== 1) {
  console.error('Manifest versions differ or are not semver:', versions);
  process.exit(1);
}
// Kiro activates a power from the root plugin.json keywords.
if (!(readJson('plugin.json').keywords?.length > 0)) {
  console.error('plugin.json has no keywords');
  process.exit(1);
}
console.log(`MCP pin ${pins['mcp.json']} and manifest version ${versions['plugin.json']} agree across all files`);
const dir = mkdtempSync(join(tmpdir(), 'agent-plugin-schemas-'));
try {
  for (const { file } of schemas) {
    run('curl', ['-fsSL', '-o', join(dir, file), `https://agent-plugins.org/schemas/1.0.0/${file}`]);
  }
  const sums = schemas.map(({ file, sha256 }) => `${sha256}  ${file}\n`).join('');
  run('sha256sum', ['-c', '-'], { cwd: dir, input: sums, stdio: ['pipe', 'inherit', 'inherit'] });
  for (const { data, file } of schemas) {
    run('npx', ['-y', 'ajv-cli@5.0.0', 'validate', '--spec=draft2020', '--strict=true', '-s', join(dir, file), '-d', data]);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
