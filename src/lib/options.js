export const INDUSTRIES = [
  ['gepesgyartas', 'Gépgyártás'],
  ['elelmiszer', 'Élelmiszeripar'],
  ['logisztika', 'Logisztika és raktározás'],
  ['energetika', 'Energetika és közmű'],
  ['vegyipar', 'Vegyipar és gyógyszeripar'],
  ['autoipar', 'Autóipar és beszállítók'],
  ['kivitelezes', 'Kivitelezés és szereléstechnika'],
  ['egyeb', 'Egyéb ipari tevékenység'],
];

export const PROJECT_TYPES = [
  ['geptelepites', 'Géptelepítés előkészítése'],
  ['csarnok', 'Csarnok- és raktárátalakítás'],
  ['gepeszet', 'Gépészeti tér rekonstrukciója'],
  ['egyeb', 'Más ipari felmérési feladat'],
];

export const OUTPUTS = [
  ['pontfelho', 'Színezett pontfelhő'],
  ['terepti', 'Terepi dokumentáció'],
  ['munkacsomag', 'Egyeztetett munkacsomag a további tervezéshez'],
];

export const COORDS = [
  ['helyi', 'Helyi rendszer, a feladathoz kötve'],
  ['uzemi', 'Meglévő üzemi hálózathoz illesztve'],
  ['eov', 'EOV, ha a kontrollpontok rendelkezésre állnak'],
  ['nincs', 'Még nincs döntés, egyeztetést kérek'],
];

export const ACCURACY = [
  ['feladat', 'A feladat dönti el, kérem a javaslatot'],
  ['utkozes', 'Ütközésvizsgálat a kritikus zónában'],
  ['tervezes', 'Tervezési előkészítés a vállalt zónában'],
  ['nincs', 'Még nincs rögzített tűrés'],
];

export const FILE_SIZES = [
  ['kicsi', '5 GB alatt'],
  ['kozepes', '5–20 GB'],
  ['nagy', '20–50 GB'],
  ['extra', '50 GB felett'],
  ['nem-tudni', 'Még nem becsülhető'],
];

export const STATUSES = [
  ['uj', 'Új'],
  ['egyeztetes', 'Egyeztetés alatt'],
  ['helyszini', 'Helyszíni munka'],
  ['ajanlat', 'Ajánlat előkészítése'],
  ['lezart', 'Lezárt'],
  ['nem_aktualis', 'Nem aktuális'],
  ['spam', 'Rejtett (kéretlen)'],
];

export function labelOf(list, value) {
  const found = list.find(([code]) => code === value);
  return found ? found[1] : (value || '');
}

export function labelsOf(list, stored) {
  return String(stored || '')
    .split('|')
    .filter(Boolean)
    .map((code) => labelOf(list, code))
    .join(', ');
}

export function statusLabel(code) {
  return labelOf(STATUSES, code) || code || '';
}
