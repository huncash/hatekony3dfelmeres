import fs from 'node:fs';

const base = 'http://127.0.0.1:8000';
const paths = [
  '/',
  '/geptelepites-elokeszites',
  '/csarnok-atalakitas',
  '/gepeszeti-ter-rekonstrukcio',
  '/folyamat',
  '/minta-anyagok',
  '/arak',
  '/gyik',
  '/kapcsolat',
  '/adatvedelem',
  '/impresszum',
  '/cikkek',
  '/cikkek/meglevo-allapotfelmeres-geptelepites-elott',
  '/cikkek/ipari-terepi-felmeres-menete',
  '/cikkek/adatok-geptelepitesi-felmereshez',
  '/cikkek/helyszini-bizonytalansag-csokkentese',
  '/cikkek/mikor-erdemes-kiszervezni-a-terepi-felmerest',
  '/cikkek/ipari-pontfelho-minosegellenorzese',
  '/robots.txt',
  '/sitemap.xml',
  '/healthz',
  '/nincs-ilyen',
  '/admin',
  '/admin/belepes',
];

let failed = 0;
for (const pathname of paths) {
  const res = await fetch(base + pathname, { redirect: 'manual' });
  const text = await res.text();
  const ok = pathname === '/nincs-ilyen'
    ? res.status === 404
    : pathname === '/admin'
      ? res.status === 302
      : res.status === 200;
  if (!ok) {
    failed += 1;
    console.log('FAIL', res.status, pathname);
  }
  if (pathname === '/' && !text.includes('Meglévő terek felmérése géptelepítéshez és átépítéshez')) {
    failed += 1;
    console.log('FAIL h1');
  }
  if (pathname === '/' && !text.includes('Az üzemi működéshez igazított terepi felmérés, egyeztetett ütemezéssel.')) {
    failed += 1;
    console.log('FAIL lede');
  }
  if (pathname === '/sitemap.xml' && !text.includes('https://hatekony3dfelmeres.hu/folyamat')) {
    failed += 1;
    console.log('FAIL sitemap');
  }
}

const home = await fetch(`${base}/`);
const html = await home.text();
const token = html.match(/name="form_token" value="([^"]+)"/)[1];
const body = new URLSearchParams({
  form_token: token,
  return_to: '/',
  szandek: 'feladat',
  company_name: 'Próbaüzem Kft.',
  contact_name: 'Teszt Elek',
  email: 'teszt@proba-uzem.hu',
  phone: '+36 30 111 2233',
  industry: 'logisztika',
  project_type: 'csarnok',
  location: 'Székesfehérvár, 1. csarnok',
  schedule: '2027 első negyedév',
  access_window: 'éjszakai műszak',
  coordinate_system: 'nincs',
  accuracy_need: 'feladat',
  file_size: 'kozepes',
  note: 'Polcsor csere a dokkok mellett.',
  gdpr: 'igen',
  company_website: '',
});
body.append('requested_output', 'pontfelho');
body.append('requested_output', 'terepti');
const post = await fetch(`${base}/projektigeny`, {
  method: 'POST',
  headers: { origin: base, 'content-type': 'application/x-www-form-urlencoded' },
  body,
  redirect: 'manual',
});
console.log('post', post.status, post.headers.get('location'));
if (post.status !== 303) failed += 1;

const env = fs.readFileSync('.env', 'utf8');
const admin = env.match(/ADMIN_TOKEN=(.*)/)[1].trim();
const login = await fetch(`${base}/admin/belepes`, {
  method: 'POST',
  headers: { origin: base, 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ token: admin }),
  redirect: 'manual',
});
const cookie = (login.headers.get('set-cookie') || '').split(';')[0];
console.log('login', login.status, cookie.startsWith('h3df_admin='));
if (login.status !== 302) failed += 1;
const list = await fetch(`${base}/admin`, { headers: { cookie } });
const listHtml = await list.text();
console.log('admin', list.status, listHtml.includes('Próbaüzem Kft.'));
if (!listHtml.includes('Próbaüzem Kft.')) failed += 1;
const csvRes = await fetch(`${base}/admin/export.csv`, { headers: { cookie } });
const csv = await csvRes.text();
console.log('csv', csvRes.status, csv.includes('Próbaüzem Kft.'), csv.includes('beküldés időpontja'));
if (!csv.includes('campaign/UTM') || !csv.includes('pontossági igény')) failed += 1;
const outbox = fs.readdirSync('data/outbox').filter((name) => name.endsWith('.txt'));
console.log('outbox', outbox.length > 0);
if (!outbox.length) failed += 1;
console.log('failed', failed);
process.exit(failed ? 1 : 0);
