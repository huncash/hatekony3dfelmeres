import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { articles } from '../src/content/articles.js';
import { instrumentRecords, isCompleteRecord, publicSpeedClaims } from '../src/content/instruments.js';
import { pricingPage, services, techPage } from '../src/content/pages.js';
import { config } from '../src/config.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const home = fs.readFileSync(path.join(root, 'views/pages/home.ejs'), 'utf8');

function textOf(value) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(textOf).join(' ');
  if (value && typeof value === 'object') return `${value.label || ''} ${value.text || ''} ${textOf(value.paragraphs)} ${textOf(value.items)} ${textOf(value.rows)}`;
  return '';
}

const publicCopy = [
  home,
  ...services.map((service) => `${service.cardTitle} ${service.cardText}`),
  textOf(techPage.blocks),
  textOf(pricingPage.blocks),
].join('\n');

test('a port 8000 marad', () => {
  assert.equal(config.port, 8000);
});

test('jóváhagyás nélkül nincs publikus sebességi állítás', () => {
  assert.deepEqual(publicSpeedClaims(), []);
  const blocked = [
    '2 millió',
    '1 millió pont',
    '500 ezer',
    '2,2 millió',
    'minimum 2 millió',
    'képpont',
    'ötször gyorsabb',
    '±1 mm',
  ];
  for (const phrase of blocked) {
    assert.equal(publicCopy.includes(phrase), false, phrase);
  }
  assert.equal(isCompleteRecord({ ...instrumentRecords[0], checkedOn: '' }), false);
  assert.deepEqual(publicSpeedClaims([{
    instrument: 'Példa',
    configuration: 'nincs',
    facts: 'adat',
    unit: 'pont/s',
    conditions: 'feltétel',
    source: 'https://example.com',
    sourceLabel: 'Példa',
    checkedOn: '2026-11-16',
    accessConfirmed: false,
    publishApproved: true,
    publicText: 'Nem sebesség.',
    claims: [{ kind: 'speed', text: 'Akár 2 millió mért pont másodpercenként.', approved: true }],
  }]), []);
});

test('a fő CTA a saját űrlaphoz vezet, a működő üzemi cikk él', () => {
  assert.match(home, /href="#kapcsolat"/);
  assert.match(home, /Felmérést egyeztetek/);
  assert.match(home, /id="kapcsolat"/);
  assert.match(home, /href="\/cikkek\/3d-felmeres-mukodo-uzemben"/);
  assert.ok(articles.some((article) => article.slug === '3d-felmeres-mukodo-uzemben'));
});

test('nincs új nulla leállási ígéret és nincs tárgyszkennelési ajánlat', () => {
  assert.equal(/nulla termeléskiesést vállal/i.test(publicCopy), false);
  assert.equal(/garantált(an)? nulla/i.test(publicCopy), false);
  assert.equal(/alkatrészszkennel/i.test(publicCopy), false);
  assert.equal(/reverse engineering/i.test(publicCopy), false);
});
