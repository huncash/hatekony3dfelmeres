import { config } from '../config.js';
import { absolutePublic } from '../lib/indexing.js';
import { campaignText, toCsv } from '../lib/csv.js';
import { ACCURACY, COORDS, FILE_SIZES, INDUSTRIES, OUTPUTS, PROJECT_TYPES, STATUSES, labelOf, labelsOf, statusLabel } from '../lib/options.js';
import { sendPage } from '../lib/render.js';
import { clearSessionCookie, clientIp, createSession, rateLimit, readCookie, readSession, sameOrigin, setSessionCookie, tokenMatches } from '../lib/security.js';

function filtersFrom(req) {
  const status = STATUSES.some(([code]) => code === req.query.status) ? String(req.query.status) : '';
  const q = String(req.query.q || '').replace(/[\u0000-\u001F]/g, '').trim().slice(0, 80);
  const includeSpam = req.query.all === '1';
  return { status, q, includeSpam };
}

function exportHref(filters) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.q) params.set('q', filters.q);
  if (filters.includeSpam) params.set('all', '1');
  const query = params.toString();
  return `/admin/export.csv${query ? `?${query}` : ''}`;
}

function requireAdmin(req, res, next) {
  if (!config.adminToken) return res.redirect('/admin/belepes');
  const session = readSession(readCookie(req));
  if (!session) return res.redirect('/admin/belepes');
  req.admin = session;
  next();
}

function adminMeta(path) {
  return {
    noindex: true,
    metaTitle: 'Nyilvántartás | Hatékony 3D felmérés',
    metaDescription: 'A projektigények zárt nyilvántartása.',
    canonical: absolutePublic(path),
    jsonLd: '',
  };
}

function detailFields(lead) {
  return [
    ['Beküldés időpontja', lead.created_at],
    ['Forrásdomain', lead.source_domain],
    ['Forrás URL', lead.source_url],
    ['Hivatkozó', lead.referrer],
    ['Kampány / UTM', campaignText(lead)],
    ['Cég neve', lead.company_name],
    ['Kapcsolattartó', lead.contact_name],
    ['E-mail', lead.email],
    ['Telefon', lead.phone],
    ['Iparág', labelOf(INDUSTRIES, lead.industry)],
    ['Projekt típusa', labelOf(PROJECT_TYPES, lead.project_type)],
    ['Helyszín', lead.location],
    ['Tervezett ütemezés', lead.schedule],
    ['Hozzáférési időablak', lead.access_window],
    ['Kért kimenet', labelsOf(OUTPUTS, lead.requested_output)],
    ['Koordinátarendszer', labelOf(COORDS, lead.coordinate_system)],
    ['Pontossági igény', labelOf(ACCURACY, lead.accuracy_need)],
    ['Fájlméret', labelOf(FILE_SIZES, lead.file_size)],
    ['Státusz', statusLabel(lead.status)],
    ['GDPR hozzájárulás', lead.gdpr_consent ? 'igen' : 'nem'],
    ['E-mail állapot', lead.email_status],
    ['E-mail hiba', lead.email_error],
    ['IP-cím', lead.client_ip],
  ].map(([label, value]) => ({ label, value }));
}

function csvRows(leads) {
  return leads.map((lead) => [
    lead.public_ref,
    lead.created_at,
    lead.source_domain,
    lead.source_url,
    campaignText(lead),
    lead.utm_source,
    lead.utm_medium,
    lead.utm_campaign,
    lead.utm_term,
    lead.utm_content,
    lead.company_name,
    lead.contact_name,
    lead.email,
    lead.phone,
    labelOf(INDUSTRIES, lead.industry),
    labelOf(PROJECT_TYPES, lead.project_type),
    lead.location,
    lead.schedule,
    lead.access_window,
    labelsOf(OUTPUTS, lead.requested_output),
    labelOf(COORDS, lead.coordinate_system),
    labelOf(ACCURACY, lead.accuracy_need),
    labelOf(FILE_SIZES, lead.file_size),
    lead.note,
    statusLabel(lead.status),
  ]);
}

export function registerAdmin(app, { db }) {
  app.get('/admin/belepes', (req, res) => {
    if (config.adminToken && readSession(readCookie(req))) return res.redirect('/admin');
    sendPage(res, 'pages/admin-login', {
      ...adminMeta('/admin/belepes'),
      disabled: !config.adminToken,
      error: '',
      statusCode: config.adminToken ? 200 : 503,
    });
  });

  app.post('/admin/belepes', (req, res) => {
    if (!config.adminToken) return res.redirect('/admin/belepes');
    if (!sameOrigin(req)) return res.status(403).type('html').send('A belépés forrása nem egyezik az oldallal.');
    const ip = clientIp(req);
    if (!rateLimit(`admin:${ip}`, 8, 15 * 60 * 1000)) {
      return sendPage(res, 'pages/admin-login', {
        ...adminMeta('/admin/belepes'),
        disabled: false,
        error: 'Túl sok próbálkozás. Várjon, majd próbálja újra.',
        statusCode: 429,
      });
    }
    if (!tokenMatches(req.body?.token)) {
      return sendPage(res, 'pages/admin-login', {
        ...adminMeta('/admin/belepes'),
        disabled: false,
        error: 'A belépés nem sikerült.',
        statusCode: 401,
      });
    }
    const session = createSession();
    setSessionCookie(res, req, session.token);
    return res.redirect('/admin');
  });

  app.post('/admin/kilepes', requireAdmin, (req, res) => {
    if (!sameOrigin(req) || req.body?.csrf !== req.admin.csrf) return res.status(403).type('html').send('A kilépést elutasítottuk.');
    clearSessionCookie(res, req);
    res.redirect('/admin/belepes');
  });

  app.get('/admin', requireAdmin, (req, res) => {
    const filters = filtersFrom(req);
    sendPage(res, 'pages/admin-list', {
      ...adminMeta('/admin'),
      leads: db.listLeads(filters),
      counts: db.statusCounts(),
      statuses: STATUSES,
      statusLabel,
      projectLabel: (code) => labelOf(PROJECT_TYPES, code),
      csrf: req.admin.csrf,
      smtpOn: Boolean(config.smtp.host),
      exportHref: exportHref(filters),
      ...filters,
    });
  });

  app.get('/admin/export.csv', requireAdmin, (req, res) => {
    const filters = filtersFrom(req);
    const csv = toCsv([
      'azonosító',
      'beküldés időpontja',
      'forrásdomain',
      'forrás URL',
      'campaign/UTM',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'cég neve',
      'kapcsolattartó',
      'e-mail',
      'telefon',
      'iparág',
      'projekt típusa',
      'helyszín',
      'tervezett ütemezés',
      'hozzáférési időablak',
      'kért kimenet',
      'koordinátarendszer',
      'pontossági igény',
      'fájlméret',
      'megjegyzés',
      'státusz',
    ], csvRows(db.listLeads(filters)));
    const day = new Date().toISOString().slice(0, 10);
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="projektigenyek-${day}.csv"`);
    res.send(csv);
  });

  app.get('/admin/igeny/:id', requireAdmin, (req, res, next) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return next();
    const lead = db.getLead(id);
    if (!lead) return next();
    sendPage(res, 'pages/admin-detail', {
      ...adminMeta(`/admin/igeny/${id}`),
      lead,
      fields: detailFields(lead),
      statuses: STATUSES,
      statusLabel,
      csrf: req.admin.csrf,
      notice: req.query.mentve === '1' ? 'A státuszt mentettük.' : '',
      error: '',
    });
  });

  app.post('/admin/igeny/:id/statusz', requireAdmin, (req, res, next) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return next();
    if (!sameOrigin(req) || req.body?.csrf !== req.admin.csrf) return res.status(403).type('html').send('A módosítást elutasítottuk.');
    const status = STATUSES.some(([code]) => code === req.body?.status) ? req.body.status : '';
    if (!status || !db.getLead(id)) return next();
    db.updateStatus(id, status);
    res.redirect(`/admin/igeny/${id}?mentve=1`);
  });

  app.post('/admin/igeny/:id/torles', requireAdmin, (req, res, next) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return next();
    const lead = db.getLead(id);
    if (!lead) return next();
    if (!sameOrigin(req) || req.body?.csrf !== req.admin.csrf) return res.status(403).type('html').send('A törlést elutasítottuk.');
    if (req.body?.confirm !== lead.public_ref) {
      return sendPage(res, 'pages/admin-detail', {
        ...adminMeta(`/admin/igeny/${id}`),
        lead,
        fields: detailFields(lead),
        statuses: STATUSES,
        statusLabel,
        csrf: req.admin.csrf,
        notice: '',
        error: 'A törléshez az azonosítót pontosan be kell írni.',
        statusCode: 400,
      });
    }
    db.deleteLead(id);
    res.redirect('/admin');
  });
}
