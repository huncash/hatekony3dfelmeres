import { articles } from './articles.js';
import { privacyPage, imprintPage, termsPage } from './legal.js';
import { processPage, pricingPage, samplesPage, services, techPage } from './pages.js';

export const CONTENT_DATE = '2026-11-09';

const fixed = [
  {
    path: '/',
    priority: '1.0',
    lastmod: '2026-11-16',
    metaTitle: 'Ipari 3D térfelmérés | Hatékony 3D felmérés',
    metaDescription: 'Csarnokok és meglévő gépészeti terek 3D felmérése átépítéshez, géptelepítéshez. Egyeztetett hozzáférés, pontfelhő és átadási tartalom.',
  },
  {
    path: '/szolgaltatasok',
    priority: '0.8',
    lastmod: '2026-11-16',
    metaTitle: 'Ipari felmérési szolgáltatások | Hatékony 3D felmérés',
    metaDescription: 'Három külön feladat: géptelepítés előtti tér, csarnok- és raktárátalakítás, meglévő gépészeti környezet. A részletek a saját oldalukon vannak.',
  },
  { path: services[0].path, priority: '0.9', lastmod: '2026-11-16', metaTitle: services[0].metaTitle, metaDescription: services[0].metaDescription },
  { path: services[1].path, priority: '0.9', lastmod: '2026-11-16', metaTitle: services[1].metaTitle, metaDescription: services[1].metaDescription },
  { path: services[2].path, priority: '0.9', lastmod: '2026-11-16', metaTitle: services[2].metaTitle, metaDescription: services[2].metaDescription },
  { path: processPage.path, priority: '0.7', lastmod: CONTENT_DATE, metaTitle: processPage.metaTitle, metaDescription: processPage.metaDescription },
  { path: samplesPage.path, priority: '0.6', lastmod: '2026-11-16', metaTitle: samplesPage.metaTitle, metaDescription: samplesPage.metaDescription },
  { path: pricingPage.path, priority: '0.6', lastmod: '2026-11-16', metaTitle: pricingPage.metaTitle, metaDescription: pricingPage.metaDescription },
  { path: '/gyik', priority: '0.5', lastmod: CONTENT_DATE, metaTitle: 'Gyakori kérdések az ipari felmérésről | Hatékony 3D felmérés', metaDescription: 'Pontosság, termelés melletti munka, földhivatali záradék, ár és fájlformátum. Őszinte válaszok, általános ígéret nélkül.' },
  { path: '/kapcsolat', priority: '0.7', lastmod: CONTENT_DATE, metaTitle: 'Projektigény és helyszíni egyeztetés | Hatékony 3D felmérés', metaDescription: 'Írja le, mit telepítenek vagy alakítanak át. A projektigényt rögzítjük, automatikus árat és szerződést nem küldünk.' },
  { path: '/cikkek', priority: '0.6', lastmod: CONTENT_DATE, metaTitle: 'Szakmai cikkek ipari felmérésről | Hatékony 3D felmérés', metaDescription: 'Géptelepítés előtti állapotfelmérés, terepi menet, szükséges adatok, helyszíni bizonytalanság és a pontfelhő ellenőrzése.' },
  { path: techPage.path, priority: '0.4', lastmod: '2026-11-16', metaTitle: techPage.metaTitle, metaDescription: techPage.metaDescription },
  { path: privacyPage().path, priority: '0.2', lastmod: CONTENT_DATE, metaTitle: privacyPage().metaTitle, metaDescription: privacyPage().metaDescription },
  { path: imprintPage().path, priority: '0.2', lastmod: CONTENT_DATE, metaTitle: imprintPage().metaTitle, metaDescription: imprintPage().metaDescription },
  { path: termsPage().path, priority: '0.2', lastmod: CONTENT_DATE, metaTitle: termsPage().metaTitle, metaDescription: termsPage().metaDescription },
];

const articleRoutes = articles.map((article) => ({
  path: `/cikkek/${article.slug}`,
  priority: '0.5',
  lastmod: article.modified || article.date,
  metaTitle: article.metaTitle,
  metaDescription: article.metaDescription,
}));

const routes = [...fixed, ...articleRoutes];

export function publicRoutes() {
  return routes.map(({ path, priority, lastmod }) => ({ path, priority, lastmod }));
}

export function metaCatalog() {
  return routes.map(({ path, metaTitle, metaDescription }) => ({ path, metaTitle, metaDescription }));
}

export function routeByPath(path) {
  return routes.find((route) => route.path === path);
}
