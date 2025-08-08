const express = require('express');
const path = require('path');
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
// Serve static files
app.use(express.static(__dirname));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the reveal page
app.get('/real-nft-reveal.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'real-nft-reveal.html'));
});

// Serve the reveal page without extension
app.get('/real-nft-reveal', (req, res) => {
    res.sendFile(path.join(__dirname, 'real-nft-reveal.html'));
});

// Serve the verification admin panel
app.get('/admin-verifications', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-verifications.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'SOLalchemists Mystery Reveal Server is running!' });
});

// In-memory mock storage (replace with DB for production)
const db = {
  referralCodes: new Map(), // code -> { code, createdBy, usedBy, usedAt, status }
  userXp: new Map(),        // userId -> { xp, level, rp }
  users: new Map(),         // id -> { id, username, email, referralVerified, level, xp, referralPoints }
  sessions: new Map(),      // refreshToken -> { userId, expiresAt }
};

function genCode() {
  // 6-char alphanumeric (A-Z0-9) for friendlier codes than hex only
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random()*alphabet.length)];
  return out;
}

// POST /api/referral/verify { code, userId }
app.post('/api/referral/verify', (req, res) => {
  const { code, identifier } = req.body || {};
  const validFormat = typeof code === 'string' && /^[A-Z2-9]{6}$/.test(code);
  if (!validFormat) return res.json({ success: false, error: 'Invalid code' });

  const rec = db.referralCodes.get(code);
  if (rec) {
    if (rec.status === 'used') return res.json({ success: false, error: 'Invalid code' });
    // ensure user
    const uid = ensureUser(identifier);
    rec.status = 'used';
    rec.usedBy = uid;
    rec.usedAt = new Date().toISOString();
    db.referralCodes.set(code, rec);
    // give referral points to creator
    const creator = db.userXp.get(rec.createdBy) || { xp: 0, level: 1, rp: 0 };
    creator.rp = (creator.rp || 0) + 5;
    db.userXp.set(rec.createdBy, creator);
    // mark user verified and award xp
    const u = db.users.get(uid);
    u.referralVerified = true;
    const ux = db.userXp.get(uid) || { xp: 0, level: 1, rp: 0 };
    ux.xp += 50;
    db.userXp.set(uid, ux);
    // issue cookies
    issueSession(res, uid);
    return res.json({ success: true, userId: uid });
  }

  // Fallback (stateless demo): accept any valid 6-char code when storage is missing
  const uid = ensureUser(identifier);
  const u = db.users.get(uid);
  u.referralVerified = true;
  const ux = db.userXp.get(uid) || { xp: 0, level: 1, rp: 0 };
  ux.xp += 50;
  db.userXp.set(uid, ux);
  issueSession(res, uid);
  return res.json({ success: true, demo: true, userId: uid });
});

// POST /api/referral/generate { userId, count }
app.post('/api/referral/generate', (req, res) => {
  const { count } = req.body || {};
  const uid = getUserFromCookies(req);
  if (!uid) return res.status(401).json({ success:false, error:'Unauthorized' });
  const howMany = Math.min(Math.max(Number(count) || 5, 1), 10);
  const codes = [];
  for (let i = 0; i < howMany; i++) {
    let code;
    do { code = genCode(); } while (db.referralCodes.has(code));
    const rec = { code, createdBy: uid, usedBy: null, usedAt: null, status: 'unused' };
    db.referralCodes.set(code, rec);
    codes.push(code);
  }
  res.json({ success: true, codes });
});

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
  issueSession(res, uid);
  res.json({ success:true });
});
app.post('/api/auth/refresh', (req, res) => {
  const uid = getUserFromCookies(req);
  if (!uid) return res.status(401).json({ success:false });
  issueSession(res, uid); // rotate
  res.json({ success:true });
});
app.post('/api/auth/logout', (req, res) => {
  const cookies = parseCookies(req);
  if (cookies.refreshToken) db.sessions.delete(cookies.refreshToken);
  res.setHeader('Set-Cookie', [
    'accessToken=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    'refreshToken=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
  ]);
  res.json({ success:true });
});

// Helpers for mock auth
function ensureUser(identifier){
  const id = identifier || crypto.randomUUID();
  if (!db.users.has(id)) db.users.set(id, { id, referralVerified:false, level:1, xp:0, referralPoints:0 });
  return id;
}
function parseCookies(req){
  const h = req.headers.cookie || ''; const out = {}; h.split(';').map(v=>v.trim()).filter(Boolean).forEach(p=>{ const [k,...r]=p.split('='); out[k]=decodeURIComponent(r.join('=')); }); return out;
}
function issueSession(res, userId){
  const refreshToken = crypto.randomBytes(24).toString('hex');
  const expires = new Date(Date.now() + 1000*60*60*24*14); // 14d
  db.sessions.set(refreshToken, { userId, expiresAt: expires.toISOString() });
  const access = crypto.randomBytes(16).toString('hex');
  res.setHeader('Set-Cookie', [
    `accessToken=${access}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=900`,
    `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Expires=${expires.toUTCString()}`
  ]);
}
function getUserFromCookies(req){
  const cookies = parseCookies(req);
  if (cookies.refreshToken){ const sess = db.sessions.get(cookies.refreshToken); if (sess) return sess.userId; }
  return null;
}

// Start server
app.listen(PORT, () => {
    console.log('🔮 SOLalchemists Mystery Reveal Website');
    console.log('=' * 50);
    console.log(`🌐 Server running on: http://localhost:${PORT}`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`📱 Mobile friendly: Yes`);
    console.log(`🔒 Secure: HTTPS recommended for production`);
    console.log('=' * 50);
    console.log('💡 To deploy to production:');
    console.log('   • Upload files to hosting service (Vercel, Netlify, etc.)');
    console.log('   • Or use: npm install -g serve && serve .');
    console.log('   • Or use: python3 -m http.server 3000');
});

module.exports = app;
