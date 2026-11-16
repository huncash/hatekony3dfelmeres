import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from '../src/content/articles.js';
import { metaCatalog, publicRoutes } from '../src/content/catalog.js';
import { config, PUBLIC_ORIGIN } from '../src/config.js';
import { absolutePublic, canonicalRedirectTarget, robotsText, sitemapXml } from '../src/lib/indexing.js';
import { articleNode, breadcrumbNode, graph, organizationNode, serviceNode, websiteNode } from '../src/lib/seo.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function pngSize(file) {
  const buf = fs.readFileSync(file);
  assert.equal(buf.readUInt32BE(0), 0x89504e47);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

test('a publikus cím nem tartalmaz belső hostot vagy portot', () => {
  assert.equal(PUBLIC_ORIGIN, 'https://hatekony3dfelmeres.hu');
  assert.equal(PUBLIC_ORIGIN.includes(':8000'), false);
  assert.equal(/localhost|127\.0\.0\.1/.test(PUBLIC_ORIGIN), false);
  assert.equal(absolutePublic('/og.png'), 'https://hatekony3dfelmeres.hu/og.png');
  assert.equal(absolutePublic('/').includes('?'), false);
  assert.equal(config.indexable, false);
});

test('a kanonikus host csak a nyilvános domaint írja át', () => {
  assert.equal(canonicalRedirectTarget({ host: '127.0.0.1:8000', proto: 'http', url: '/' }), null);
  assert.equal(canonicalRedirectTarget({ host: 'localhost:8000', proto: 'http', url: '/arak' }), null);
  assert.equal(
    canonicalRedirectTarget({ host: 'www.hatekony3dfelmeres.hu', proto: 'https', url: '/arak?utm_source=level' }),
    'https://hatekony3dfelmeres.hu/arak?utm_source=level',
  );
  assert.equal(
    canonicalRedirectTarget({ host: 'hatekony3dfelmeres.hu', proto: 'http', url: '/' }),
    'https://hatekony3dfelmeres.hu/',
  );
  assert.equal(canonicalRedirectTarget({ host: 'hatekony3dfelmeres.hu', proto: 'https', url: '/' }), null);
  assert.equal(canonicalRedirectTarget({ method: 'POST', host: 'www.hatekony3dfelmeres.hu', proto: 'http', url: '/projektigeny' }), null);
  assert.equal(canonicalRedirectTarget({ host: 'hatekony3dfelmeres.hu', proto: 'http', url: '//evil.example' }), null);
});

test('a sitemap csak indexelhető publikus címet ad, valós lastmoddal', () => {
  const routes = publicRoutes();
  const closed = sitemapXml(routes, false);
  assert.equal(closed.includes('<loc>'), false);
  assert.equal(robotsText(false).includes('Disallow: /'), true);
  const open = sitemapXml(routes, true);
  assert.equal(open.includes('https://hatekony3dfelmeres.hu/'), true);
  assert.equal(open.includes('/admin'), false);
  assert.equal(open.includes('/projektigeny'), false);
  assert.equal(open.includes('127.0.0.1'), false);
  assert.equal(open.includes(':8000'), false);
  assert.equal(robotsText(true).includes('Disallow: /admin'), true);
  assert.equal(robotsText(true).includes('Sitemap: https://hatekony3dfelmeres.hu/sitemap.xml'), true);
  const dates = new Set(articles.filter((article) => article.slug !== '3d-felmeres-mukodo-uzemben').map((article) => article.date));
  assert.deepEqual([...dates], ['2026-11-09']);
  for (const route of routes) {
    assert.match(route.lastmod, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(route.lastmod <= '2026-11-16', route.path);
    assert.equal(route.path.startsWith('/admin'), false);
  }
  const plant = routes.find((route) => route.path === '/cikkek/3d-felmeres-mukodo-uzemben');
  assert.equal(plant.lastmod, '2026-11-16');
});

test('a strukturált adat a valós szervezet, érvényes JSON, értékelés nélkül', () => {
  const article = articles.find((item) => item.slug === '3d-felmeres-mukodo-uzemben');
  const canonical = absolutePublic(`/cikkek/${article.slug}`);
  const raw = graph([
    organizationNode(),
    websiteNode(),
    serviceNode('Ipari 3D térfelmérés', metaCatalog()[0].metaDescription, absolutePublic('/')),
    articleNode(article, canonical),
    breadcrumbNode([{ name: article.title }], canonical),
  ]);
  const data = JSON.parse(raw);
  const types = data['@graph'].map((node) => node['@type']);
  assert.deepEqual(types, ['Organization', 'WebSite', 'Service', 'Article', 'BreadcrumbList']);
  const org = data['@graph'][0];
  assert.equal(org.name, 'ADP-TOP Kft.');
  assert.equal(org.legalName.includes('ADP-TOP'), true);
  assert.equal(JSON.stringify(data).includes('openingHours'), false);
  assert.equal(JSON.stringify(data).includes('LocalBusiness'), false);
  assert.equal(JSON.stringify(data).includes('Review'), false);
  assert.equal(JSON.stringify(data).includes('127.0.0.1'), false);
  assert.equal(data['@graph'][3].datePublished, '2026-11-09');
  assert.equal(data['@graph'][3].dateModified, '2026-11-16');
  assert.equal(data['@graph'][3].image, 'https://hatekony3dfelmeres.hu/images/og-mukodo-uzem.png');
  assert.equal(data['@graph'][1].inLanguage, 'hu-HU');
});

test('a favicon és a borítók a várt méretű fájlok', () => {
  assert.deepEqual(pngSize(path.join(root, 'public/og.png')), { width: 1200, height: 630 });
  assert.deepEqual(pngSize(path.join(root, 'public/images/og-mukodo-uzem.png')), { width: 1200, height: 630 });
  assert.deepEqual(pngSize(path.join(root, 'public/favicon-32.png')), { width: 32, height: 32 });
  assert.deepEqual(pngSize(path.join(root, 'public/apple-touch-icon.png')), { width: 180, height: 180 });
  assert.deepEqual(pngSize(path.join(root, 'public/favicon-512.png')), { width: 512, height: 512 });
  const ico = fs.readFileSync(path.join(root, 'public/favicon.ico'));
  assert.equal(ico.readUInt16LE(0), 0);
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(fs.existsSync(path.join(root, 'public/favicon.svg')), true);
});

test('a belső oldalhivatkozások léteznek, és nincs árva publikus út', () => {
  const files = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      if (name === 'node_modules' || name === 'data') continue;
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (/\.(ejs|js)$/.test(name)) files.push(full);
    }
  }
  walk(path.join(root, 'views'));
  walk(path.join(root, 'src'));
  const text = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  const paths = new Set(publicRoutes().map((route) => route.path));
  const found = new Set();
  for (const match of text.matchAll(/href(?:=|:)\s*["'](\/[a-z0-9./-]*)/g)) {
    let target = match[1] || '/';
    if (target.length > 1) target = target.replace(/\/+$/, '');
    if (target.startsWith('/admin') || target.startsWith('/projektigeny') || target.startsWith('/css') || target.startsWith('/js') || target.startsWith('/images') || target.startsWith('/favicon') || target === '/og.png' || target === '/apple-touch-icon.png' || target === '/sitemap.xml' || target === '/robots.txt') continue;
    assert.equal(paths.has(target), true, target);
    found.add(target);
  }
  for (const route of paths) {
    if (route.startsWith('/cikkek/') && route !== '/cikkek') {
      assert.match(text, /\/cikkek\//);
      continue;
    }
    assert.equal(text.includes(`"${route}"`) || text.includes(`'${route}'`) || text.includes(`href="${route}"`), true, route);
  }
  assert.equal(found.has('/geptelepites-elokeszites'), true);
  assert.equal(metaCatalog().some((page) => page.metaTitle === 'Ipari 3D térfelmérés | Hatékony 3D felmérés'), true);
  const removed = [
    'kimenet-pontfelho.svg',
    'kimenet-jegyzek.svg',
    'kimenet-munkacsomag.svg',
    'csarnok-vazlat.svg',
  ];
  for (const name of removed) {
    assert.equal(text.includes(name), false, name);
    assert.equal(fs.existsSync(path.join(root, 'public/images', name)), false, name);
  }
  assert.equal(text.includes('photo-slot'), false);
});
