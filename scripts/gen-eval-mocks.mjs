// Regenerates the eval mocks under evals/ from the PUBLISHED @varity-labs/mcp version that .mcp.json pins.
// It packs that version from npm, installs its runtime dependencies, runs its dist/index.js over stdio against
// a local stub of the Varity API (VARITY_GATEWAY_URL), and writes each tool's answer to the mock file an eval reads.
// The stub only supplies the API data each case is written for; every message is the server's own text.
// Two machine-dependent values are fixed so the output is stable: the Node.js and npm versions the doctor reports,
// and the HTTP probe latency against the stub.
// Usage: node scripts/gen-eval-mocks.mjs   (CI then fails on `git diff --exit-code evals`)
import { execFileSync, spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const pin = JSON.parse(readFileSync(join(root, '.mcp.json'), 'utf8')).mcpServers.varity.args.find((arg) => arg.startsWith('@varity-labs/mcp@'));
const FIXED = { node: 'v22.22.3', npm: '10.9.8' };

const work = mkdtempSync(join(tmpdir(), 'varity-eval-mocks-'));
const npm = (args, cwd) => execFileSync('npm', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
const tarball = npm(['pack', pin, '--silent'], work).trim().split('\n').pop();
execFileSync('tar', ['-xzf', tarball], { cwd: work });
const pkg = join(work, 'package');
npm(['install', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund', '--silent'], pkg);
console.log(`packed ${pin} -> ${tarball}`);

let phase = 'deploy'; // 'deploy': runs answer deploying; 'status': runs answer their terminal state
const runs = {
  run_eval_001: { public_status: 'failed', outcome: { classification: 'expected_rejection', stage: 'build', code: 'configuration_rejected', action_code: 'check_configuration', diagnostic_code: null, terminal_at: '2026-11-17T01:42:10Z' } },
  run_eval_002: { public_status: 'live', outcome: null },
};
const deployments = {
  'todo-api': { id: 'dep_eval_001', app_name: 'todo-api', appName: 'todo-api', runtime: 'dynamic', status: 'failed', createdAt: '2026-11-17T01:40:00Z', run_id: 'run_eval_001', outcome: runs.run_eval_001.outcome,
    billing: { state: null, currency: 'USD', accrued_this_month_usd: 'unavailable', billing_basis: 'unavailable', active_seconds_this_month: null } },
  'notes-app': { id: 'dep_eval_002', app_name: 'notes-app', appName: 'notes-app', runtime: 'dynamic', status: 'live', url: 'PROBE', createdAt: '2026-11-17T02:10:00Z', run_id: 'run_eval_002', outcome: null,
    billing: { state: 'active', currency: 'USD', accrued_this_month_usd: '0.02', billing_basis: 'reserved_monthly_max_prorated', active_seconds_this_month: 240 } },
};

let gateway = '';
const stub = createServer((req, res) => {
  let body = '';
  req.on('data', (c) => (body += c));
  req.on('end', () => {
    const send = (status, json) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(json)); };
    const parsed = body && req.headers['content-type'] === 'application/json' ? JSON.parse(body) : {};
    const url = req.url;
    let m;
    if (url === '/probe') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end('ok'); }
    // Browser sign-in is not released: no authorization server, so varity_login answers SIGN_IN_UNAVAILABLE.
    if (url.startsWith('/.well-known/') || url.startsWith('/api/oauth/')) return send(404, { error: 'not_found' });
    // Folder upload is not released: no upload route, so a folder deploy answers UPLOAD_UNAVAILABLE.
    if (req.method === 'POST' && url === '/api/deployments/sources') return send(404, { code: 'uploads_unavailable', message: 'Not found' });
    if (req.method === 'POST' && url === '/api/deployments') {
      if (String(parsed.repo_url).includes('private-crm')) return send(422, { code: 'source_repository_unreadable', message: 'Repository is private or does not exist.' });
      const n = { 'todo-api': '001', 'notes-app': '002' }[parsed.app_name] ?? '009';
      return send(202, { id: `dep_eval_${n}`, app_name: parsed.app_name, run_id: `run_eval_${n}` });
    }
    if (req.method === 'GET' && url.match(/^\/api\/deployments\/runs\/[^/]+\/logs$/)) {
      return send(200, { stage: 'build', complete: true, lines: ['> todo-api@1.0.0 build', '> tsc -p tsconfig.json', "src/server.ts(14,7): error TS2322: Type 'string' is not assignable to type 'number'.", 'Build failed with exit code 2'] });
    }
    if (req.method === 'GET' && (m = url.match(/^\/api\/deployments\/runs\/([^/]+)$/))) {
      return send(200, phase === 'status' && runs[m[1]] ? { run_id: m[1], ...runs[m[1]] } : { run_id: m[1], public_status: 'deploying', outcome: null });
    }
    if (req.method === 'GET' && url === '/api/deployments') return send(200, { deployments: [] });
    if (req.method === 'PATCH' && url.match(/^\/api\/deployments\/[^/]+\/env$/)) {
      return send(202, { status: 'redeploying', run_id: 'run_eval_003', env: { count: Object.keys(parsed.env ?? {}).length } });
    }
    if (req.method === 'GET' && (m = url.match(/^\/api\/deployments\/([^/?]+)$/))) {
      const d = deployments[decodeURIComponent(m[1])];
      if (!d) return send(404, { code: 'not_found', message: 'Deployment not found.' });
      return send(200, { deployment: { ...d, ...(d.url ? { url: `${gateway}/probe` } : {}) } });
    }
    if (req.method === 'GET' && url.startsWith('/api/pricing?profile=web-app')) {
      return send(200, { profile: 'web-app', currency: 'USD', monthly_max_usd: 9, billing_model: 'reserved_monthly_max_prorated' });
    }
    if (req.method === 'GET' && url === '/api/machines') return send(200, { machines: [], inventory_status: 'complete' });
    if (req.method === 'GET' && url === '/api/deployment-profiles?workload=cpu&execution_class=cpu_virtual_machine') {
      return send(200, { profiles: [{ id: 'mp-cpu-small', name: 'CPU small', vcpu: 2, memory_gb: 4, disk_gb: 40, hourly_usd: 0.05, os_images: [{ id: 'os-ubuntu-24-04', name: 'Ubuntu 24.04' }], default_os_image: 'os-ubuntu-24-04' }] });
    }
    if (req.method === 'POST' && url === '/api/pricing/machine-quote') {
      return send(200, { quote_token: 'qt_eval', hourly_usd: 0.05, authorization_usd: 1.2, valid_until: '2027-11-17T03:00:00Z' });
    }
    if (req.method === 'POST' && url === '/api/machines') return send(202, { machine_id: 'vm_eval_001', name: parsed.name, status: 'provisioning' });
    return send(404, { code: 'not_found', message: `stub has no ${req.method} ${url}` });
  });
});
await new Promise((r) => stub.listen(0, '127.0.0.1', r));
gateway = `http://127.0.0.1:${stub.address().port}`;

const home = mkdtempSync(join(work, 'home-'));
const folder = mkdtempSync(join(work, 'my-site-'));
writeFileSync(join(folder, 'index.html'), '<h1>hi</h1>\n');
const envProject = mkdtempSync(join(work, 'env-'));
writeFileSync(join(envProject, '.env'), 'OPENAI_API_KEY=sk-evalsecret-7f3a9c\n');
// node and npm only on PATH; no varitykit, and gh (if present) is signed out in the throwaway HOME.
const PATH = `${dirname(process.execPath)}:/usr/bin:/bin`;

function normalize(text) {
  return text
    .replaceAll(`${gateway}/probe`, 'https://notes-app.varity.app')
    .replace(/"latency_ms": \d+/g, '"latency_ms": 1')
    .replace(/Node\.js v\d+\.\d+\.\d+/g, `Node.js ${FIXED.node}`)
    .replace(/npm \d+\.\d+\.\d+ detected/g, `npm ${FIXED.npm} detected`)
    .replace(/("name": "Node\.js",\s*"status": "\w+",\s*"version": )"[^"]+"/, `$1"${FIXED.node}"`)
    .replace(/("name": "npm",\s*"status": "\w+",\s*"version": )"[^"]+"/, `$1"${FIXED.npm}"`);
}

function session(env) {
  const child = spawn(process.execPath, [join(pkg, 'dist/index.js')], {
    cwd: home,
    env: { PATH, HOME: home, VARITY_GATEWAY_URL: gateway, ...env },
    stdio: ['pipe', 'pipe', 'ignore'],
  });
  let buf = '';
  const waiters = new Map();
  child.stdout.on('data', (d) => {
    buf += d;
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i); buf = buf.slice(i + 1);
      if (!line.trim()) continue;
      const msg = JSON.parse(line);
      if (msg.method === 'roots/list') {
        child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { roots: [{ uri: `file://${envProject}`, name: 'project' }] } }) + '\n');
        continue;
      }
      if (msg.id != null && waiters.has(msg.id)) { waiters.get(msg.id)(msg); waiters.delete(msg.id); }
    }
  });
  let id = 0;
  const call = (method, params) => new Promise((resolve) => {
    const n = ++id; waiters.set(n, resolve);
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: n, method, params }) + '\n');
  });
  return {
    async init() {
      await call('initialize', { protocolVersion: '2025-06-18', capabilities: { roots: {} }, clientInfo: { name: 'eval-mock-gen', version: '1' } });
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
    },
    call,
    tool: async (name, args) => {
      const r = await call('tools/call', { name, arguments: args });
      if (!r.result) throw new Error(`${name}: ${JSON.stringify(r.error)}`);
      return normalize(r.result.content[0].text);
    },
    close: () => child.kill(),
  };
}
const write = (file, text) => { mkdirSync(dirname(join(root, file)), { recursive: true }); writeFileSync(join(root, file), text + '\n'); };

const s = session({ VARITY_DEPLOY_KEY: 'eval-dummy-not-a-key' });
await s.init();
writeFileSync(join(root, 'evals/mocks/varity/_tools.json'), JSON.stringify((await s.call('tools/list', {})).result, null, 1));
write('evals/mocks/varity/varity_deploy.md', await s.tool('varity_deploy', { repo_url: 'https://github.com/acme/todo-api' }));
write('evals/live-app/mocks/varity/varity_deploy.md', await s.tool('varity_deploy', { repo_url: 'https://github.com/acme/notes-app', app_name: 'notes-app' }));
write('evals/private-repo/mocks/varity/varity_deploy.md', await s.tool('varity_deploy', { repo_url: 'https://github.com/acme/private-crm', app_name: 'private-crm' }));
write('evals/folder-chat-and-build/mocks/varity/varity_deploy.md', await s.tool('varity_deploy', { path: folder, app_name: 'my-site' }));
write('evals/mocks/varity/varity_cost_calculator.md', await s.tool('varity_cost_calculator', { app_profile: 'web-app' }));
const setEnv = await s.tool('varity_set_env', { deployment: 'notes-app', path: envProject, keys: ['OPENAI_API_KEY'], confirm: true });
write('evals/env-secret/mocks/varity/varity_set_env.md', setEnv);
write('evals/env-secret-hold-consent/mocks/varity/varity_set_env.md', setEnv);
write('evals/vm-created/mocks/varity/varity_machines_list.md', await s.tool('varity_machines_list', { include_profiles: true }));
write('evals/vm-created/mocks/varity/varity_machines_create.md', await s.tool('varity_machines_create', { name: 'dev-box', profile_id: 'mp-cpu-small', os_image: 'os-ubuntu-24-04', ssh_public_key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEvalOnlyKeyForTestsxxxxxxxxxxxxxxxxxxxxxx me@laptop' }));
write('evals/mocks/varity/varity_doctor.md', await s.tool('varity_doctor', {}));
phase = 'status';
write('evals/mocks/varity/varity_deploy_status.md', await s.tool('varity_deploy_status', { deployment_id: 'todo-api' }));
write('evals/live-app/mocks/varity/varity_deploy_status.md', await s.tool('varity_deploy_status', { deployment_id: 'notes-app' }));
s.close();

const noKey = session({});
await noKey.init();
write('evals/connect/mocks/varity/varity_doctor.md', await noKey.tool('varity_doctor', {}));
write('evals/connect/mocks/varity/varity_login.md', await noKey.tool('varity_login', {}));
noKey.close();
stub.close();
rmSync(work, { recursive: true, force: true });
console.log(`wrote eval mocks from ${pin}`);
