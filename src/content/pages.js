import { publicExplainers, publicSpeedClaims } from './instruments.js';

export const services = [
  {
    path: '/geptelepites-elokeszites',
    nav: 'Géptelepítés',
    cardTitle: 'Géptelepítés előkészítése',
    cardText: 'A rendelkezésre álló tér és releváns meglévő környezet rögzítése.',
    kicker: 'Szolgáltatás',
    h1: 'Géptelepítés előkészítése meglévő térben',
    metaTitle: 'Géptelepítés előkészítése meglévő csarnokban | Hatékony 3D felmérés',
    metaDescription: 'Meglévő csarnok felmérése géptelepítés előtt: fogadó zóna, bejutási út, alap és közműkiállás. Üzemi időablakkal, dokumentált hiánnyal, automatikus ár nélkül.',
    lede: 'Amikor egy gép, egy cella vagy egy sor egy már működő csarnokba kerül, a kritikus kérdés nem a szkenner márkája. Az, hogy a fogadó hely és a bejutási út tényleg az-e, amit a rajz mutat, és hogy ezt a termelés rendjéhez igazítva lehet-e felmérni.',
    blocks: [
      {
        type: 'text',
        h2: 'Milyen döntést készítünk elő',
        paragraphs: [
          'A telepítő azt akarja tudni, befér-e a szállítási egység a kapun, elfordul-e a kereszteződésben, és hol ütközik a födém alatti gépészettel. A tervező azt, hogy a gépalap, a gödör és a meglévő dübelek hol találkoznak az új kontúrral. Az üzemeltető azt, hogy mindehhez melyik műszakban lehet a zónához hozzáférni anélkül, hogy a szomszédos sor megállna.',
          'A felmérés ezekre a döntésekre szűkül. Nem mérjük fel „a biztonság kedvéért” az egész telket, ha a gép egy traktusba érkezik. A közömbös terület elviszi azt az időt, amely a szűkületre kellene. A határt az egyeztetésen, írásban rögzítjük: fogadó állás, bejutási út, közműkiállások, és ha a daru vagy a karbantartási tér a gép fölött foglalt, az a sáv is.',
        ],
      },
      {
        type: 'text',
        h2: 'Mit adunk át a telepítőnek és a tervezőnek',
        list: [
          'A vállalt zóna pontfelhője, egyeztetett koordinátarendszerben és kimondott mértékegységgel.',
          'Terepi jegyzék: hol jártunk, mit takart a termelés, melyik időablakban, melyik szűkület igényel külön figyelmet.',
          'Egyeztetett munkacsomag, ha a tervező és a kivitelező ugyanabból az anyagból akar dolgozni: fájllista, nyitott kérdések, és az, ami a döntéshez még hiányzik.',
        ],
        paragraphs: [
          'A formátum a fogadó szoftvertől függ. Nem ígérünk egyetlen, minden gépgyártónak megfelelő csomagot. A fájlméret nagyságrendjét előre megbeszéljük, a végleges méret a lefedettség és a szűrés után derül ki.',
        ],
      },
      {
        type: 'note',
        title: 'Az üzemi idő a feladat része',
        paragraphs: [
          [
            'A bejárást a műszakhoz igazítjuk. Ha a gép útja egy élő targonca-folyosón vezet, azt az ablakot külön tervezzük, kísérettel. Ha a gépalap csak akkor látszik, amikor a készterméket elhúzzák, ezt a feltételt az ütembe írjuk. A termelést nem mi állítjuk le, és nem ígérjük, hogy a felmérés kiesés nélkül elfér. Azt vállaljuk, hogy az ablak hossza és a feladat terjedelme előre össze van vetve. ',
            { href: '/cikkek/3d-felmeres-mukodo-uzemben', label: 'Lehet 3D felmérést végezni működő üzemben?' },
          ],
        ],
      },
      {
        type: 'limit',
        title: 'Amit a géptelepítési felmérés nem tartalmaz',
        items: [
          'Alapozási és statikai számítást, gyártói telepítési tervet, technológiai garanciát.',
          'Földhivatali záradékot, hatósági engedélyezést, rejtett szerkezet feltárását.',
          'Olyan pontossági számot, amely a teljes csarnokra szólna, miközben a döntés egy gépalapról vagy egy ajtóról születik.',
        ],
      },
      {
        type: 'text',
        paragraphs: [
          'Ha a feladat inkább a polcrend, a dokk vagy a közlekedés átalakítása, a csarnok- és raktárátalakítás oldala a mérvadó. Ha a gép körül a vezetékezés és a kezelőszint a kérdés, a gépészeti tér rekonstrukciója illik jobban.',
        ],
      },
    ],
  },
  {
    path: '/csarnok-atalakitas',
    nav: 'Csarnok',
    cardTitle: 'Csarnok- és raktárátalakítás',
    cardText: 'Tartószerkezetek, közlekedési terek és meglévő elrendezés felmérése.',
    kicker: 'Szolgáltatás',
    h1: 'Csarnok- és raktárátalakítás felmérése',
    metaTitle: 'Csarnok- és raktárátalakítás felmérése | Hatékony 3D felmérés',
    metaDescription: 'Működő csarnok és raktár felmérése átalakításhoz: polcsor, dokk, közlekedés, oszloprács. Műszakhoz igazított hozzáférés, dokumentált takarással.',
    lede: 'A raktár átalakítása ritkán üres épületben történik. A polc még árut tart, a dokknál még érkezik az autó, a tervező pedig egy olyan alaprajzból dolgozna, amely a legutóbbi polcátrendezést már nem tartalmazza. A felmérésnek ebben a rendben kell elférnie.',
    blocks: [
      {
        type: 'text',
        h2: 'Amikor a csarnok közben is dolgozik',
        paragraphs: [
          'Tipikus feladat a polcsor cseréje, egy új dokk, egy közbenső födém, a közlekedési sáv átrajzolása vagy annak ellenőrzése, hogy az oszloprács a tervezett átalakítással tényleg ott van-e, ahol a régi terv mutatja. Ezek a kérdések zónákhoz kötődnek. Egy háromhajós raktárból nem következik, hogy mind a három hajót azonos sűrűséggel kell felmérni.',
          [
            'Az üzemeltetővel előre végigvesszük, melyik folyosó melyik műszakban üríthető, hol kell a targoncát terelni, és melyik dokkot nem szabad az érkeztetési ablakban foglalni. A felmérés sorrendje ezt követi. Ha egy hajó aznap nem adható át, a többit nem tartjuk fel: a hiány külön sor, nem ok arra, hogy az egész napot újratervezzük a helyszínen kapkodva. A járható zóna és a külön ablak különbségét ',
            { href: '/cikkek/3d-felmeres-mukodo-uzemben', label: 'a működő üzemi felmérés' },
            ' bontja ki.',
          ],
        ],
      },
      {
        type: 'text',
        h2: 'Mire használható az anyag',
        paragraphs: [
          'A tervező a meglévő oszlopokat, a dokkok nyílásait, a padló látható töréseit és a polcrendszer által még szabadon hagyott teret kapja meg, a vállalt szakaszon. A kivitelező a terepi jegyzékből látja, hol állt áru a felméréskor, tehát hol nem a padló, hanem a takarás van az anyagban. A kettőt összeköti az egyeztetett munkacsomag: fájllista, koordinátarendszer, nyitott kérdések.',
          'A raktár felmérése ezen az oldalon a meglévő tér rögzítése egy konkrét átalakítási döntéshez: hova fér a következő állványmező, hol ütközik a targonca útvonala, melyik nyílás a dokk valós kontúrja. A „legyen meg az egész épület” kérésből először ezt a döntést keressük meg.',
        ],
      },
      {
        type: 'note',
        title: 'Hozzáférés több bérlő vagy több műszak esetén',
        paragraphs: [
          'Ha a csarnokban több bérlő dolgozik, a belépés és a kíséret bérlőnként változhat. Ezt a hozzáférési tervbe írjuk, nem a helyszínen derítjük ki. Az éjszakai ablak és a műszakváltás rövid szünete különböző munka: a rövid szünetbe egy nyílás vagy egy kereszteződés fér, nem egy teljes hajó. A terjedelem ehhez igazodik.',
        ],
      },
      {
        type: 'limit',
        title: 'Amit a csarnokfelmérés nem állít',
        items: [
          'Nem igazol padló teherbírást, tűzszakaszt vagy hatósági megfelelőséget.',
          'Nem ígérjük, hogy a felmérés a kiszállítást nem érinti. Az ablakot egyeztetjük, a kiesést nem nullázzuk.',
          'A polc alatt és az áru mögött takart felületet nem töltjük ki. A hiány a jegyzékben marad.',
        ],
      },
    ],
  },
  {
    path: '/gepeszeti-ter-rekonstrukcio',
    nav: 'Gépészet',
    cardTitle: 'Gépészeti környezet dokumentálása',
    cardText: 'Hozzáférhető csövek, vezetékek és kapcsolódó térbeli elemek rögzítése.',
    kicker: 'Szolgáltatás',
    h1: 'Gépészeti környezet dokumentálása',
    metaTitle: 'Gépészeti tér rekonstrukciójának felmérése | Hatékony 3D felmérés',
    metaDescription: 'Ipari gépészeti terek felmérése rekonstrukcióhoz: kazánház, csőtartó, kezelőjárda. Látható geometria, dokumentált takarás, egyeztetett üzemi ablak.',
    lede: 'A gépészeti rekonstrukció ott nehéz, ahol a következő tervezőnek a meglévő vezeték, a kezelőjárda és a szabad szerelési hely kell, nem egy látványkép. Ezek a terek szűkek, melegek, és gyakran csak kísérettel járhatók.',
    blocks: [
      {
        type: 'text',
        h2: 'Milyen terekről van szó',
        paragraphs: [
          [
            'Kazánház, hőközpont, technológiai folyosó, csőtartó híd, gépház-galéria, elszívó gerinc. A közös bennük, hogy a geometria sűrű, a hozzáférés pedig a berendezés működéséhez kötött. Egy leállított szivattyú melletti óra és egy üzemelő kazán melletti tíz perc nem cserélhető fel. Az időablakot ezért a gépészettel együtt írjuk meg, nem egy általános „csarnoknap” részeként. ',
            { href: '/cikkek/3d-felmeres-mukodo-uzemben', label: 'Üzemmenet melletti felmérés' },
            ' ugyanerről szól, a térfelmérés határain belül.',
          ],
          'A felmérés a látható felületekre terjed ki: vezeték külső palástja, szigetelés külső kontúrja, tartó, járda, faláttörés, kezelőállás. A tervező ebből tud ütközést vizsgálni és nyomvonalat keresni. A szigetelés alatti középvonal, a falban futó szakasz és a bontható fedél mögötti szerelvény csak akkor része az anyagnak, ha látható, vagy ha a megbontást az üzem külön, előre vállalja.',
        ],
      },
      {
        type: 'text',
        h2: 'Amit a rekonstrukciós csomag tartalmaz',
        paragraphs: [
          'Pontfelhő a bejárt szakaszról, terepi jegyzék a takarásokról és a hőmérsékleti vagy hozzáférési korlátokról, valamint a nyitott kérdések listája. Ha egy DN-vezetéknek csak a szigetelt palástja látszott, a jegyzék ezt mondja ki. A tervező eldöntheti, kell-e bontás, kézi méret vagy egy második ablak. Mi ezt a döntést nem helyettesítjük egy kisimított modellel.',
          'A koordinátarendszert a meglévő üzemi hálóhoz vagy egy helyi, a helyszínen kijelölt rendszerhez kötjük. EOV-illesztést csak akkor vállalunk, ha a kontrollpontok rendelkezésre állnak, és a feladat ezt kéri. Záradékot ehhez sem adunk.',
        ],
      },
      {
        type: 'note',
        title: 'Biztonság és kíséret',
        paragraphs: [
          'A gépészeti térbe a helyszín szabályai szerint lépünk be: kíséret, védőeszköz, és ha van, a robbanásveszélyes zóna előírása. Ezeket a kiszállás előtt rögzítjük. Ahol a hő vagy a lezárás a munkát aznap kizárja, a szakaszt kihagyjuk és dokumentáljuk. Nem „minden helyzetben” mérünk.',
        ],
      },
      {
        type: 'limit',
        title: 'Amit nem vállalunk gépészeti rekonstrukció címén',
        items: [
          'Csővezeték szilárdsági számítást, hőszigetelési rétegrendet, technológiai garanciát.',
          'Szigetelés alatti vagy falban lévő, nem látható középvonal kitalálását.',
          'Hatósági felülvizsgálat helyettesítését a geometriai anyaggal.',
        ],
      },
    ],
  },
];

export const processPage = {
  path: '/folyamat',
  kicker: 'Munkamenet',
  h1: 'Hogyan zajlik az ipari felmérés',
  metaTitle: 'Hogyan zajlik az ipari felmérés | Hatékony 3D felmérés',
  metaDescription: 'Ipari felmérés egyeztetett menete: feladat és kimenet, hozzáférési terv, helyszíni munka, minőség-ellenőrzés, átadás. A termelés rendjéhez igazítva.',
  lede: 'Egyeztetett bejárás, hozzáférési terv, üzemi időablak, átadási ütem. Öt lépés, mindegyiknek van felelőse. Ami nincs leírva, az nincs benne a munkában.',
  blocks: [
    {
      type: 'steps',
      h2: 'A menet',
      items: [
        {
          title: 'Feladat és kimenet egyeztetése',
          text: 'Megnevezzük a döntést, amelyhez a geometria kell, a zónát, a kért kimenetet és azt, amit tudatosan kihagyunk. Gép, polcsor vagy gépészeti szakasz: a határ különböző. Itt dől el a formátum is, a fogadó szoftver szerint.',
        },
        {
          title: 'Hozzáférési és időablak-terv',
          text: 'Ki a kísérő, milyen belépő és védőeszköz kell, melyik órában üres a folyosó, melyik folyamatot nem szakítjuk meg. A húszperces ablakba húszperces feladat kerül. Ha ez kevesebb, mint a teljes zóna, második kiszállást vagy szűkebb terjedelmet javaslunk, még a helyszín előtt.',
        },
        {
          title: 'Helyszíni terepi felmérés',
          text: 'A vállalt zónát mérjük. A jegyzékbe kerül az ideiglenes akadály, a friss bontás és minden takarás. Ahol nem látunk oda, lyuk marad. A lyukat nem töltjük ki.',
        },
        {
          title: 'Feldolgozás és minőség-ellenőrzés',
          text: 'Álláspontok illesztése, lefedettség a vállalt határhoz képest, és ha kikötöttük, kontroll a kritikus helyen. A tükröző, poros vagy mozgó környezet eredménye lehet korlátozás is, nem csak egy szűrt, sima kép.',
        },
        {
          title: 'Átadás a megbeszélt formátumban',
          text: 'Fájlok, mértékegység, koordinátarendszer és a nyitott kérdések együtt, az egyeztetett ütemben. A lista része az átadásnak: ebből látszik, hol dönthet a tervező, és hol kell újabb hozzáférés.',
        },
      ],
    },
    {
      type: 'text',
      h2: 'Ki mit csinál',
      paragraphs: [
        'Az üzemeltető adja a belépést, a kíséretet és a zónazárat. A tervező vagy a géptelepítő megmondja, milyen döntést akar támogatni, és milyen szoftverrel nyitja meg az anyagot. Mi a zónát felmérjük, a hiányt leírjuk, és a megbeszélt csomagot átadjuk. A termelés leállítása, a statika és az engedély nem csúszik át hozzánk.',
      ],
    },
    {
      type: 'note',
      title: 'Mit jelent itt a hatékonyság',
      paragraphs: [
        'Nem rövidebb mérési időt egy adatlap szerint. Azt, hogy a várakozás, a rossz folyosó és az utólagos vita a kimenetről előre le van véve a munkából. A bejárás, az ablak és az átadás üteme a megbízás része. Kevesebb üresjárat a helyszínen, és kevesebb olyan fájl, amelyről utólag derül ki, hogy a tervező nem ezt kérte.',
      ],
    },
  ],
};

export const pricingPage = {
  path: '/arak',
  kicker: 'Vállalás',
  h1: 'Árazási logika és projektigény',
  metaTitle: 'Árazási logika ipari felméréshez | Hatékony 3D felmérés',
  metaDescription: 'Az ipari felmérés díja a zónától, az időablaktól és a kimenettől függ. Négyzetméterárat és automatikus kalkulátort nem adunk, amíg a feladat nincs leírva.',
  lede: 'Az árat a feladat határa adja, nem egy négyzetméter-díj. Egy leállított, üres folyosó és egy kíséretköteles, meleg gépészeti tér nem ugyanaz a négyzetméter. Amíg a zóna, a hozzáférés és a kért kimenet nincs leírva, számot nem mondunk.',
  blocks: [
    {
      type: 'text',
      h2: 'Mitől függ a vállalás',
      paragraphs: [
        'Az alábbi tényezők mozgatják a kiszállások számát, a helyszíni időt és a feldolgozást. Egyik sem helyettesíthető egy csúszkával az oldalon, mert a szabályaik feladatonként változnak.',
      ],
    },
    {
      type: 'table',
      caption: 'A díjat ezek a feltételek mozgatják. A táblázat nem árlista.',
      headers: ['Tényező', 'Mit változtat a vállaláson'],
      rows: [
        ['Terepi munka', 'A bejárt zóna, az álláspontok és a helyszíni jelenlét. Önálló tétel, nem a feldolgozás része.'],
        ['Feldolgozás és regisztráció', 'Az álláspontok illesztése és a vállalt határ ellenőrzése a helyszíni nap után.'],
        ['Átadási formátumok', 'A színezett pontfelhő, a jegyzék és a munkacsomag külön kimenet, ha a megbízás így rögzíti.'],
        ['Opcionális rajz vagy modellezés', 'Csak akkor, ha külön kérik. Nem része minden felmérésnek, és nem készül el automatikusan.'],
        ['Különleges hozzáférés vagy munkavégzési idő', 'Kíséret, oktatás, éjszakai vagy rövid műszakablak más felkészülést jelent.'],
      ],
    },
    {
      type: 'table',
      caption: 'A helyszíni idő és az átadás határideje két külön vállalás. Egyik sem m²/nap kapacitás.',
      headers: ['Idő', 'Mit rögzít az ajánlat'],
      rows: [
        ['Helyszíni munka időtartama', 'A zóna és a járható időablak után derül ki. Nem publikálunk négyzetméter/nap értéket.'],
        ['Adatátadás határideje', 'A feldolgozás és a kért formátum után, a helyszíni naptól külön.'],
      ],
    },
    {
      type: 'text',
      h2: 'Amit a projektigény után visszakérdezünk',
      paragraphs: [
        'Ha a leírásból a vállalás még nem adható meg, nem találunk ki árat. Ezeket szoktuk tisztázni, mielőtt számot mondunk:',
      ],
      list: [
        'Melyik csarnok, melyik tengelyköz, és benne van-e a bejutási út.',
        'Melyik műszakban járható a zóna, ki a kísérő, kell-e külön oktatás.',
        'Milyen szoftverrel nyitják meg a fájlt, és kell-e illesztés meglévő üzemi hálóhoz.',
        'Van-e olyan szakasz, amelyet áru, szigetelés vagy üzemelő berendezés takar.',
        'A tűrés egy konkrét ütközéshez kell-e, vagy a zóna áttekintése a cél.',
      ],
    },
    {
      type: 'limit',
      title: 'Amit az oldal szándékosan nem tud',
      items: [
        'Nincs automatikus árkalkulátor, mert a mögöttes szabály feladatonként más, és egy hamis szám rosszabb, mint a várakozás.',
        'Nincs online fizetés és nincs automatikus szerződés. A projektigény egyeztetést indít.',
        'A beküldés után a visszaigazolás csak a rögzítést igazolja, nem ajánlat.',
      ],
    },
  ],
};

export const samplesPage = {
  path: '/minta-anyagok',
  kicker: 'Kimenet',
  h1: 'Minta anyagok és referenciák',
  metaTitle: 'Minta anyagok és kimenetek | Hatékony 3D felmérés',
  metaDescription: 'Három kimenet szerkezete: pontfelhő, terepi dokumentáció és egyeztetett munkacsomag. Névvel vállalt referencia csak a megrendelő engedélyével kerül fel.',
  lede: 'A minta a munka szerkezetét mutatja, nem egy konkrét megrendelő üzemét. Névvel vállalt referenciát csak írásos hozzájárulás után teszünk közzé. Addig sem állítunk be idegen csarnokot saját eredménynek.',
  outputs: [
    {
      title: 'Színezett pontfelhő',
      image: '/images/kimenet-pontfelho.svg',
      alt: 'Sematikus ábra: oszlopok és egy gép körvonala pontokkal. Nem valós mérési anyag.',
      paragraphs: [
        'A vállalt zóna álláspontjai egyeztetett rendszerben, kimondott mértékegységgel és fájllistával. Ahol a termelés vagy a szigetelés takart, a pontfelhő ott lyukas marad. A lyuk nem hiba, ha a jegyzék megmondja az okát.',
        'A formátumot a fogadó szoftverhez kötjük. A színezett pontfelhő nem panorámakép, nem textúrázott felületmodell és nem BIM-modell. Akkor része az átadásnak, ha a megbízás így rögzíti.',
      ],
    },
    {
      title: 'Terepi dokumentáció',
      image: '/images/kimenet-jegyzek.svg',
      alt: 'Sematikus ábra: helyszíni jegyzék sorai zónáról, időablakról és takarásról. Nem valós jegyzőkönyv.',
      paragraphs: [
        'Bejárási jegyzék: melyik zónában jártunk, melyik időablakban, ki kísért, mit takart áru vagy gép. A kritikus szűkületről akkor készül fénykép, ha a helyszín szabálya a fényképezést engedi.',
        'A jegyzék mondja ki, mi látszott és mi nem. Ebből a kivitelező tudja, hol dönthet, és hol kell még egyszer hozzáférni. A szép, de magyarázat nélküli kép ezt nem helyettesíti.',
      ],
    },
    {
      title: 'Egyeztetett munkacsomag a további tervezéshez',
      image: '/images/kimenet-munkacsomag.svg',
      alt: 'Sematikus ábra: három egymásra tett anyag, pontfelhő, jegyzék és nyitott kérdések. Nem valós projektcsomag.',
      paragraphs: [
        'A pontfelhő és a jegyzék együtt, a feladatban megnevezett döntésekhez rendelve. Külön lista szól arról, mi használható a tervezéshez, és mi igényel újabb hozzáférést. Az átadás üteme — melyik fájl mikor — a megbízás része.',
        'A csomag nem tervezési műleírás és nem kiviteli terv. A tervező a saját szakágában dönt. Mi a meglévő teret és a korlátokat adjuk át.',
      ],
    },
  ],
};

export const homeSteps = [
  { title: 'Feladat és kimenet egyeztetése', text: 'Melyik döntéshez kell a geometria, és milyen anyagból dolgozik a tervező vagy a telepítő.' },
  { title: 'Hozzáférési és időablak-terv', text: 'Kíséret, belépés, védőeszköz, lezárt szakasz, és az a műszak, amikor a zóna járható.' },
  { title: 'Helyszíni terepi felmérés', text: 'A vállalt zóna felmérése, a takarások és a termelés miatti korlátok jegyzésével.' },
  { title: 'Feldolgozás és minőség-ellenőrzés', text: 'Illesztés, lefedettség a vállalt határhoz képest, és a hiányok külön listája.' },
  { title: 'Átadás a megbeszélt formátumban', text: 'Fájlok, mértékegység, koordinátarendszer és a nyitott kérdések együtt.' },
];

export const homeOutputs = [
  { title: 'Színezett pontfelhő', text: 'A vállalt zóna egyeztetett rendszerben, ha a megbízás ezt kéri. A takart rész hiányként marad.' },
  { title: 'Terepi dokumentáció', text: 'Hol jártunk, melyik időablakban, mit takart a termelés, és melyik szűkület kér külön figyelmet.' },
  { title: 'Egyeztetett munkacsomag a további tervezéshez', text: 'A pontfelhő és a jegyzék együtt, fájllistával és azzal a listával, ami a döntéshez még hiányzik.' },
];

export const commitments = [
  { title: 'Egyeztetett bejárás', text: 'A zóna és a kimenet a kiszállás előtt írásban rögzítve.' },
  { title: 'Hozzáférési terv', text: 'Kíséret, belépés, védőeszköz és a lezárt szakasz előre a tervben.' },
  { title: 'Üzemi időablak', text: 'A műszakhoz igazított ütem, külön a szűk ablakokra.' },
  { title: 'Átadási ütem', text: 'Formátum és nyitott kérdések a megbízásban, nem utólag.' },
];

const explainers = publicExplainers();
const speedClaims = publicSpeedClaims();

export const techPage = {
  path: '/technologia',
  kicker: 'Műszerismertető',
  h1: 'Gyártói műszeradatok',
  metaTitle: 'Gyártói műszeradatok | Hatékony 3D felmérés',
  metaDescription: 'Trimble X9, Leica RTC360 és RIEGL VZ-600i gyártói adatai feltételekkel. A mérési sebesség nincs publikálva, saját műszerpark nincs megerősítve.',
  lede: 'Gyártói adat, nem a felmérés vállalt jellemzője. A használt műszer és a konfiguráció nincs rögzítve. A mérési sebesség csak megerősített hozzáféréssel és jóváhagyással kerülhet az oldalra.',
  blocks: [
    ...explainers.map((item) => ({
      type: 'text',
      h2: item.instrument,
      paragraphs: [
        item.text,
        [`Ellenőrizve: ${item.checkedOn}. `, { href: item.source, label: item.sourceLabel }, '.'],
      ],
    })),
    {
      type: 'note',
      title: 'Műszeradat és projektvállalás',
      paragraphs: [
        speedClaims.length
          ? speedClaims.join(' ')
          : 'Az adatgyűjtés sebessége nincs publikálva. Nincs megerősített műszerhozzáférés és nincs jóváhagyott sebességi állítás.',
        'A projektben vállalt pontosságot, lefedettséget és átadási tartalmat az ajánlat rögzíti. A műszeradat nem az összefűzött pontfelhő, a rajz vagy egy BIM-modell pontossága, és nem a felmérés ideje.',
      ],
    },
  ],
};
