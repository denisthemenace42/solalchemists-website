const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

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
