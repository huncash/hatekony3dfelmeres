export function formatStamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || '');
  return new Intl.DateTimeFormat('hu-HU', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Budapest',
  }).format(date);
}

export function formatDay(value) {
  const raw = String(value || '');
  const date = new Date(raw.length === 10 ? `${raw}T12:00:00+01:00` : raw);
  if (Number.isNaN(date.getTime())) return raw;
  return new Intl.DateTimeFormat('hu-HU', {
    dateStyle: 'long',
    timeZone: 'Europe/Budapest',
  }).format(date);
}
