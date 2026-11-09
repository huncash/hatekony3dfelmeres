import { execFileSync } from 'node:child_process';

function windowsListeners(port) {
  const out = execFileSync('netstat', ['-ano', '-p', 'tcp'], { encoding: 'utf8' });
  const rows = [];
  for (const line of out.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 5 || parts[0].toUpperCase() !== 'TCP') continue;
    const state = parts[3].toUpperCase();
    if (state !== 'LISTENING' && state !== 'FIGYEL') continue;
    const local = parts[1];
    const colon = local.lastIndexOf(':');
    if (colon === -1 || local.slice(colon + 1) !== String(port)) continue;
    const pid = parts[4];
    let image = '';
    try {
      image = execFileSync('tasklist', ['/FI', `PID eq ${pid}`, '/FO', 'CSV', '/NH'], { encoding: 'utf8' }).trim();
    } catch {
      image = '';
    }
    rows.push({ local, pid, image, detail: `${local} PID ${pid} ${image}`.trim() });
  }
  return rows;
}

function unixListeners(port) {
  try {
    const out = execFileSync('ss', ['-ltnp', `sport = :${port}`], { encoding: 'utf8' });
    return out.split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('State') && line.includes(`:${port}`))
      .map((detail) => ({ detail }));
  } catch {
    const out = execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN'], { encoding: 'utf8' });
    return out.split('\n').map((line) => line.trim()).filter(Boolean).slice(1).map((detail) => ({ detail }));
  }
}

export function listenersOn(port) {
  try {
    const rows = process.platform === 'win32' ? windowsListeners(port) : unixListeners(port);
    return { rows, error: '' };
  } catch (error) {
    return { rows: [], error: error.message };
  }
}

export function reportBusyPort(port, lookup = listenersOn(port)) {
  console.error(`A ${port} port foglalt. Az alkalmazás nem vált másik portra, és a foglaló folyamatot nem állítom le.`);
  if (lookup.error) console.error(`A foglaló folyamat kiolvasása nem sikerült: ${lookup.error}`);
  if (!lookup.rows.length && !lookup.error) {
    console.error('A port LISTENING állapotú folyamatát nem sikerült azonosítani. Ellenőrizze a netstat vagy ss kimenetét.');
  }
  for (const row of lookup.rows) console.error(`Foglalja: ${row.detail}`);
  console.error('Döntse el, mi történjen a foglaló folyamattal. Addig ez az alkalmazás nem indul.');
}
