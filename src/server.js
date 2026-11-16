import crypto from 'node:crypto';
import path from 'node:path';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { assertRuntime, config } from './config.js';
import { openDatabase } from './lib/db.js';
import { formatDay, formatStamp } from './lib/format.js';
import { inlineHtml } from './lib/html.js';
import { createLogger } from './lib/mail.js';
import { absolutePublic, canonicalRedirectTarget } from './lib/indexing.js';
import { resolveDatabasePath, telHref } from './lib/paths.js';
import { listenersOn, reportBusyPort } from './lib/port.js';
import { registerAdmin } from './routes/admin.js';
import { serviceNav, sidebarModel } from './content/sidebar.js';
import { registerWeb } from './routes/web.js';

assertRuntime();
process.title = 'hatekony3dfelmeres';

const logger = createLogger(path.join(config.root, 'data', 'logs'));
const dbFile = resolveDatabasePath(config.root, config.databaseUrl);
const db = openDatabase(dbFile);
const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(config.root, 'views'));
app.set('view cache', config.nodeEnv === 'production');

app.use((req, res, next) => {
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  helmet({
    crossOriginEmbedderPolicy: false,
    strictTransportSecurity: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", `'nonce-${res.locals.cspNonce}'`],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: null,
      },
    },
  })(req, res, next);
});

app.use((req, res, next) => {
  const target = canonicalRedirectTarget({
    method: req.method,
    host: req.headers.host,
    proto: req.headers['x-forwarded-proto'] || req.protocol,
    url: req.originalUrl,
  });
  if (target) {
    res.redirect(301, target);
    return;
  }
  const closed = !config.indexable || req.path.startsWith('/admin') || req.path.startsWith('/projektigeny') || req.path === '/healthz';
  if (closed) res.set('X-Robots-Tag', 'noindex, nofollow');
  next();
});

app.use(compression());
app.use(express.urlencoded({ extended: false, limit: '64kb' }));
app.use(express.static(path.join(config.root, 'public'), {
  maxAge: config.nodeEnv === 'production' ? '7d' : 0,
}));

app.use((req, res, next) => {
  if ((req.method === 'GET' || req.method === 'HEAD') && req.path.length > 1 && req.path.endsWith('/')) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
    return;
  }
  res.locals.siteName = config.siteName;
  res.locals.siteUrl = absolutePublic('/');
  res.locals.ogImage = absolutePublic('/og.png');
  res.locals.ogImageAlt = 'Hatékony 3D felmérés: ipari csarnok és gépészeti környezet sematikus térfelmérése átépítéshez.';
  res.locals.ogImageWidth = 1200;
  res.locals.ogImageHeight = 630;
  res.locals.googleSiteVerification = config.googleSiteVerification;
  res.locals.bingSiteVerification = config.bingSiteVerification;
  res.locals.email = config.contactEmail;
  res.locals.phone = config.phone;
  res.locals.phoneHref = telHref(config.phone);
  res.locals.company = config.company;
  res.locals.year = new Date().getFullYear();
  res.locals.inline = inlineHtml;
  res.locals.formatDay = formatDay;
  res.locals.formatStamp = formatStamp;
  res.locals.currentPath = req.path;
  res.locals.serviceNav = serviceNav;
  res.locals.side = sidebarModel(req.path);
  res.locals.navActive = (href) => (req.path === href ? 'aria-current="page"' : '');
  res.locals.logger = logger;
  res.locals.ogType = 'website';
  res.locals.noindex = false;
  res.locals.jsonLd = '';
  res.locals.crumbs = [];
  next();
});

registerWeb(app, { db, logger });
registerAdmin(app, { db, logger });

app.use((req, res) => {
  res.status(404);
  res.render('pages/message', {
    h1: 'Nincs ilyen oldal',
    lede: 'A kért cím nem tartozik ehhez a felmérési oldalhoz.',
  }, (err, body) => {
    if (err) {
      res.type('html').send('<!doctype html><meta charset="utf-8"><title>Nincs ilyen oldal</title><p>A kért cím nem található.</p>');
      return;
    }
    res.render('layouts/main', {
      ...res.locals,
      body,
      noindex: true,
      metaTitle: 'Az oldal nem található | Hatékony 3D felmérés',
      metaDescription: 'A kért cím nem található a hatekony3dfelmeres.hu oldalon.',
      canonical: absolutePublic(req.path),
      jsonLd: '',
    });
  });
});

app.use((error, req, res, next) => {
  logger.error(error?.stack || error?.message || 'ismeretlen hiba');
  if (res.headersSent) return next(error);
  res.status(500).type('html').send(`<!doctype html><html lang="hu"><meta charset="utf-8"><title>Hiba</title><p>Az oldal most nem tölthető be. Írjon a ${config.contactEmail} címre.</p></html>`);
});

const lookup = listenersOn(config.port);
if (lookup.rows.length) {
  reportBusyPort(config.port, lookup);
  process.exit(1);
}
if (lookup.error) logger.info(`portellenorzes nem teljes: ${lookup.error}`);

const server = app.listen(config.port, config.host, () => {
  logger.info(`fut: http://127.0.0.1:${config.port} host=${config.host} adatbazis=${dbFile}`);
  logger.info(`level: ${config.smtp.host ? 'smtp' : 'outbox'} admin: ${config.adminToken ? 'bekapcsolva' : 'kikapcsolva'}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    reportBusyPort(config.port);
    process.exit(1);
  }
  logger.error(error.stack || error.message);
  process.exit(1);
});

function shutdown() {
  server.close(() => {
    try { db.close(); } catch { /* már zárva */ }
    process.exit(0);
  });
  setTimeout(() => process.exit(0), 5000).unref();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
