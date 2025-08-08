const { Connection, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');

async function createFundedWallet() {
  console.log('💰 Creating Funded Devnet Wallet...');
  console.log('=' * 50);
  
  try {
    // Connect to devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Create new wallet
    const wallet = Keypair.generate();
    console.log('🔑 New wallet created!');
    
    // Request airdrop
    console.log('🔄 Requesting airdrop...');
    const signature = await connection.requestAirdrop(wallet.publicKey, 3 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature);
    
    // Check balance
    const balance = await connection.getBalance(wallet.publicKey);
    console.log('✅ Airdrop successful!');
    
    console.log('\n📋 WALLET DETAILS:');
    console.log('🔑 Public Address:', wallet.publicKey.toString());
    console.log('🔐 Private Key:', Array.from(wallet.secretKey).join(','));
    console.log('💰 Balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    console.log('\n💡 TO USE THIS WALLET:');
    console.log('1. Copy the private key above');
    console.log('2. Open wallet-config.js');
    console.log('3. Replace PRIVATE_KEY_STRING with the private key');
    console.log('4. Run: npm run test:wallet');
    console.log('5. Test minting: npm run mint');
    
    console.log('\n🎯 This wallet is ready for testing!');
    console.log('💡 It has 3 SOL and can mint NFTs on devnet');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('429')) {
      console.log('💡 Rate limit reached. Try again in a few minutes.');
    } else {
      console.log('💡 Try using external faucets instead.');
    }
  }
}

createFundedWallet().catch(console.error);
