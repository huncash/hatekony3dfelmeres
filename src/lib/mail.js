import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { config } from '../config.js';
import { campaignText, writeOutbox } from './csv.js';
import { ACCURACY, COORDS, FILE_SIZES, INDUSTRIES, OUTPUTS, PROJECT_TYPES, labelOf, labelsOf, statusLabel } from './options.js';

function leadText(lead) {
  const lines = [
    `Új projektigény: ${lead.public_ref}`,
    '',
    `Beküldés időpontja: ${lead.created_at}`,
    `Státusz: ${statusLabel(lead.status)}`,
    `Forrásdomain: ${lead.source_domain}`,
    `Forrás URL: ${lead.source_url}`,
    `Hivatkozó: ${lead.referrer || '—'}`,
    `Kampány / UTM: ${campaignText(lead) || '—'}`,
    '',
    `Cég neve: ${lead.company_name}`,
    `Kapcsolattartó: ${lead.contact_name}`,
    `E-mail: ${lead.email}`,
    `Telefon: ${lead.phone}`,
    `Iparág: ${labelOf(INDUSTRIES, lead.industry)}`,
    `Projekt típusa: ${labelOf(PROJECT_TYPES, lead.project_type)}`,
    `Helyszín: ${lead.location || '—'}`,
    `Tervezett ütemezés: ${lead.schedule || '—'}`,
    `Hozzáférési időablak: ${lead.access_window || '—'}`,
    `Kért kimenet: ${labelsOf(OUTPUTS, lead.requested_output) || '—'}`,
    `Koordinátarendszer: ${labelOf(COORDS, lead.coordinate_system) || '—'}`,
    `Pontossági igény: ${labelOf(ACCURACY, lead.accuracy_need) || '—'}`,
    `Fájlméret: ${labelOf(FILE_SIZES, lead.file_size) || '—'}`,
    '',
    'Megjegyzés:',
    lead.note || '—',
    '',
    'Automatikus árat és szerződést a rendszer nem készít.',
    'A válasz csak a feladat határa, a hozzáférés és a kért kimenet áttekintése után adható.',
  ];
  return lines.join('\n');
}

function cleanHeader(value) {
  return String(value || '').replace(/[\r\n]/g, ' ').slice(0, 180);
}

export async function notifyLead(lead, logger) {
  const text = leadText(lead);
  const subject = cleanHeader(`Új projektigény: ${lead.company_name} (${lead.public_ref})`);
  if (!config.smtp.host) {
    const file = writeOutbox(path.join(config.root, 'data', 'outbox'), lead.public_ref, `To: ${config.contactEmail}\nSubject: ${subject}\n\n${text}\n`);
    logger.info(`ertesito outbox: ${lead.public_ref} -> ${file}`);
    return { status: 'outbox', error: '' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user ? { user: config.smtp.user, pass: config.smtp.pass } : undefined,
    });
    await transporter.sendMail({
      from: cleanHeader(config.smtp.from),
      to: cleanHeader(config.contactEmail),
      replyTo: cleanHeader(lead.email),
      subject,
      text,
    });
    logger.info(`ertesito elkuldve: ${lead.public_ref}`);
    return { status: 'sent', error: '' };
  } catch (error) {
    const secret = config.smtp.pass;
    const raw = String(error?.message || 'ismeretlen levelkuldesi hiba');
    const message = (secret ? raw.replaceAll(secret, '***') : raw).slice(0, 300);
    const file = writeOutbox(path.join(config.root, 'data', 'outbox'), `${lead.public_ref}-failed`, `Subject: ${subject}\nHiba: ${message}\n\n${text}\n`);
    logger.error(`ertesito hiba: ${lead.public_ref} ${message} masolat=${file}`);
    return { status: 'failed', error: message };
  }
}

export function createLogger(dir) {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'app.log');
  function write(level, message) {
    const line = `${new Date().toISOString()} ${level} ${message}`;
    fs.appendFile(file, `${line}\n`, () => {});
    if (level === 'ERROR') console.error(line);
    else console.log(line);
  }
  return {
    info(message) { write('INFO', message); },
    error(message) { write('ERROR', message); },
    file,
  };
}
