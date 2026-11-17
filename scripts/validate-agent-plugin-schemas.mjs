// Validates root plugin.json and mcp.json against the sha256-pinned Agent Plugins 1.0.0 schemas.
// CI and the Ops verifier policy run this file.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
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
