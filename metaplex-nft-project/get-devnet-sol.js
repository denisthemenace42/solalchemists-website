const { Connection, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { walletKeypair } = require('./wallet-config');

async function getDevnetSOL() {
  console.log('💰 Getting Devnet SOL...');
  console.log('=' * 50);
  
  try {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const walletAddress = walletKeypair.publicKey.toString();
    
    console.log('🔑 Wallet address:', walletAddress);
    
    // Check current balance
    const balance = await connection.getBalance(walletKeypair.publicKey);
    console.log('💰 Current balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    if (balance > 0) {
      console.log('✅ Wallet already has SOL!');
      return;
    }
    
    // Try airdrop
    console.log('🔄 Requesting airdrop...');
    const signature = await connection.requestAirdrop(walletKeypair.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature);
    
    const newBalance = await connection.getBalance(walletKeypair.publicKey);
    console.log('✅ Airdrop successful!');
    console.log('💰 New balance:', newBalance / LAMPORTS_PER_SOL, 'SOL');
    
  } catch (error) {
    console.error('❌ Airdrop failed:', error.message);
    console.log('\n💡 Alternative methods:');
    console.log('1. Use external faucets:');
    console.log('   - https://faucet.solana.com/');
    console.log('   - https://solfaucet.com/');
    console.log('2. Copy your wallet address above');
    console.log('3. Paste it in the faucet website');
    console.log('4. Request devnet SOL');
  }
}

getDevnetSOL().catch(console.error);
