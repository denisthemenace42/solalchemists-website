const fs = require('fs');
const path = require('path');

console.log('🦊 Solflare Devnet Setup Guide');
console.log('=' * 50);

console.log('\n📋 Step-by-Step Instructions:');
console.log('\n1. 🔧 Configure Solflare Wallet:');
console.log('   - Open Solflare browser extension');
console.log('   - Click network selector (shows "Mainnet")');
console.log('   - Select "Devnet" from dropdown');
console.log('   - Your wallet is now on devnet');

console.log('\n2. 💰 Get Devnet SOL:');
console.log('   - In Solflare devnet, click "Receive" or "Deposit"');
console.log('   - Look for "Airdrop" or "Get SOL" option');
console.log('   - Request devnet SOL (usually 2 SOL free)');

console.log('\n3. 🔑 Export Private Key:');
console.log('   - In Solflare, go to Settings');
console.log('   - Click "Export Private Key" or "Backup Wallet"');
console.log('   - Enter your password');
console.log('   - Copy the private key (long string)');

console.log('\n4. 📝 Update Configuration:');
console.log('   - Open wallet-config.js');
console.log('   - Replace PRIVATE_KEY_STRING with your devnet private key');
console.log('   - The private key should be comma-separated numbers');

console.log('\n5. 🧪 Test Your Setup:');
console.log('   npm run test:wallet    # Test wallet connection');
console.log('   npm run mint          # Test single NFT');
console.log('   npm run batch-mint    # Test batch minting');

console.log('\n6. 🌐 Verify Results:');
console.log('   - Go to: https://solscan.io/?cluster=devnet');
console.log('   - Search your wallet address');
console.log('   - Check your minted NFTs');

console.log('\n7. 🚀 After Successful Testing:');
console.log('   - Switch Solflare back to mainnet');
console.log('   - Update config for mainnet');
console.log('   - Launch on mainnet with confidence');

console.log('\n' + '=' * 50);
console.log('🎯 This gives you the most realistic testing experience!');
console.log('💡 All testing is free on devnet - no real SOL needed');

// Check if wallet-config.js exists
const walletConfigPath = path.join(__dirname, 'wallet-config.js');
if (fs.existsSync(walletConfigPath)) {
  console.log('\n✅ wallet-config.js found');
  console.log('💡 Remember to update it with your Solflare devnet private key');
} else {
  console.log('\n❌ wallet-config.js not found');
  console.log('💡 Make sure the file exists and is properly configured');
}

// Check if config files exist
const configFiles = [
  'config.js',
  'config-solflare-devnet.js',
  'config-mainnet-ready.js'
];

console.log('\n📁 Configuration files:');
configFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (missing)`);
  }
});

console.log('\n🚀 Ready to start testing!');
console.log('Run: npm run test:wallet');
