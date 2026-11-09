import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const COLUMNS = [
  'created_at', 'public_ref', 'source_domain', 'source_url', 'referrer',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'company_name', 'contact_name', 'email', 'phone', 'industry', 'project_type',
  'location', 'schedule', 'access_window', 'requested_output', 'coordinate_system',
  'accuracy_need', 'file_size', 'note', 'gdpr_consent', 'status', 'client_ip',
  'user_agent', 'email_status', 'email_error',
];

function refFor(id, createdAt) {
  return `H3D-${createdAt.slice(0, 4)}-${String(id).padStart(5, '0')}`;
}

function asNumber(value) {
  return typeof value === 'bigint' ? Number(value) : Number(value || 0);
}

export function openDatabase(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA busy_timeout = 3000');
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      public_ref TEXT,
      source_domain TEXT NOT NULL,
      source_url TEXT NOT NULL,
      referrer TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      utm_content TEXT,
      company_name TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      industry TEXT,
      project_type TEXT NOT NULL,
      location TEXT,
      schedule TEXT,
      access_window TEXT,
      requested_output TEXT,
      coordinate_system TEXT,
      accuracy_need TEXT,
      file_size TEXT,
      note TEXT,
      gdpr_consent INTEGER NOT NULL,
      status TEXT NOT NULL,
      client_ip TEXT,
      user_agent TEXT,
      email_status TEXT,
      email_error TEXT
    )
  `);
  db.exec('CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)');

  return {
    insertLead(lead) {
      const createdAt = new Date().toISOString();
      const values = COLUMNS.map((column) => {
        if (column === 'created_at') return createdAt;
        if (column === 'public_ref') return '';
        if (column === 'gdpr_consent') return lead.gdpr_consent ? 1 : 0;
        return lead[column] ?? '';
      });
      const placeholders = COLUMNS.map(() => '?').join(', ');
      db.exec('BEGIN');
      try {
        const info = db.prepare(`INSERT INTO leads (${COLUMNS.join(', ')}) VALUES (${placeholders})`).run(...values);
        const id = asNumber(info.lastInsertRowid);
        const publicRef = refFor(id, createdAt);
        db.prepare('UPDATE leads SET public_ref = ? WHERE id = ?').run(publicRef, id);
        db.exec('COMMIT');
        return { id, public_ref: publicRef, created_at: createdAt };
      } catch (error) {
        try { db.exec('ROLLBACK'); } catch { /* already closed */ }
        throw error;
      }
    },
    getLead(id) {
      return db.prepare('SELECT * FROM leads WHERE id = ?').get(Number(id));
    },
    listLeads({ status = '', q = '', includeSpam = false } = {}) {
      const where = [];
      const params = [];
      if (!includeSpam && status !== 'spam') where.push("status != 'spam'");
      if (status) {
        where.push('status = ?');
        params.push(status);
      }
      if (q) {
        const like = `%${q.replace(/[%_]/g, '')}%`;
        where.push('(company_name LIKE ? OR contact_name LIKE ? OR email LIKE ? OR location LIKE ? OR public_ref LIKE ?)');
        params.push(like, like, like, like, like);
      }
      const sql = `SELECT * FROM leads ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY id DESC LIMIT 500`;
      return db.prepare(sql).all(...params);
    },
    statusCounts() {
      return db.prepare('SELECT status, COUNT(*) AS n FROM leads GROUP BY status ORDER BY n DESC').all()
        .map((row) => ({ status: row.status, n: asNumber(row.n) }));
    },
    updateStatus(id, status) {
      return asNumber(db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, Number(id)).changes);
    },
    setEmailStatus(id, emailStatus, emailError = '') {
      db.prepare('UPDATE leads SET email_status = ?, email_error = ? WHERE id = ?').run(emailStatus, emailError, Number(id));
    },
    deleteLead(id) {
      return asNumber(db.prepare('DELETE FROM leads WHERE id = ?').run(Number(id)).changes);
    },
    close() {
      db.close();
    },
  };
}
