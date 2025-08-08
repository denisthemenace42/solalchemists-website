#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔐 Firebase Configuration Setup');
console.log('================================\n');

// Check if firebase-config.js exists
const configPath = path.join(__dirname, 'firebase-config.js');
if (!fs.existsSync(configPath)) {
    console.log('❌ firebase-config.js not found!');
    console.log('📋 Please copy firebase-config.example.js to firebase-config.js first:');
    console.log('   cp firebase-config.example.js firebase-config.js\n');
    process.exit(1);
}

console.log('✅ firebase-config.js found');
console.log('\n📝 Next Steps:');
console.log('1. Edit firebase-config.js and replace placeholder values with your actual Firebase config');
console.log('2. Get your new API key from Firebase Console:');
console.log('   https://console.firebase.google.com/ → Project Settings → General → Your apps → Manage API keys');
console.log('3. Replace "YOUR_API_KEY_HERE" with your new API key');
console.log('4. Replace other placeholder values with your actual Firebase project details');
console.log('\n🔧 For Vercel deployment:');
console.log('1. Go to your Vercel project dashboard');
console.log('2. Settings → Environment Variables');
console.log('3. Add all the Firebase configuration variables');
console.log('\n📚 See ENVIRONMENT_SETUP.md for detailed instructions\n');

// Show current config structure
try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const hasPlaceholders = configContent.includes('YOUR_API_KEY_HERE') || configContent.includes('YOUR_PROJECT_ID');
    
    if (hasPlaceholders) {
        console.log('⚠️  Current config still has placeholder values');
        console.log('   Please update firebase-config.js with your actual Firebase credentials\n');
    } else {
        console.log('✅ Config appears to be properly set up\n');
    }
} catch (error) {
    console.log('❌ Error reading firebase-config.js:', error.message);
}
