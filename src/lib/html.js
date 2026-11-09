const ESCAPE = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ESCAPE[ch]);
}

export function inlineHtml(parts) {
  const list = Array.isArray(parts) ? parts : [parts];
  return list.map((part) => {
    if (part == null) return '';
    if (typeof part === 'string') return escapeHtml(part);
    if (typeof part === 'object' && part.href && part.label) {
      const href = String(part.href);
      const safe = href.startsWith('/') || href.startsWith('https://') || href.startsWith('http://') || href.startsWith('mailto:');
      if (!safe) return escapeHtml(part.label);
      const external = href.startsWith('http');
      const rel = external ? ' rel="noopener noreferrer"' : '';
      return `<a href="${escapeHtml(href)}"${rel}>${escapeHtml(part.label)}</a>`;
    }
    return '';
  }).join('');
}

export function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
