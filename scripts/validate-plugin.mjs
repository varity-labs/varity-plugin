// Claude plugin directory validation, pinned. CI and the Ops verifier policy run this file.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const result = spawnSync(
  'npx',
  ['-y', '@anthropic-ai/claude-code@2.1.326', 'plugin', 'validate', '--strict', '--profile', 'directory', '.'],
  { cwd: root, stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
