// Copy checks for the plugin's own texts, driven by scripts/copy-policy.json: lines the skills must keep, and
// phrasings no plugin text may use. It first proves the rules against the policy's fixtures (every mustFlag line
// is flagged, every mustPass line passes), then checks the texts. It reports every problem, then exits 1.
// This rejects known phrasings only; the LLM-graded evals and review are the enforcement of record. CI runs this file.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const policy = JSON.parse(readFileSync(join(root, 'scripts/copy-policy.json'), 'utf8'));
const rules = policy.forbidden.map(({ test, allow, reason }) => ({
  test: new RegExp(test, 'i'),
  allow: allow ? new RegExp(allow, 'gi') : null,
  reason,
}));
const problems = [];
const read = (file) => {
  if (existsSync(join(root, file))) return readFileSync(join(root, file), 'utf8');
  problems.push(`${file} is missing`);
  return '';
};

const violation = (line) => {
  const text = line.replace(/\s+/g, ' ');
  // Remove only the allowed spans, then test what remains, so an allowed phrase cannot shield the rest of the line.
  return rules.find((rule) => rule.test.test(rule.allow ? text.replace(rule.allow, ' ') : text));
};

for (const line of policy.fixtures.mustFlag) {
  if (!violation(line)) problems.push(`policy fixture should be flagged but passes: ${line}`);
}
for (const line of policy.fixtures.mustPass) {
  const rule = violation(line);
  if (rule) problems.push(`policy fixture should pass but is flagged (${rule.reason}): ${line}`);
}

const texts = policy.texts.flatMap((pattern) => {
  if (!pattern.includes('*')) return [pattern];
  const [dir, file] = pattern.split('/*/');
  return readdirSync(join(root, dir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(root, dir, entry.name, file)))
    .map((entry) => `${dir}/${entry.name}/${file}`);
});
for (const file of texts) {
  read(file).split('\n').forEach((line, i) => {
    const rule = violation(line);
    if (rule) problems.push(`${file}:${i + 1} ${rule.reason}: ${line.trim()}`);
  });
}

for (const [file, lines] of Object.entries(policy.required)) {
  const text = read(file);
  for (const line of lines) {
    if (!text.includes(line)) problems.push(`${file} is missing the required line: ${line}`);
  }
}

if (problems.length > 0) {
  console.error([...new Set(problems)].join('\n'));
  process.exit(1);
}
console.log(`Copy policy: ${policy.fixtures.mustFlag.length} must-flag and ${policy.fixtures.mustPass.length} must-pass fixtures hold; ${texts.length} texts clean; required lines present`);
