import { articles } from './articles.js';
import { privacyPage, imprintPage, termsPage } from './legal.js';
import { processPage, pricingPage, samplesPage, services, techPage } from './pages.js';

export const CONTENT_DATE = '2026-11-09';

export function publicRoutes() {
  const fixed = [
    { path: '/', priority: '1.0' },
    { path: services[0].path, priority: '0.9' },
    { path: services[1].path, priority: '0.9' },
    { path: services[2].path, priority: '0.9' },
    { path: processPage.path, priority: '0.8' },
    { path: samplesPage.path, priority: '0.7' },
    { path: pricingPage.path, priority: '0.8' },
    { path: '/gyik', priority: '0.6' },
    { path: '/kapcsolat', priority: '0.8' },
    { path: '/cikkek', priority: '0.6' },
    { path: techPage.path, priority: '0.4' },
    { path: privacyPage().path, priority: '0.3' },
    { path: imprintPage().path, priority: '0.3' },
    { path: termsPage().path, priority: '0.3' },
  ];
  const articleRoutes = articles.map((article) => ({
    path: `/cikkek/${article.slug}`,
    priority: '0.6',
  }));
  return [...fixed, ...articleRoutes];
}

const titled = [
  { path: '/', metaTitle: '3D felmérés ipari átépítéshez | Hatékony 3D felmérés', metaDescription: 'Meglévő terek rögzítése géptelepítéshez és átalakításhoz, az üzemi hozzáféréshez igazítva. Ipari üzemeltetőknek és kivitelezőknek.' },
  ...services.map((page) => ({ path: page.path, metaTitle: page.metaTitle, metaDescription: page.metaDescription })),
  { path: processPage.path, metaTitle: processPage.metaTitle, metaDescription: processPage.metaDescription },
  { path: samplesPage.path, metaTitle: samplesPage.metaTitle, metaDescription: samplesPage.metaDescription },
  { path: pricingPage.path, metaTitle: pricingPage.metaTitle, metaDescription: pricingPage.metaDescription },
  { path: '/gyik', metaTitle: 'Gyakori kérdések az ipari felmérésről | Hatékony 3D felmérés', metaDescription: 'Pontosság, termelés melletti munka, földhivatali záradék, ár és fájlformátum. Őszinte válaszok, általános ígéret nélkül.' },
  { path: '/kapcsolat', metaTitle: 'Projektigény és helyszíni egyeztetés | Hatékony 3D felmérés', metaDescription: 'Írja le, mit telepítenek vagy alakítanak át. A projektigényt rögzítjük, automatikus árat és szerződést nem küldünk.' },
  { path: '/cikkek', metaTitle: 'Szakmai cikkek ipari felmérésről | Hatékony 3D felmérés', metaDescription: 'Géptelepítés előtti állapotfelmérés, terepi menet, szükséges adatok, helyszíni bizonytalanság és a pontfelhő ellenőrzése.' },
  { path: techPage.path, metaTitle: techPage.metaTitle, metaDescription: techPage.metaDescription },
  { path: privacyPage().path, metaTitle: privacyPage().metaTitle, metaDescription: privacyPage().metaDescription },
  { path: imprintPage().path, metaTitle: imprintPage().metaTitle, metaDescription: imprintPage().metaDescription },
  { path: termsPage().path, metaTitle: termsPage().metaTitle, metaDescription: termsPage().metaDescription },
  ...articles.map((article) => ({ path: `/cikkek/${article.slug}`, metaTitle: article.metaTitle, metaDescription: article.metaDescription })),
];

export function metaCatalog() {
  return titled;
}
