import fs from 'node:fs';
import path from 'node:path';

function csvCell(value) {
  const raw = value == null ? '' : String(value);
  const guarded = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${guarded.replace(/"/g, '""')}"`;
}

export function toCsv(headers, rows) {
  const lines = [headers.map(csvCell).join(';')];
  for (const row of rows) lines.push(row.map(csvCell).join(';'));
  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

export function campaignText(lead) {
  const parts = [
    ['utm_source', lead.utm_source],
    ['utm_medium', lead.utm_medium],
    ['utm_campaign', lead.utm_campaign],
    ['utm_term', lead.utm_term],
    ['utm_content', lead.utm_content],
  ].filter(([, value]) => value);
  return parts.map(([key, value]) => `${key}=${value}`).join('; ');
}

export function writeOutbox(dir, ref, text) {
  fs.mkdirSync(dir, { recursive: true });
  const safe = String(ref || 'lead').replace(/[^\w.-]+/g, '_');
  const file = path.join(dir, `${safe}.txt`);
  fs.writeFileSync(file, text, 'utf8');
  return file;
}
