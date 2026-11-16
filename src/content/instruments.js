const REQUIRED = ['instrument', 'configuration', 'facts', 'unit', 'conditions', 'source', 'sourceLabel', 'checkedOn', 'publicText'];

function filled(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isCompleteRecord(record) {
  if (!record || typeof record !== 'object') return false;
  if (!REQUIRED.every((key) => filled(record[key]))) return false;
  return typeof record.accessConfirmed === 'boolean' && typeof record.publishApproved === 'boolean';
}

export const instrumentRecords = [
  {
    id: 'trimble-x9',
    instrument: 'Trimble X9',
    configuration: 'Core LT, Core és Premium külön sor. A felméréshez használt konfiguráció nincs rögzítve.',
    facts: 'Mindhárom konfiguráció: 3,0 mm 3D pontpontosság 20 m-en, 3 koaxiális, kalibrált 10 MP kamera. Hatótáv: Core LT 0,6–40 m, Core 0,6–80 m, Premium 0,6–150 m.',
    unit: 'mm @ 20 m; m',
    conditions: 'A gyártói összehasonlító táblázat sora. A termékoldal kiemelt 150 m-es tartománya a Premium sorhoz tartozik, nem mindhárom konfigurációhoz.',
    source: 'https://geospatial.trimble.com/en/products/hardware/trimble-x9',
    sourceLabel: 'Trimble X9 termékoldal és konfigurációs táblázat',
    checkedOn: '2026-11-16',
    accessConfirmed: false,
    publishApproved: false,
    publicText: 'Trimble X9, gyártói táblázat. Mindhárom konfiguráción 3,0 mm 3D pontpontosság 20 m-en, és 3 koaxiális, kalibrált 10 MP kamera. A hatótáv nem közös: Core LT 0,6–40 m, Core 0,6–80 m, Premium 0,6–150 m. A használt konfiguráció nincs rögzítve, ezért egyik hatótáv sem vállalt jellemző. Saját X9-parkot nem állítunk.',
    claims: [],
  },
  {
    id: 'leica-rtc360',
    instrument: 'Leica RTC360',
    configuration: 'Gyártói adatlap. Saját hozzáférés nincs rögzítve.',
    facts: '3D pontpontosság 1,9 mm 10 m-en, 2,9 mm 20 m-en, 5,3 mm 40 m-en. Hatótáv 0,5 m-től legfeljebb 130 m-ig. A 3/6/12 mm 10 m-en választható pontköz.',
    unit: 'mm; m',
    conditions: '68%-os megbízhatóság, 89% albedó a pontossági soroknál. A pontköz nem pontosság. A mérési sebesség nem a teljes projekt átfutása.',
    source: 'https://leica-geosystems.com/-/media/files/leicageosystems/products/datasheets/leica-rtc360-ds.ashx',
    sourceLabel: 'Leica RTC360 adatlap',
    checkedOn: '2026-11-16',
    accessConfirmed: false,
    publishApproved: false,
    publicText: 'Leica RTC360, gyártói adatlap. 3D pontpontosság 1,9 mm 10 m-en, 2,9 mm 20 m-en és 5,3 mm 40 m-en, 68%-os megbízhatóság és 89% albedó mellett. A 3, 6 és 12 mm 10 m-en beállítható pontköz, nem pontosság. A gyártói hatótáv 0,5 m-től legfeljebb 130 m. Saját hozzáférés nincs megerősítve, ezért ez nem vállalt szolgáltatási pontosság.',
    claims: [
      {
        kind: 'speed',
        text: 'Akár 2 millió mért pont másodpercenként.',
        approved: false,
      },
    ],
  },
  {
    id: 'riegl-vz-600i',
    instrument: 'RIEGL VZ-600i',
    configuration: 'Tervezett beszerzés. Hozzáférés nincs megerősítve, nem használt műszer.',
    facts: '3D pozíciópontosság 3 mm 50 m-en és 5 mm 100 m-en. A legnagyobb hatótáv és a legnagyobb impulzusismétlés külön oszlop.',
    unit: 'mm @ 50 m',
    conditions: 'A legnagyobb hatótáv nem a legnagyobb impulzusismétlés mellett érvényes. A PRR nem az átadott pontok száma. A tervezett beszerzés nem jelenlegi bizonyíték.',
    source: 'https://www.riegl.com/de-deutschland/products/detail/riegl-vz-600i',
    sourceLabel: 'RIEGL VZ-600i gyártói oldal',
    checkedOn: '2026-11-16',
    accessConfirmed: false,
    publishApproved: false,
    publicText: 'RIEGL VZ-600i, gyártói táblázat. 3D pozíciópontosság 3 mm 50 m-en és 5 mm 100 m-en. A legnagyobb hatótáv és a legnagyobb impulzusismétlés külön oszlop, ezért nem egyszerre érvényes beállítás. Az impulzusismétlés nem az átadott pontok száma. A tervezett beszerzés nem jelenlegi műszerhasználat.',
    claims: [],
  },
];

export function publicSpeedClaims(records = instrumentRecords) {
  return records.flatMap((record) => {
    if (!isCompleteRecord(record) || !record.accessConfirmed || !record.publishApproved) return [];
    return (record.claims || [])
      .filter((claim) => claim && claim.kind === 'speed' && claim.approved === true && filled(claim.text))
      .map((claim) => claim.text.trim());
  });
}

export function publicExplainers(records = instrumentRecords) {
  return records.filter(isCompleteRecord).map((record) => ({
    instrument: record.instrument,
    text: record.publicText.trim(),
    source: record.source,
    sourceLabel: record.sourceLabel,
    checkedOn: record.checkedOn,
  }));
}
