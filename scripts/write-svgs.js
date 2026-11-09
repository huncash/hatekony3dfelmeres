import fs from 'node:fs';

const a = '\u00e1';
const e = '\u00e9';
const i = '\u00ed';
const o = '\u00f3';
const oo = '\u0151';
const u = '\u00fa';

const files = {
  'public/images/csarnok-vazlat.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 560" role="img">
  <title>Sematikus csarnokalaprajz</title>
  <rect width="720" height="560" fill="#faf8f4"/>
  <g fill="none" stroke="#d5d0c6" stroke-width="1">
    <path d="M40 40H680M40 120H680M40 200H680M40 280H680M40 360H680M40 440H680M40 520H680"/>
    <path d="M40 40V520M120 40V520M200 40V520M280 40V520M360 40V520M440 40V520M520 40V520M600 40V520M680 40V520"/>
  </g>
  <rect x="48" y="48" width="624" height="464" fill="none" stroke="#1e3d38" stroke-width="3"/>
  <g fill="#1e3d38">
    <rect x="112" y="112" width="16" height="16"/>
    <rect x="272" y="112" width="16" height="16"/>
    <rect x="432" y="112" width="16" height="16"/>
    <rect x="592" y="112" width="16" height="16"/>
    <rect x="112" y="432" width="16" height="16"/>
    <rect x="272" y="432" width="16" height="16"/>
    <rect x="432" y="432" width="16" height="16"/>
    <rect x="592" y="432" width="16" height="16"/>
  </g>
  <rect x="300" y="250" width="210" height="120" fill="#f6e4d8" stroke="#8f3d16" stroke-width="2"/>
  <path d="M70 500 H150 V390 H300" fill="none" stroke="#8f3d16" stroke-width="2" stroke-dasharray="7 5"/>
  <rect x="500" y="70" width="150" height="90" fill="none" stroke="#1e3d38" stroke-width="2"/>
  <text x="318" y="316" fill="#1a2420" font-family="Segoe UI, sans-serif" font-size="16">fogad${oo} z${oo}na</text>
  <text x="78" y="486" fill="#8f3d16" font-family="Segoe UI, sans-serif" font-size="14">bejut${a}si ${u}t</text>
  <text x="518" y="122" fill="#1e3d38" font-family="Segoe UI, sans-serif" font-size="14">g${e}p${e}szet</text>
  <text x="70" y="78" fill="#1e3d38" font-family="Segoe UI, sans-serif" font-size="13">kapu</text>
</svg>
`,
  'public/images/kimenet-pontfelho.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <title>Pontfelh${oo} szeml${e}ltet${e}s</title>
  <rect width="640" height="400" fill="#faf8f4"/>
  <g fill="#1e3d38">
    <circle cx="120" cy="250" r="3"/><circle cx="140" cy="248" r="3"/><circle cx="160" cy="246" r="3"/>
    <circle cx="180" cy="230" r="3"/><circle cx="180" cy="210" r="3"/><circle cx="180" cy="190" r="3"/>
    <circle cx="200" cy="190" r="3"/><circle cx="220" cy="190" r="3"/><circle cx="240" cy="192" r="3"/>
    <circle cx="260" cy="210" r="3"/><circle cx="280" cy="230" r="3"/><circle cx="300" cy="248" r="3"/>
    <circle cx="320" cy="250" r="3"/><circle cx="340" cy="250" r="3"/>
  </g>
  <rect x="360" y="150" width="180" height="110" fill="none" stroke="#8f3d16" stroke-width="2" stroke-dasharray="4 4"/>
  <text x="40" y="48" fill="#1a2420" font-family="Segoe UI, sans-serif" font-size="18">Pontfelh${oo}, szeml${e}ltet${e}s</text>
  <text x="40" y="78" fill="#3e4c47" font-family="Segoe UI, sans-serif" font-size="14">Nem m${e}r${e}si eredm${e}ny. A szaggatott r${e}sz takart.</text>
</svg>
`,
  'public/images/kimenet-jegyzek.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <title>Terepi jegyz${e}k szeml${e}ltet${e}s</title>
  <rect width="640" height="400" fill="#faf8f4"/>
  <rect x="70" y="50" width="500" height="300" fill="#fff" stroke="#1e3d38" stroke-width="2"/>
  <g stroke="#d5d0c6" fill="none">
    <path d="M100 110H540M100 150H540M100 190H540M100 230H540M100 270H540"/>
  </g>
  <text x="100" y="96" fill="#8f3d16" font-family="Segoe UI, sans-serif" font-size="16">Z${oo}na, id${oo}ablak, takar${a}s</text>
  <text x="100" y="142" fill="#1a2420" font-family="Segoe UI, sans-serif" font-size="15">4-5 tengely: a padl${o} az ${a}ru alatt nem l${a}tszott</text>
  <text x="100" y="182" fill="#1a2420" font-family="Segoe UI, sans-serif" font-size="15">Kapu: 20 perces m${u}szakv${a}lt${a}s</text>
  <text x="100" y="222" fill="#1a2420" font-family="Segoe UI, sans-serif" font-size="15">Vezet${e}k: csak a k${u}ls${oo} pal${a}st m${e}rhet${oo}</text>
  <text x="100" y="330" fill="#3e4c47" font-family="Segoe UI, sans-serif" font-size="14">Szeml${e}ltet${oo} jegyz${e}k, nem val${o}s helysz${i}n.</text>
</svg>
`,
  'public/images/kimenet-munkacsomag.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">
  <title>Munkacsomag szerkezete</title>
  <rect width="640" height="400" fill="#faf8f4"/>
  <rect x="150" y="90" width="340" height="200" fill="#e7e2d8" stroke="#1e3d38"/>
  <rect x="170" y="70" width="340" height="200" fill="#f6e4d8" stroke="#8f3d16"/>
  <rect x="190" y="50" width="340" height="200" fill="#fff" stroke="#1e3d38" stroke-width="2"/>
  <text x="214" y="100" fill="#1a2420" font-family="Segoe UI, sans-serif" font-size="18">Pontfelh${oo}</text>
  <text x="214" y="140" fill="#1a2420" font-family="Segoe UI, sans-serif" font-size="18">Terepi jegyz${e}k</text>
  <text x="214" y="180" fill="#1a2420" font-family="Segoe UI, sans-serif" font-size="18">Nyitott k${e}rd${e}sek</text>
  <text x="150" y="340" fill="#3e4c47" font-family="Segoe UI, sans-serif" font-size="14">A csomag szerkezete. Nem egy konkr${e}t megb${i}z${a}s anyaga.</text>
</svg>
`,
};

const dec = new TextDecoder('utf-8', { fatal: true });
for (const [file, body] of Object.entries(files)) {
  fs.writeFileSync(file, body, 'utf8');
  const text = dec.decode(fs.readFileSync(file));
  if (!text.includes('fogad\u0151') && file.endsWith('csarnok-vazlat.svg')) throw new Error('hianyzo ekezet');
  console.log('ok', file);
}
