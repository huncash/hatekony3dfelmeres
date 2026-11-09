import crypto from 'node:crypto';
import { config } from '../config.js';

const COOKIE = 'h3df_admin';
const runtimeSecret = config.sessionSecret || crypto.randomBytes(32).toString('hex');

function hmac(value) {
  return crypto.createHmac('sha256', runtimeSecret).update(value).digest('base64url');
}

export function issueFormToken(now = Date.now()) {
  const body = String(now);
  return `${body}.${hmac(`form:${body}`)}`;
}

export function verifyFormToken(token, now = Date.now()) {
  const [body, sig] = String(token || '').split('.');
  if (!body || !sig || !/^\d+$/.test(body)) return false;
  const expected = hmac(`form:${body}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const age = now - Number(body);
  return age >= 0 && age <= 12 * 60 * 60 * 1000;
}

export function tokenMatches(input) {
  const expected = config.adminToken;
  if (!expected || input == null) return false;
  const a = Buffer.from(String(input));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSession() {
  const payload = {
    exp: Date.now() + 12 * 60 * 60 * 1000,
    csrf: crypto.randomBytes(18).toString('base64url'),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return { token: `${body}.${hmac(`session:${body}`)}`, csrf: payload.csrf };
}

export function readSession(token) {
  if (!token || !config.adminToken) return null;
  const [body, sig] = String(token).split('.');
  if (!body || !sig) return null;
  const expected = hmac(`session:${body}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload?.exp || payload.exp < Date.now() || !payload.csrf) return null;
    return payload;
  } catch {
    return null;
  }
}

export function readCookie(req, name = COOKIE) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key === name) return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return '';
}

function cookieFlags(req, maxAge) {
  const secure = req.secure ? '; Secure' : '';
  return `HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

export function setSessionCookie(res, req, token) {
  res.append('Set-Cookie', `${COOKIE}=${encodeURIComponent(token)}; ${cookieFlags(req, 12 * 60 * 60)}`);
}

export function clearSessionCookie(res, req) {
  res.append('Set-Cookie', `${COOKIE}=; ${cookieFlags(req, 0)}`);
}

export function sameOrigin(req) {
  const host = req.get('host');
  const origin = req.get('origin');
  if (origin && origin !== 'null') {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  if (!origin) return true;
  if (req.get('sec-fetch-site') === 'same-origin') return true;
  const referer = req.get('referer');
  if (!referer) return false;
  try {
    return new URL(referer).host === host;
  } catch {
    return false;
  }
}

export function signRef(ref) {
  return hmac(`ref:${ref}`).slice(0, 16);
}

export function verifyRef(ref, sig) {
  if (!ref || !sig) return false;
  const expected = signRef(ref);
  const a = Buffer.from(String(sig));
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const buckets = new Map();

export function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter((stamp) => now - stamp < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [name, stamps] of buckets) {
      if (!stamps.some((stamp) => now - stamp < windowMs)) buckets.delete(name);
    }
  }
  return true;
}

export function clientIp(req) {
  const forwarded = req.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim().slice(0, 80);
  return (req.ip || '').slice(0, 80);
}
