import { config } from '../config.js';
import { escapeHtml } from './html.js';

const failHtml = `<!doctype html><html lang="hu"><meta charset="utf-8"><title>Hiba</title><body><p>Az oldal most nem tölthető be. Írjon a ${escapeHtml(config.contactEmail)} címre.</p></body></html>`;

export function sendPage(res, view, data = {}) {
  const model = { ...res.locals, ...data, noindex: Boolean(data.noindex) };
  res.set('Cache-Control', 'no-store');
  res.app.render(view, model, (err, body) => {
    if (err) {
      console.error(err);
      res.status(500).type('html').send(failHtml);
      return;
    }
    res.status(data.statusCode || 200).render('layouts/main', { ...model, body }, (layoutErr, html) => {
      if (layoutErr) {
        console.error(layoutErr);
        res.status(500).type('html').send(failHtml);
        return;
      }
      res.send(html);
    });
  });
}
