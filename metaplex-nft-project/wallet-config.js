const { Keypair } = require('@solana/web3.js');

// 🔑 WALLET SETUP INSTRUCTIONS:
// 
// 1. Export your private key from Phantom Wallet:
//    - Open Phantom → Settings → Export Private Key
//    - Enter your password
//    - Copy the private key
//
// 2. Replace the PRIVATE_KEY_STRING below with your actual private key
// 3. The private key should be a comma-separated string of numbers

// ⚠️  SECURITY WARNING: Never share your private key or commit it to git!

const PRIVATE_KEY_STRING = "130,213,28,30,25,163,91,146,46,160,5,1,184,71,120,172,187,59,2,92,148,31,173,46,128,132,96,89,230,10,98,48,104,136,188,185,28,232,14,10,138,97,47,215,39,45,59,168,150,85,48,129,239,35,50,41,212,82,214,23,51,41,44,21";

// Convert private key string to Uint8Array
let walletKeypair;

try {
  const privateKeyArray = Uint8Array.from(PRIVATE_KEY_STRING.split(',').map(num => parseInt(num)));
  walletKeypair = Keypair.fromSecretKey(privateKeyArray);
  
  console.log('✅ Wallet loaded successfully!');
  console.log('💰 Wallet address:', walletKeypair.publicKey.toString());
  
} catch (error) {
  console.error('❌ Error loading wallet:', error.message);
  console.log('💡 Make sure you replaced PRIVATE_KEY_STRING with your actual private key');
  console.log('💡 The private key should be a comma-separated string of numbers');
  
  // Create a dummy keypair for testing (will fail on mainnet)
  walletKeypair = Keypair.generate();
  console.log('⚠️  Using generated keypair for testing only');
}

module.exports = { walletKeypair };
