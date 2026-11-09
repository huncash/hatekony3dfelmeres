import { config } from '../config.js';

function endSentence(text) {
  const value = String(text || '').trim();
  if (!value) return '';
  return /[.!?]$/.test(value) ? value : `${value}.`;
}

export function privacyPage() {
  const email = config.contactEmail;
  const company = config.company;
  return {
    path: '/adatvedelem',
    kicker: 'Adatkezelés',
    h1: 'Adatkezelési tájékoztató',
    metaTitle: 'Adatkezelési tájékoztató | Hatékony 3D felmérés',
    metaDescription: 'Hogyan kezeli az ADP-TOP Kft. a hatekony3dfelmeres.hu projektigényben megadott adatokat: cél, jogalap, megőrzés, címzettek és az érintett jogai.',
    lede: `Ez a tájékoztató a hatekony3dfelmeres.hu oldalon beküldött projektigényre és a lap technikai működésére vonatkozik. Frissítve: 2026. november 9.`,
    blocks: [
      {
        type: 'text',
        h2: 'Ki az adatkezelő',
        paragraphs: [
          `${company.legalName} (${company.shortName}), székhely: ${endSentence(company.seat)} Adószám: ${company.taxId}. Cégjegyzékszám: ${company.regNo}, ${endSentence(company.court)} Kapcsolat adatvédelmi kérdésben: ${email}, telefon: ${config.phone}.`,
          'Adatvédelmi tisztviselő nevét ezen az oldalon nem tüntetjük fel, mert a megkereséseket a fenti címen fogadjuk. Ha a cég adatvédelmi tisztviselőt jelöl ki, a válaszban az ő elérhetősége is szerepel.',
        ],
      },
      {
        type: 'text',
        h2: 'Milyen adatokat kezelünk',
        paragraphs: [
          'A projektigény űrlapon: cégnév, kapcsolattartó neve, e-mail, telefon, iparág, projekt típusa, helyszín, tervezett ütemezés, hozzáférési időablak, kért kimenet, koordinátarendszer, pontossági igény, becsült fájlméret, megjegyzés, a hozzájáruló jelölés ténye.',
          'A beküldéshez kapcsolódó technikai adatok: időpont, forrásdomain, a küldő oldal címe, a hivatkozó cím, a kampány (UTM) paraméterei, ha a böngészőben megvoltak, az IP-cím és a böngésző rövid azonosítója. Ezek a visszaélések szűréséhez és a megkeresés visszakövetéséhez kellenek.',
          'Az admin felület csak az üzemeltető belépése után, külön jelszóval érhető el. A belépés egy munkamenet-sütit helyez el. A nyilvános oldal látogatójának követő sütit nem adunk, hirdetési vagy analitikaimodult nem töltünk be. A kampányparamétereket a böngésző saját tárhelyén őrizzük addig, amíg az űrlapot elküldi, vagy a lapot bezárja; ez a szerverre csak a beküldéskor jut el.',
        ],
      },
      {
        type: 'text',
        h2: 'Miért és milyen jogalapon',
        paragraphs: [
          'A projektigényt azért kezeljük, hogy a leírt ipari felmérési feladatra választ adjunk, és ha a keretek ehhez elegendők, ajánlatot készítsünk. A jogalap a GDPR 6. cikk (1) bekezdés b) pontja: az érintett kérésére megtett lépések a szerződéskötést megelőzően. A jelölőnégyzet ennek a kérésnek és a tájékoztató megismerésének a rögzítése.',
          'Az IP-cím, a böngészőazonosító és a kéretlen beküldések szűrése a GDPR 6. cikk (1) bekezdés f) pontján, jogos érdeken alapul. A cél a visszaélés és a túlterhelés korlátozása. Hírlevelet nem küldünk, az adatot nem profilozzuk, automatikus döntést nem hozunk, és automatikus szerződést nem kötünk.',
        ],
      },
      {
        type: 'text',
        h2: 'Meddig őrizzük, és kik látják',
        paragraphs: [
          'A projektigényt a beküldéstől számított 24 hónapig őrizzük, majd töröljük, kivéve ha addig megbízás születik, és a levelezést a szerződés vagy a számviteli megőrzés miatt tovább kell tartani. A kéretlennek jelölt beküldéseket legfeljebb 90 napig tartjuk meg. Az admin munkamenet sütije 12 óra után lejár.',
          `A címzettek az ${company.shortName} munkatársai, akik a felmérés egyeztetésében részt vesznek. Ha a levelezés be van állítva, a projektigény szövege a cég saját postafiókjába (${email}) is megérkezik; ekkor a levelezésszolgáltató a küldés technikai közreműködője. Az adatot nem adjuk el, és fizetési szolgáltatónak nem továbbítjuk, mert az oldalon fizetés nincs.`,
          config.hostingNote
            ? `Tárhely: ${config.hostingNote}`
            : 'A tárhelyszolgáltató nevét és elérhetőségét kérésre a kapcsolat e-mail-címen megadjuk.',
        ],
      },
      {
        type: 'text',
        h2: 'Az érintett jogai',
        paragraphs: [
          `Kérheti a kezelt adatokhoz való hozzáférést, a helyesbítést, a törlést, az adatkezelés korlátozását, és tiltakozhat a jogos érdeken alapuló kezelés ellen. A szerződéskötés előtti lépésekről szóló kezeléshez a törlési kérést teljesítjük, ha még nincs olyan kötelezettség, amely a megőrzést előírja. Kérelmét a ${email} címre küldheti. A választ indokolatlan késedelem nélkül, legkésőbb egy hónapon belül adjuk meg.`,
          'Panaszt tehet a Nemzeti Adatvédelmi és Információszabadság Hatóságnál: 1055 Budapest, Falk Miksa utca 9–11., postacím: 1363 Budapest, Pf. 9., telefon: +36 (1) 391-1400, e-mail: ugyfelszolgalat@naih.hu, honlap: https://naih.hu. A Hatóság tájékoztatása szerint eljárást e-mailben nem lehet indítani; a benyújtás módját a naih.hu írja le.',
        ],
      },
    ],
  };
}

export function imprintPage() {
  const company = config.company;
  return {
    path: '/impresszum',
    kicker: 'Üzemeltető',
    h1: 'Impresszum',
    metaTitle: 'Impresszum | Hatékony 3D felmérés',
    metaDescription: 'A hatekony3dfelmeres.hu üzemeltetője az ADP-TOP Kft. Székhely, cégjegyzékszám, adószám és kapcsolat. Az oldal nem webshop, és nem köt automatikus szerződést.',
    lede: 'A hatekony3dfelmeres.hu domainen elérhető oldalt az alábbi gazdasági társaság üzemelteti.',
    blocks: [
      {
        type: 'text',
        h2: 'Az üzemeltető',
        paragraphs: [
          `${endSentence(company.legalName)} Rövidített név: ${endSentence(company.shortName)}`,
          `Székhely: ${endSentence(company.seat)}`,
          `Adószám: ${company.taxId}. Közösségi adószám: ${company.euTaxId}.`,
          `Cégjegyzékszám: ${company.regNo} (${company.court}).`,
          `E-mail: ${config.contactEmail}. Telefon: ${config.phone}.`,
        ],
      },
      {
        type: 'text',
        h2: 'Amit ez az oldal nem tesz',
        paragraphs: [
          'Az oldal nem webáruház. Fizetést nem kezel, automatikus árajánlatot nem állít elő, és szerződést nem köt. A projektigény rögzítése egyeztetést indít, nem megrendelést.',
          'A közzétett szakmai szövegek a munka kereteit írják le. Nem hatósági állásfoglalások, és nem helyettesítik a konkrét feladatra adott írásos vállalást. Földhivatali záradékolást és engedélyezési eljárást nem vállalunk.',
        ],
      },
      {
        type: 'text',
        h2: 'Tárhely és felelősség',
        paragraphs: [
          config.hostingNote
            ? `Tárhelyszolgáltató: ${config.hostingNote}`
            : 'A tárhelyszolgáltató adata kérésre a fenti e-mail-címen kérhető, ha a tárhelyszerződés a közzétételt előírja.',
          'A saját szöveg és az eredeti magyarázó ábrák szerzői joga az üzemeltetőt illeti. A helyettesítő keretek nem valós projektfotók, és nem utalnak meg nem nevezett megrendelőre. Névvel vállalt referencia csak a megrendelő írásos hozzájárulásával kerülhet az oldalra.',
        ],
      },
    ],
  };
}

export function termsPage() {
  const company = config.company;
  return {
    path: '/aszf',
    kicker: 'Üzemeltető',
    h1: 'Általános szerződési feltételek',
    metaTitle: 'ÁSZF, üzemeltető adatai | Hatékony 3D felmérés',
    metaDescription: 'A hatekony3dfelmeres.hu üzemeltetőjének cégadatai. A lap nem közöl részletes, jogilag lezárt szerződéses feltételeket; a munka kereteit a megbízás rögzíti.',
    lede: 'Ezen az oldalon az üzemeltető azonosító adatai szerepelnek. Részletes szerződéses feltételeket — díj, felelősség, teljesítési határidő — nem közlünk. Ezeket a konkrét feladatra kötött megbízás rögzíti. Az alábbi szöveg nem jogi felülvizsgálaton átesett szerződésszöveg.',
    blocks: [
      {
        type: 'text',
        h2: 'Üzemeltető adatai',
        paragraphs: [
          `${endSentence(company.legalName)} Rövidített név: ${endSentence(company.shortName)}`,
          `Székhely: ${endSentence(company.seat)}`,
          `Adószám: ${company.taxId}. Közösségi adószám: ${company.euTaxId}.`,
          `Cégjegyzékszám: ${company.regNo} (${company.court}).`,
          `E-mail: ${config.contactEmail}. Telefon: ${config.phone}.`,
        ],
      },
      {
        type: 'text',
        h2: 'A projektigény és a megbízás',
        paragraphs: [
          'A projektigény beküldése nem jelent megrendelést. Az oldal nem kezel fizetést, és nem köt szerződést. A felmérés terjedelmét, ütemét és díját a felek a feladat ismeretében egyeztetik.',
        ],
      },
    ],
  };
}
