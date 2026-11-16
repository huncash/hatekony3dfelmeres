import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'generate-brand.js');
const run = spawnSync(process.execPath, [script], { stdio: 'inherit' });
process.exit(run.status ?? 1);
