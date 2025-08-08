const { Connection } = require('@solana/web3.js');
const { walletKeypair } = require('./wallet-config');

async function testWallet() {
  console.log('🔑 Testing Wallet Setup...');
  console.log('=' * 50);
  
  // Test 1: Check if wallet loaded
  console.log('✅ Wallet loaded:', walletKeypair.publicKey.toString());
  
  // Test 2: Check wallet balance
  try {
    // Try devnet first (for testing)
    const devnetConnection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const devnetBalance = await devnetConnection.getBalance(walletKeypair.publicKey);
    console.log('💰 Devnet balance:', devnetBalance / 1e9, 'SOL');
    
    if (devnetBalance === 0) {
      console.log('⚠️  Devnet wallet has 0 SOL');
      console.log('💡 Get devnet SOL from Solflare or faucet');
    } else {
      console.log('✅ Devnet SOL available for testing');
    }
    
    // Also check mainnet balance
    const mainnetConnection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const mainnetBalance = await mainnetConnection.getBalance(walletKeypair.publicKey);
    console.log('💰 Mainnet balance:', mainnetBalance / 1e9, 'SOL');
    
    if (mainnetBalance === 0) {
      console.log('⚠️  Mainnet wallet has 0 SOL');
      console.log('💡 You need SOL to mint NFTs on mainnet');
    } else if (mainnetBalance < 2 * 1e9) {
      console.log('⚠️  Warning: Low mainnet SOL balance (< 2 SOL)');
      console.log('💡 Recommended: At least 2-3 SOL for 1,111 NFTs');
    } else {
      console.log('✅ Sufficient mainnet SOL balance for minting');
    }
    
  } catch (error) {
    console.log('❌ Error checking balance:', error.message);
  }
  
  // Test 3: Verify wallet format
  console.log('🔐 Wallet secret key length:', walletKeypair.secretKey.length);
  
  if (walletKeypair.secretKey.length === 64) {
    console.log('✅ Wallet format is correct');
  } else {
    console.log('❌ Wallet format may be incorrect');
  }
  
  console.log('=' * 50);
  console.log('🎯 Wallet test completed!');
  
  // Recommendations
  console.log('\n📋 Next Steps:');
  console.log('1. Ensure sufficient SOL balance');
  console.log('2. Update config.js for mainnet');
  console.log('3. Start with small batch minting');
  console.log('4. Monitor transactions carefully');
}

testWallet().catch(console.error);
