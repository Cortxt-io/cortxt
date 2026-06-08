// Generator for @cortxt/cns-schema — emits index.js from the canonical enum source.
// Run: node generate.mjs   (or: pnpm --filter @cortxt/cns-schema generate)
//
// Single source of truth: Project-CNS/schemas/enums.json — also consumed by the
// Python backend (scripts/validator.py). Do NOT hand-edit index.js.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// Pre-merge (two repos): canonical file lives in the sibling Project-CNS repo.
// Post-merge (one repo, Project-CNS as root): change to '../../schemas/enums.json'.
const ENUMS_PATH = resolve(here, '../../../Project-CNS/schemas/enums.json');

const enums = JSON.parse(readFileSync(ENUMS_PATH, 'utf8'));

// Map canonical keys → exported names (NODE_STAGES kept for existing importers).
const EXPORTS = [
  ['STATUSES', enums.statuses],
  ['KINDS', enums.kinds],
  ['NODE_STAGES', enums.stages],
  ['MVP_STAGES', enums.mvp_stages],
  ['RISK_CATEGORIES', enums.risk_categories],
];

const body = EXPORTS.map(
  ([name, vals]) => `export const ${name} = ${JSON.stringify(vals)};`
).join('\n');

const out = `// GENERATED — do not edit. Run \`node generate.mjs\` to regenerate.
// Source of truth: Project-CNS/schemas/enums.json (also read by scripts/validator.py).
// Canonical enum values for the CNS node model.

${body}
`;

writeFileSync(resolve(here, 'index.js'), out);
console.log('Wrote index.js from', ENUMS_PATH);
