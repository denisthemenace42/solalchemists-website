const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS for local dev (allow static 8000)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && /localhost:8000$/.test(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

// Compression for text assets
try {
  const compression = require('compression');
  app.use(compression({ level: 6 }));
} catch (_) {
  // compression optional in local dev
}

// Note: Static pages and assets are served by Vercel directly.
// This server only handles API endpoints under /api/* when deployed on Vercel.

// Health check endpoint (under /api for Vercel routing)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'SOLalchemists Mystery Reveal Server is running!' });
});

// In-memory mock storage (replace with DB for production)
const db = {
  userXp: new Map(),        // userId -> { xp, level, rp }
  users: new Map(),         // id -> { id, username, email, level, xp }
  sessions: new Map(),      // refreshToken -> { userId, expiresAt }
};

function genCode() {
  // 6-char alphanumeric (A-Z0-9) for friendlier codes than hex only
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random()*alphabet.length)];
  return out;
}

// Referral API removed

// POST /api/user/xp/add { userId, amount }
app.post('/api/user/xp/add', (req, res) => {
  const { amount } = req.body || {};
  const userId = getUserFromCookies(req);
  if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
  const user = db.userXp.get(userId) || { xp: 0, level: 1, rp: 0 };
  user.xp = (user.xp || 0) + (Number(amount) || 0);
  db.userXp.set(userId, user);
  res.json({ success: true });
});

// Auth endpoints (mock cookies)
app.post('/api/auth/login', (req, res) => {
  const { identifier } = req.body || {};
  const uid = ensureUser(identifier);
  issueSession(req, res, uid);
  res.json({ success:true });
});
app.post('/api/auth/refresh', (req, res) => {
  const uid = getUserFromCookies(req);
  // Be tolerant when no session cookie is present (or lost due to serverless cold starts).
  // Return 204 No Content to avoid console error noise on public pages.
  if (!uid) return res.status(204).end();
  issueSession(req, res, uid); // rotate
  res.json({ success:true });
});
app.post('/api/auth/logout', (req, res) => {
  const cookies = parseCookies(req);
  if (cookies.refreshToken) db.sessions.delete(cookies.refreshToken);
  const secureFlag = isHttps(req) || process.env.NODE_ENV === 'production';
  const secureAttr = secureFlag ? ' Secure;' : '';
  res.setHeader('Set-Cookie', [
    `accessToken=; HttpOnly;${secureAttr} SameSite=Lax; Path=/; Max-Age=0`,
    `refreshToken=; HttpOnly;${secureAttr} SameSite=Lax; Path=/; Max-Age=0`
  ]);
  res.json({ success:true });
});

// Helpers for mock auth
function ensureUser(identifier){
  const id = identifier || crypto.randomUUID();
  if (!db.users.has(id)) db.users.set(id, { id, level:1, xp:0 });
  return id;
}
function parseCookies(req){
  const h = req.headers.cookie || ''; const out = {}; h.split(';').map(v=>v.trim()).filter(Boolean).forEach(p=>{ const [k,...r]=p.split('='); out[k]=decodeURIComponent(r.join('=')); }); return out;
}
function isHttps(req){
  const xf = req.headers['x-forwarded-proto'];
  const proto = Array.isArray(xf) ? xf[0] : xf;
  if (proto) return proto.includes('https');
  return !!req.secure;
}

function issueSession(req, res, userId){
  const refreshToken = crypto.randomBytes(24).toString('hex');
  const expires = new Date(Date.now() + 1000*60*60*24*14); // 14d
  db.sessions.set(refreshToken, { userId, expiresAt: expires.toISOString() });
  const access = crypto.randomBytes(16).toString('hex');
  const secureFlag = isHttps(req) || process.env.NODE_ENV === 'production';
  const secureAttr = secureFlag ? ' Secure;' : '';
  res.setHeader('Set-Cookie', [
    `accessToken=${access}; HttpOnly;${secureAttr} SameSite=Lax; Path=/; Max-Age=900`,
    `refreshToken=${refreshToken}; HttpOnly;${secureAttr} SameSite=Lax; Path=/; Expires=${expires.toUTCString()}`
  ]);
}
function getUserFromCookies(req){
  const cookies = parseCookies(req);
  if (cookies.refreshToken){ const sess = db.sessions.get(cookies.refreshToken); if (sess) return sess.userId; }
  return null;
}

// Export the Express app for Vercel serverless. Do not call app.listen in Vercel.
// Export the Express app both for Vercel and Node
module.exports = app;

if (!process.env.VERCEL) {
  // Local development server
  app.listen(PORT, () => {
    console.log('🔮 SOLalchemists Mystery Reveal Website');
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
  });
}
