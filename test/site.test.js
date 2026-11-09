import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { articles } from '../src/content/articles.js';
import { metaCatalog, publicRoutes } from '../src/content/catalog.js';
import { toCsv } from '../src/lib/csv.js';
import { openDatabase } from '../src/lib/db.js';
import { resolveDatabasePath } from '../src/lib/paths.js';
import { issueFormToken, verifyFormToken, verifyRef, signRef } from '../src/lib/security.js';
import { validateLead } from '../src/lib/validate.js';

const validBody = {
  company_name: 'Minta Üzem Kft.',
  contact_name: 'Kiss Anna',
  email: 'anna@minta-uzem.hu',
  phone: '+36 30 555 0199',
  industry: 'gepesgyartas',
  project_type: 'geptelepites',
  location: 'Győr, 2. csarnok',
  schedule: 'jövő negyedév',
  access_window: 'délelőtti műszakváltás',
  requested_output: ['pontfelho', 'munkacsomag'],
  coordinate_system: 'nincs',
  accuracy_need: 'feladat',
  file_size: 'nem-tudni',
  note: 'Prés érkezik a 4. tengelyhez.',
  gdpr: 'igen',
  company_website: '',
  form_token: 'ignored-here',
};

test('a projektigény kötelező mezői', () => {
  const result = validateLead(validBody);
  assert.equal(result.ok, true);
  assert.equal(result.value.requested_output, 'pontfelho|munkacsomag');
  const missing = validateLead({ ...validBody, email: 'nem-email', gdpr: '' });
  assert.equal(missing.ok, false);
  assert.ok(missing.errors.email);
  assert.ok(missing.errors.gdpr);
});

test('a honeypot kéretlen beküldés', () => {
  const result = validateLead({ ...validBody, company_website: 'https://spam.example' });
  assert.equal(result.spam, true);
  assert.equal(result.ok, false);
});

test('a csv képletet nem indít', () => {
  const csv = toCsv(['cég'], [['=parancs']]);
  assert.match(csv, /"'=parancs"/);
  assert.ok(csv.charCodeAt(0) === 0xfeff);
});

test('az adatfájl a projekt gyökeréhez képest oldódik fel', () => {
  const root = path.resolve('/srv/site-8');
  assert.equal(resolveDatabasePath(root, 'file:./data/leads.sqlite'), path.resolve(root, 'data/leads.sqlite'));
  assert.equal(resolveDatabasePath(root, 'file:///var/lib/h3df/leads.sqlite'), path.resolve('/var/lib/h3df/leads.sqlite'));
});

test('űrlaptoken és azonosító aláírás', () => {
  const token = issueFormToken(Date.now() - 5000);
  assert.equal(verifyFormToken(token), true);
  assert.equal(verifyFormToken('rossz'), false);
  const ref = 'H3D-2026-00001';
  assert.equal(verifyRef(ref, signRef(ref)), true);
  assert.equal(verifyRef(ref, 'mas'), false);
});

test('a projektigény körbeér az adatbázisban', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'h3df-'));
  const db = openDatabase(path.join(dir, 'leads.sqlite'));
  const saved = db.insertLead({
    source_domain: 'hatekony3dfelmeres.hu',
    source_url: 'https://hatekony3dfelmeres.hu/kapcsolat',
    referrer: '',
    utm_source: 'level',
    utm_medium: 'email',
    utm_campaign: 'tavasz',
    utm_term: '',
    utm_content: '',
    company_name: 'Minta Üzem Kft.',
    contact_name: 'Kiss Anna',
    email: 'anna@minta-uzem.hu',
    phone: '+36 30 555 0199',
    industry: 'gepesgyartas',
    project_type: 'geptelepites',
    location: 'Győr',
    schedule: '',
    access_window: '',
    requested_output: 'pontfelho',
    coordinate_system: 'nincs',
    accuracy_need: 'feladat',
    file_size: '',
    note: 'Megjegyzés',
    gdpr_consent: 1,
    status: 'uj',
    client_ip: '127.0.0.1',
    user_agent: 'test',
    email_status: 'outbox',
    email_error: '',
  });
  assert.match(saved.public_ref, /^H3D-\d{4}-\d{5}$/);
  const row = db.getLead(saved.id);
  assert.equal(row.company_name, 'Minta Üzem Kft.');
  assert.equal(db.updateStatus(saved.id, 'egyeztetes'), 1);
  assert.equal(db.getLead(saved.id).status, 'egyeztetes');
  db.close();
});

test('egyedi meta és élő belső hivatkozás', () => {
  const pages = metaCatalog();
  const titles = new Set();
  const descriptions = new Set();
  for (const page of pages) {
    assert.equal(titles.has(page.metaTitle), false, page.metaTitle);
    assert.equal(descriptions.has(page.metaDescription), false, page.metaDescription);
    titles.add(page.metaTitle);
    descriptions.add(page.metaDescription);
    assert.ok(page.metaTitle.length <= 70, `${page.path} cím ${page.metaTitle.length}: ${page.metaTitle}`);
    assert.ok(page.metaDescription.length >= 80 && page.metaDescription.length <= 175, `${page.path} leírás ${page.metaDescription.length}: ${page.metaDescription}`);
  }
  const paths = new Set(publicRoutes().map((route) => route.path));
  for (const article of articles) {
    assert.equal(paths.has(`/cikkek/${article.slug}`), true);
    for (const link of article.related) assert.equal(paths.has(link.href), true, link.href);
  }
  assert.equal(articles.length >= 6, true);
});
