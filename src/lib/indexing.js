import { PUBLIC_ORIGIN } from '../config.js';

export function absolutePublic(pathname = '/') {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${PUBLIC_ORIGIN}${path === '/' ? '/' : path}`;
}

export function canonicalRedirectTarget({ method = 'GET', host = '', proto = 'https', url = '/' } = {}) {
  if (method !== 'GET' && method !== 'HEAD') return null;
  const hostname = String(host).split(':')[0].toLowerCase();
  if (hostname !== 'hatekony3dfelmeres.hu' && hostname !== 'www.hatekony3dfelmeres.hu') return null;
  const scheme = String(proto).split(',')[0].trim().toLowerCase();
  if (hostname === 'hatekony3dfelmeres.hu' && scheme === 'https') return null;
  const path = String(url || '/');
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('://')) return null;
  return `https://hatekony3dfelmeres.hu${path}`;
}

export function robotsText(indexable) {
  if (!indexable) return 'User-agent: *\nDisallow: /\n';
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /projektigeny',
    'Disallow: /healthz',
    `Sitemap: ${absolutePublic('/sitemap.xml')}`,
    '',
  ].join('\n');
}

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  }[ch]));
}

export function sitemapXml(routes, indexable) {
  const urls = indexable ? routes.map((route) => [
    '  <url>',
    `    <loc>${escapeXml(absolutePublic(route.path))}</loc>`,
    `    <lastmod>${route.lastmod}</lastmod>`,
    `    <priority>${route.priority}</priority>`,
    '  </url>',
  ].join('\n')).join('\n') : '';
  const body = urls ? `\n${urls}\n` : '';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>\n`;
}
