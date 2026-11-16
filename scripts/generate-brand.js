import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(root, 'scripts', 'generate-brand.ps1');

const env = {
  ...process.env,
  H3D_OG_KICKER: 'Hatékony 3D felmérés',
  H3D_OG_TITLE: 'Ipari terek felmérése átépítéshez',
  H3D_ARTICLE_KICKER: 'Hatékony 3D felmérés',
  H3D_ARTICLE_TITLE: '3D felmérés működő üzemben',
  H3D_ARTICLE_NOTE: 'Hozzáférés és mérési időablak',
  H3D_PROFILE_TITLE: 'Ipari térfelmérés',
  H3D_PROFILE_NOTE: 'Sematikus ábra, nem referenciafotó.',
};

const run = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', script], {
  cwd: root,
  env,
  encoding: 'utf8',
});
if (run.status !== 0) {
  console.error(run.stdout);
  console.error(run.stderr);
  process.exit(run.status || 1);
}

function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  let offset = 6 + (entries.length * 16);
  const table = [];
  for (const entry of entries) {
    const row = Buffer.alloc(16);
    row[0] = entry.size >= 256 ? 0 : entry.size;
    row[1] = entry.size >= 256 ? 0 : entry.size;
    row.writeUInt16LE(1, 4);
    row.writeUInt16LE(32, 6);
    row.writeUInt32LE(entry.buffer.length, 8);
    row.writeUInt32LE(offset, 12);
    offset += entry.buffer.length;
    table.push(row);
  }
  return Buffer.concat([header, ...table, ...entries.map((entry) => entry.buffer)]);
}

const sizes = [16, 32, 48];
const built = ico(sizes.map((size) => ({
  size,
  buffer: fs.readFileSync(path.join(root, 'public', `favicon-${size}.png`)),
})));
fs.writeFileSync(path.join(root, 'public', 'favicon.ico'), built);
console.log('brand images kesz');
