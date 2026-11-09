export const faqs = [
  {
    id: 'mikor',
    q: 'Mikor kell felmérés, és mikor elég a meglévő terv?',
    a: 'A régi alaprajz akkor elég, ha a fogadó zóna azóta bizonyíthatóan nem változott, és a tervező vállalja, hogy abból dolgozik. Felmérést akkor érdemes kérni, ha a gép bejutása, az alap, a közműkiállás vagy a daruzott tér a valós geometrián múlik, a rajz kora vagy a helyszíni átalakítások miatt pedig ezt a rajz nem bizonyítja.',
  },
  {
    id: 'termeles',
    q: 'Lehet termelés közben dolgozni?',
    a: 'Sok zónában igen, ha a kíséret, a védőeszköz és a targoncaforgalom előre rendezett. Ahol a szakasz csak leálláskor járható, ott külön időablak kell. Azt vállaljuk, hogy a munkát a megadott ablakhoz igazítjuk. Ha az ablak szűkebb, mint a feladat, a terjedelem vagy a kiszállások száma módosul. Nulla termeléskiesést nem ígérünk.',
  },
  {
    id: 'pontossag',
    q: 'Milyen pontos lesz az eredmény?',
    a: 'A tűrés a feladattól, a választott módszertől és a helyszíni feltételektől függ. Egy gépalap ütközésvizsgálata és egy hosszú csarnok áttekintése nem ugyanaz a szám. A vállalható értéket a kritikus zónára, írásban rögzítjük, ha a feladat egyáltalán számszerű tűrést igényel. Általános, minden felületre érvényes pontossági ígéretet nem adunk.',
  },
  {
    id: 'zaradek',
    q: 'Kapunk földhivatali vagy hatósági záradékot?',
    a: 'Nem. A munka meglévő ipari tér geometriai felmérése a tervezés és a kivitelezés előkészítéséhez. Nem földmérési hatósági eljárás, nem földhivatali záradékolás, és nem helyettesíti a statikai, gépészeti vagy engedélyezési szakvéleményt.',
  },
  {
    id: 'ar',
    q: 'Azonnal kapok árat?',
    a: 'Nem, ha a zóna, a hozzáférés és a kért kimenet még nincs eléggé leírva. Ezek nélkül egy szám találgatás lenne, ezért automatikus árat nem adunk. A beküldött igény után azt jelezzük, miből tudunk vállalást adni, és mi hiányzik hozzá.',
  },
  {
    id: 'fajl',
    q: 'Milyen fájlokat adnak át?',
    a: 'Azt, amit a megbízásban rögzítünk. Jellemző kérés a pontfelhő, a terepi jegyzék és egy munkacsomag a további tervezéshez. A konkrét formátum a fogadó szoftvertől függ, ezért az egyeztetés része, nem egy előre eldöntött, minden feladatra azonos lista.',
  },
  {
    id: 'belepes',
    q: 'Ki intézi az üzemi belépést?',
    a: 'Az üzemeltető. Mi előre leírjuk, milyen kíséretre, oktatásra, védőeszközre és időablakra van szükség. A belépő, a zónazár és a termelés védelme a helyszín szabálya szerint történik. A termelést nem mi állítjuk le.',
  },
  {
    id: 'hiany',
    q: 'Mi történik, ha egy zóna a helyszínen nem hozzáférhető?',
    a: 'A hozzáférhető részt feldolgozzuk, a takart vagy lezárt részt hiányként dokumentáljuk. Nem pótoljuk feltételezett geometriával. Ha a hiány a döntést blokkolja, külön időablakot vagy szűkebb feladatot javaslunk.',
  },
  {
    id: 'tervezo',
    q: 'A pontfelhő helyettesíti a tervezőt?',
    a: 'Nem. A tervező és a géptelepítő dönt. A felmérés a meglévő teret és a nyitott kérdéseket adja át, abban a határban, amit előre megbeszéltünk. Alapozási számítást, technológiai garanciát és engedélyezési tervet nem vált ki.',
  },
  {
    id: 'ido',
    q: 'Mennyi idő egy csarnok felmérése?',
    a: 'Nincs egyetlen időtartam egy „csarnokra”. Egy üres folyosó és egy kíséretköteles, műszakhoz kötött gépészeti tér nem azonos munka. Az időt a zónák, az ablakok és a kért kimenet ismeretében becsüljük. A becslés addig nem végleges vállalás, amíg a hozzáférés nincs megerősítve.',
  },
  {
    id: 'adat',
    q: 'Ki látja a beküldött adatokat?',
    a: 'Az adatkezelő a projektigényt a kapcsolatfelvételhez és az ajánlat előkészítéséhez kezeli. Hírlevélre nem iratkoztatjuk fel, az adatot nem adjuk el, és a rendszer nem köt szerződést. A megőrzés és a jogok részletei az adatkezelési tájékoztatóban vannak.',
  },
  {
    id: 'targy',
    q: 'Tárgyat vagy alkatrészt is felmérnek?',
    a: 'Nem. Épületeket, helyiségeket, csarnokokat, raktárakat és a gép körüli meglévő teret mérjük fel. Tárgyszkennelést, alkatrész-digitalizálást és reverse engineeringet nem vállalunk.',
  },
];

export const homeFaqs = [
  {
    id: 'mikor',
    q: 'Mikor kell felmérés?',
    a: 'Ha a gép bejutása, az alap vagy a közmű a valós geometrián múlik, és a régi rajz ezt nem bizonyítja.',
  },
  {
    id: 'termeles',
    q: 'Lehet termelés közben?',
    a: 'Igen, ha a zóna és az időablak előre rendezett. Nulla termeléskiesést nem ígérünk.',
  },
  {
    id: 'fajl',
    q: 'Mit kapok a felmérésből?',
    a: 'Azt, amit a megbízásban rögzítünk. A pontfelhő, a jegyzék és a munkacsomag nem egy automatikus csomag.',
  },
  {
    id: 'ar',
    q: 'Azonnal kapok árat?',
    a: 'Nem. Előbb a zóna, a hozzáférés és a kért kimenet kell.',
  },
];

export const homeFaqIds = ['mikor', 'termeles', 'pontossag', 'ar', 'zaradek'];

export function faqByIds(ids) {
  const map = new Map(faqs.map((item) => [item.id, item]));
  return ids.map((id) => map.get(id)).filter(Boolean);
}
