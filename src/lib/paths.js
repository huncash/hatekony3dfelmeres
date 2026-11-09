import path from 'node:path';

export function resolveDatabasePath(root, databaseUrl) {
  const raw = databaseUrl || 'file:./data/leads.sqlite';
  let spec = raw.startsWith('file:') ? raw.slice('file:'.length) : raw;
  if (spec.startsWith('//')) spec = spec.slice(2);
  if (/^\/[A-Za-z]:\//.test(spec)) spec = spec.slice(1);
  return path.resolve(root, spec);
}

export function telHref(phone) {
  const compact = String(phone || '').replace(/[^\d+]/g, '');
  return compact ? `tel:${compact}` : '';
}
