const express = require('express');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

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
  const { code, userId } = req.body || {};
  if (!code) return res.json({ success: false, error: 'Invalid code' });
  const rec = db.referralCodes.get(code);
  if (!rec || rec.status === 'used') return res.json({ success: false, error: 'Invalid code' });
  rec.status = 'used';
  rec.usedBy = userId || 'guest';
  rec.usedAt = new Date().toISOString();
  db.referralCodes.set(code, rec);
  // give referral points to creator
  const creator = db.userXp.get(rec.createdBy) || { xp: 0, level: 1, rp: 0 };
  creator.rp = (creator.rp || 0) + 5;
  db.userXp.set(rec.createdBy, creator);
  res.json({ success: true });
});

// POST /api/referral/generate { userId, count }
app.post('/api/referral/generate', (req, res) => {
  const { userId, count } = req.body || {};
  const howMany = Math.min(Math.max(Number(count) || 5, 1), 10);
  const codes = [];
  for (let i = 0; i < howMany; i++) {
    let code;
    do { code = genCode(); } while (db.referralCodes.has(code));
    const rec = { code, createdBy: userId || 'guest', usedBy: null, usedAt: null, status: 'unused' };
    db.referralCodes.set(code, rec);
    codes.push(code);
  }
  res.json({ success: true, codes });
});

// POST /api/user/xp/add { userId, amount }
app.post('/api/user/xp/add', (req, res) => {
  const { userId, amount } = req.body || {};
  if (!userId) return res.json({ success: false, error: 'Missing userId' });
  const user = db.userXp.get(userId) || { xp: 0, level: 1, rp: 0 };
  user.xp = (user.xp || 0) + (Number(amount) || 0);
  db.userXp.set(userId, user);
  res.json({ success: true });
});

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
