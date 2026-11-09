import { config } from '../config.js';
import { articles, articleBySlug } from '../content/articles.js';
import { faqs, homeFaqs } from '../content/faq.js';
import { privacyPage, imprintPage, termsPage } from '../content/legal.js';
import { CONTENT_DATE, publicRoutes } from '../content/catalog.js';
import { pricingPage, processPage, samplesPage, services, techPage } from '../content/pages.js';
import { ACCURACY, COORDS, FILE_SIZES, INDUSTRIES, OUTPUTS, PROJECT_TYPES } from '../lib/options.js';
import { sendPage } from '../lib/render.js';
import { clientIp, issueFormToken, rateLimit, sameOrigin, signRef, verifyFormToken, verifyRef } from '../lib/security.js';
import { articleNode, breadcrumbNode, faqNode, graph, organizationNode, professionalServiceNode, serviceNode } from '../lib/seo.js';
import { validateLead } from '../lib/validate.js';
import { notifyLead } from '../lib/mail.js';

const FORM_OPTIONS = { INDUSTRIES, PROJECT_TYPES, OUTPUTS, COORDS, ACCURACY, FILE_SIZES };

function intentOf(req) {
  const raw = req.method === 'POST' ? req.body?.szandek : req.query?.szandek;
  return raw === 'egyeztetes' ? 'egyeztetes' : 'feladat';
}

function formBag(req, extra = {}) {
  return {
    formToken: issueFormToken(),
    values: extra.values || {},
    errors: extra.errors || {},
    intent: extra.intent || intentOf(req),
    returnTo: extra.returnTo,
    options: FORM_OPTIONS,
  };
}

function schemaCrumbs(crumbs, canonical) {
  return breadcrumbNode(crumbs.map((crumb, index) => ({
    name: crumb.name,
    url: index === crumbs.length - 1 ? canonical : `${config.siteUrl}${crumb.href || ''}`,
  })), canonical);
}

function renderHome(req, res, extra = {}) {
  const canonical = `${config.siteUrl}/`;
  sendPage(res, 'pages/home', {
    metaTitle: '3D felmérés ipari átépítéshez | Hatékony 3D felmérés',
    metaDescription: 'Meglévő terek rögzítése géptelepítéshez és átalakításhoz, az üzemi hozzáféréshez igazítva. Ipari üzemeltetőknek és kivitelezőknek.',
    canonical,
    jsonLd: graph([organizationNode(), professionalServiceNode(), faqNode(homeFaqs)]),
    services,
    faqs: homeFaqs,
    ...formBag(req, { returnTo: '/', ...extra }),
  });
}

function renderContact(req, res, extra = {}) {
  const canonical = `${config.siteUrl}/kapcsolat`;
  const crumbs = [{ name: 'Kapcsolat' }];
  sendPage(res, 'pages/contact', {
    metaTitle: 'Projektigény és helyszíni egyeztetés | Hatékony 3D felmérés',
    metaDescription: 'Írja le, mit telepítenek vagy alakítanak át. A projektigényt rögzítjük, automatikus árat és szerződést nem küldünk.',
    canonical,
    crumbs,
    jsonLd: graph([
      organizationNode(),
      professionalServiceNode(),
      schemaCrumbs(crumbs, canonical),
    ]),
    ...formBag(req, { returnTo: '/kapcsolat', ...extra }),
  });
}

function renderDocument(res, page, crumbs, withService = true, withSidebar = true) {
  const canonical = `${config.siteUrl}${page.path}`;
  sendPage(res, 'pages/document', {
    ...page,
    crumbs,
    withSidebar,
    canonical,
    jsonLd: graph([
      organizationNode(),
      professionalServiceNode(),
      withService ? serviceNode(page.h1, page.metaDescription, canonical) : null,
      schemaCrumbs(crumbs, canonical),
    ]),
  });
}

export function registerWeb(app, { db, logger }) {
  app.get('/healthz', (req, res) => {
    res.json({ ok: true, service: 'hatekony3dfelmeres', port: config.port });
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send([
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /projektigeny',
      `Sitemap: ${config.siteUrl}/sitemap.xml`,
      '',
    ].join('\n'));
  });

  app.get('/sitemap.xml', (req, res) => {
    const urls = publicRoutes().map((route) => [
      '  <url>',
      `    <loc>${config.siteUrl}${route.path}</loc>`,
      `    <lastmod>${CONTENT_DATE}</lastmod>`,
      `    <priority>${route.priority}</priority>`,
      '  </url>',
    ].join('\n')).join('\n');
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  });

  app.get('/', (req, res) => renderHome(req, res));

  for (const service of services) {
    app.get(service.path, (req, res) => {
      renderDocument(res, service, [{ name: service.cardTitle }]);
    });
  }

  app.get(processPage.path, (req, res) => {
    renderDocument(res, processPage, [{ name: 'Folyamat' }]);
  });

  app.get(samplesPage.path, (req, res) => {
    const canonical = `${config.siteUrl}${samplesPage.path}`;
    const crumbs = [{ name: 'Minta anyagok' }];
    sendPage(res, 'pages/samples', {
      ...samplesPage,
      crumbs,
      canonical,
      jsonLd: graph([
        organizationNode(),
        professionalServiceNode(),
        serviceNode(samplesPage.h1, samplesPage.metaDescription, canonical),
        schemaCrumbs(crumbs, canonical),
      ]),
    });
  });

  app.get(pricingPage.path, (req, res) => {
    renderDocument(res, pricingPage, [{ name: 'Árak' }]);
  });

  app.get('/gyik', (req, res) => {
    const canonical = `${config.siteUrl}/gyik`;
    const crumbs = [{ name: 'GYIK' }];
    sendPage(res, 'pages/faq', {
      metaTitle: 'Gyakori kérdések az ipari felmérésről | Hatékony 3D felmérés',
      metaDescription: 'Pontosság, termelés melletti munka, földhivatali záradék, ár és fájlformátum. Őszinte válaszok, általános ígéret nélkül.',
      canonical,
      crumbs,
      faqs,
      jsonLd: graph([
        organizationNode(),
        professionalServiceNode(),
        faqNode(faqs),
        schemaCrumbs(crumbs, canonical),
      ]),
    });
  });

  app.get('/kapcsolat', (req, res) => renderContact(req, res));

  app.get('/adatvedelem', (req, res) => {
    const page = privacyPage();
    renderDocument(res, page, [{ name: 'Adatvédelem' }], false, false);
  });

  app.get('/impresszum', (req, res) => {
    const page = imprintPage();
    renderDocument(res, page, [{ name: 'Impresszum' }], false, false);
  });

  app.get('/aszf', (req, res) => {
    const page = termsPage();
    renderDocument(res, page, [{ name: 'ÁSZF' }], false, false);
  });

  app.get('/technologia', (req, res) => {
    renderDocument(res, techPage, [{ name: 'Technológia' }], false);
  });

  app.get('/cikkek', (req, res) => {
    const canonical = `${config.siteUrl}/cikkek`;
    const crumbs = [{ name: 'Cikkek' }];
    sendPage(res, 'pages/articles', {
      metaTitle: 'Szakmai cikkek ipari felmérésről | Hatékony 3D felmérés',
      metaDescription: 'Géptelepítés előtti állapotfelmérés, terepi menet, szükséges adatok, helyszíni bizonytalanság és a pontfelhő ellenőrzése.',
      canonical,
      crumbs,
      articles,
      jsonLd: graph([organizationNode(), professionalServiceNode(), schemaCrumbs(crumbs, canonical)]),
    });
  });

  app.get('/cikkek/:slug', (req, res, next) => {
    const article = articleBySlug(req.params.slug);
    if (!article) return next();
    const canonical = `${config.siteUrl}/cikkek/${article.slug}`;
    const crumbs = [{ name: 'Cikkek', href: '/cikkek' }, { name: article.title }];
    sendPage(res, 'pages/article', {
      article,
      blocks: article.blocks,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      canonical,
      crumbs,
      ogType: 'article',
      jsonLd: graph([
        organizationNode(),
        professionalServiceNode(),
        articleNode(article, canonical),
        schemaCrumbs(crumbs, canonical),
      ]),
    });
  });

  app.post('/projektigeny', (req, res, next) => {
    (async () => {
    if (!sameOrigin(req)) {
      return sendPage(res, 'pages/message', {
        statusCode: 403,
        noindex: true,
        h1: 'A beküldést elutasítottuk',
        lede: 'Az űrlap nem erről az oldalról érkezett. Nyissa meg újra a kapcsolat oldalt, és onnan küldje el.',
        metaTitle: 'Beküldés elutasítva',
        metaDescription: 'A projektigény forrása nem egyezik az oldallal.',
        canonical: `${config.siteUrl}/projektigeny`,
        jsonLd: '',
      });
    }

    const ip = clientIp(req);
    if (!rateLimit(`lead:${ip}`, 5, 15 * 60 * 1000)) {
      return sendPage(res, 'pages/message', {
        statusCode: 429,
        noindex: true,
        h1: 'Túl sok beküldés',
        lede: 'Rövid idő alatt több projektigény érkezett erről a címről. Várjon, majd próbálja újra, vagy írjon e-mailt.',
        metaTitle: 'Túl sok beküldés',
        metaDescription: 'A projektigény űrlap átmenetileg korlátozva van.',
        canonical: `${config.siteUrl}/projektigeny`,
        jsonLd: '',
      });
    }

    const result = validateLead(req.body);
    const returnTo = req.body?.return_to === '/' ? '/' : '/kapcsolat';
    const intent = intentOf(req);
    if (result.spam) {
      logger.info('honeypot, nincs rogzites');
      return res.redirect(303, '/projektigeny/visszaigazolas');
    }
    if (!verifyFormToken(result.value.form_token)) {
      result.errors.form_token = 'Az űrlap lejárt. Töltse újra az oldalt, és küldje el még egyszer a projektigényt.';
      result.ok = false;
    }
    if (!result.ok) {
      const extra = { values: result.value, errors: result.errors, intent };
      return returnTo === '/' ? renderHome(req, res, extra) : renderContact(req, res, extra);
    }

    const saved = db.insertLead({
      ...result.value,
      source_domain: result.value.source_domain || req.hostname,
      source_url: result.value.source_url || req.get('referer') || `${config.siteUrl}${returnTo}`,
      referrer: String(req.get('referer') || '').replace(/[\u0000-\u001F]/g, '').slice(0, 500),
      gdpr_consent: 1,
      status: 'uj',
      client_ip: ip,
      user_agent: String(req.get('user-agent') || '').slice(0, 300),
      email_status: 'pending',
      email_error: '',
    });
    const lead = db.getLead(saved.id);
    const mail = await notifyLead(lead, logger);
    db.setEmailStatus(saved.id, mail.status, mail.error);
    logger.info(`projektigeny rogzitve: ${saved.public_ref} level=${mail.status}`);
    const signature = signRef(saved.public_ref);
    return res.redirect(303, `/projektigeny/visszaigazolas?ref=${encodeURIComponent(saved.public_ref)}&s=${signature}`);
    })().catch(next);
  });

  app.get('/projektigeny/visszaigazolas', (req, res) => {
    const ref = typeof req.query.ref === 'string' ? req.query.ref : '';
    const valid = verifyRef(ref, req.query.s);
    sendPage(res, 'pages/thanks', {
      noindex: true,
      ref: valid ? ref : '',
      metaTitle: valid ? 'Projektigény rögzítve | Hatékony 3D felmérés' : 'Beküldés | Hatékony 3D felmérés',
      metaDescription: 'A projektigény rögzítésének visszaigazolása. Automatikus árat és szerződést nem küldünk.',
      canonical: `${config.siteUrl}/projektigeny/visszaigazolas`,
      jsonLd: '',
    });
  });
}
