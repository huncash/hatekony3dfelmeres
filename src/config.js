import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(root, '.env') });

function stripSlash(url) {
  return String(url || '').replace(/\/+$/, '');
}

function flag(value, fallback = false) {
  if (value == null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function verificationToken(value) {
  const text = String(value || '').trim();
  return /^[A-Za-z0-9_-]{8,128}$/.test(text) ? text : '';
}

export const PUBLIC_ORIGIN = 'https://hatekony3dfelmeres.hu';

function isProductionOrigin(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'hatekony3dfelmeres.hu' && url.port === '';
  } catch {
    return false;
  }
}

const port = Number(process.env.PORT || 8000);

export const config = {
  root,
  siteName: process.env.SITE_NAME || 'Hatékony 3D felmérés',
  siteUrl: stripSlash(process.env.SITE_URL || 'https://hatekony3dfelmeres.hu'),
  port,
  host: process.env.HOST || '127.0.0.1',
  databaseUrl: process.env.DATABASE_URL || 'file:./data/leads.sqlite',
  contactEmail: process.env.CONTACT_EMAIL || 'info@hatekony3dfelmeres.hu',
  phone: process.env.COMPANY_PHONE || '+36 30 667 2510',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: flag(process.env.SMTP_SECURE, Number(process.env.SMTP_PORT) === 465),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || process.env.CONTACT_EMAIL || 'info@hatekony3dfelmeres.hu',
  },
  adminToken: process.env.ADMIN_TOKEN || '',
  sessionSecret: process.env.SESSION_SECRET || process.env.ADMIN_TOKEN || '',
  company: {
    legalName: process.env.COMPANY_LEGAL_NAME || 'ADP-TOP Kereskedelmi és Szolgáltató Korlátolt Felelősségű Társaság',
    shortName: process.env.COMPANY_SHORT_NAME || 'ADP-TOP Kft.',
    seat: process.env.COMPANY_SEAT || '1116 Budapest, Híradó utca 29.',
    street: process.env.COMPANY_STREET || 'Híradó utca 29.',
    postal: process.env.COMPANY_POSTAL || '1116',
    city: process.env.COMPANY_CITY || 'Budapest',
    taxId: process.env.COMPANY_TAX_ID || '13777164-2-43',
    euTaxId: process.env.COMPANY_EU_TAX_ID || 'HU13777164',
    regNo: process.env.COMPANY_REG_NO || '01-09-872622',
    court: process.env.COMPANY_COURT || 'Fővárosi Törvényszék Cégbírósága',
    mainActivity: process.env.COMPANY_MAIN_ACTIVITY || '4712 – Iparcikk jellegű vegyes kiskereskedelem',
  },
  hostingNote: process.env.HOSTING_NOTE || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  contentDate: '2026-11-09',
  indexable: (process.env.NODE_ENV === 'production')
    && flag(process.env.ALLOW_INDEX, false)
    && isProductionOrigin(stripSlash(process.env.SITE_URL || PUBLIC_ORIGIN)),
  googleSiteVerification: verificationToken(process.env.GOOGLE_SITE_VERIFICATION),
  bingSiteVerification: verificationToken(process.env.BING_SITE_VERIFICATION),
};

export function assertRuntime() {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 22 || (major === 22 && minor < 5)) {
    console.error('Node.js 22.5 vagy újabb szükséges a beépített sqlite modulhoz.');
    process.exit(1);
  }
  if (!Number.isInteger(config.port) || config.port !== 8000) {
    console.error(`Ez az alkalmazás kizárólag a 8000-es porton indul. PORT=${process.env.PORT || '(üres)'}.`);
    console.error('Másik portot nem választok. Állítsa a PORT értékét 8000-re, vagy döntsön a következő lépésről.');
    process.exit(1);
  }
  if (config.nodeEnv === 'production') {
    try {
      const host = new URL(config.siteUrl).host.replace(/^www\./, '');
      if (host !== 'hatekony3dfelmeres.hu') {
        console.warn(`Figyelem: éles környezetben a SITE_URL (${config.siteUrl}) nem a hatekony3dfelmeres.hu.`);
      }
    } catch {
      console.warn('Figyelem: a SITE_URL nem érvényes abszolút cím.');
    }
    if (!config.adminToken) {
      console.warn('Figyelem: az ADMIN_TOKEN üres, az admin felület kikapcsolva marad.');
    }
    if (!config.smtp.host) {
      console.warn('Figyelem: az SMTP_HOST üres. Az értesítő levél a data/outbox mappába kerül.');
    }
  }
}
