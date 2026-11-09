import { ACCURACY, COORDS, FILE_SIZES, INDUSTRIES, OUTPUTS, PROJECT_TYPES } from './options.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+()/\s.-]{6,40}$/;

function oneLine(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function multiLine(value, max) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

function oneOf(list, value) {
  const code = oneLine(value, 40);
  return list.some(([item]) => item === code) ? code : '';
}

function manyOf(list, value) {
  const raw = Array.isArray(value) ? value : (value ? [value] : []);
  const allowed = new Set(list.map(([code]) => code));
  const picked = [];
  for (const item of raw) {
    const code = oneLine(item, 40);
    if (allowed.has(code) && !picked.includes(code)) picked.push(code);
  }
  return picked.join('|');
}

export function validateLead(body) {
  const source = body || {};
  const value = {
    company_name: oneLine(source.company_name, 160),
    contact_name: oneLine(source.contact_name, 120),
    email: oneLine(source.email, 160).toLowerCase(),
    phone: oneLine(source.phone, 40),
    industry: oneOf(INDUSTRIES, source.industry),
    project_type: oneOf(PROJECT_TYPES, source.project_type),
    location: oneLine(source.location, 200),
    schedule: oneLine(source.schedule, 300),
    access_window: oneLine(source.access_window, 300),
    requested_output: manyOf(OUTPUTS, source.requested_output),
    coordinate_system: oneOf(COORDS, source.coordinate_system),
    accuracy_need: oneOf(ACCURACY, source.accuracy_need),
    file_size: oneOf(FILE_SIZES, source.file_size),
    note: multiLine(source.note, 4000),
    gdpr: source.gdpr === 'igen',
    honeypot: oneLine(source.company_website, 200),
    source_url: oneLine(source.source_url, 500),
    source_domain: oneLine(source.source_domain, 120),
    utm_source: oneLine(source.utm_source, 120),
    utm_medium: oneLine(source.utm_medium, 120),
    utm_campaign: oneLine(source.utm_campaign, 120),
    utm_term: oneLine(source.utm_term, 120),
    utm_content: oneLine(source.utm_content, 120),
    form_token: oneLine(source.form_token, 200),
  };

  const errors = {};
  if (value.honeypot) return { ok: false, spam: true, errors, value };
  if (value.company_name.length < 2) errors.company_name = 'Adja meg a cég nevét.';
  if (value.contact_name.length < 2) errors.contact_name = 'Adja meg a kapcsolattartó nevét.';
  if (!EMAIL.test(value.email)) errors.email = 'Adjon meg egy használható e-mail-címet.';
  if (!PHONE.test(value.phone)) errors.phone = 'Adjon meg egy telefonszámot, amelyen elérjük.';
  if (!value.gdpr) errors.gdpr = 'A projektigény rögzítéséhez a tájékoztató elfogadása szükséges.';

  return { ok: Object.keys(errors).length === 0, spam: false, errors, value };
}
