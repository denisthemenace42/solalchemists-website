const { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');

async function createAndFundWallet() {
  console.log('💰 Creating and Funding Wallet...');
  console.log('=' * 50);
  
  try {
    // Connect to devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Create a new wallet
    const newWallet = Keypair.generate();
    console.log('🔑 New wallet created:', newWallet.publicKey.toString());
    
    // Request airdrop to the new wallet
    console.log('🔄 Requesting airdrop to new wallet...');
    const airdropSignature = await connection.requestAirdrop(newWallet.publicKey, 3 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature);
    
    const balance = await connection.getBalance(newWallet.publicKey);
    console.log('✅ Airdrop successful!');
    console.log('💰 New wallet balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    // Get your Solflare address
    console.log('\n📋 Enter your Solflare devnet address:');
    console.log('💡 Copy your address from Solflare wallet');
    console.log('💡 Or run: npm run test:wallet (if you have wallet-config.js set up)');
    
    // For now, we'll create a placeholder
    // You'll need to replace this with your actual Solflare address
    const solflareAddress = "YOUR_SOLFLARE_DEVNET_ADDRESS_HERE"; // Replace this!
    
    if (solflareAddress === "YOUR_SOLFLARE_DEVNET_ADDRESS_HERE") {
      console.log('\n⚠️  Please update the script with your Solflare address');
      console.log('💡 Replace solflareAddress with your actual devnet address');
      console.log('💡 Then run this script again');
      return;
    }
    
    // Send SOL to your Solflare wallet
    console.log('\n🔄 Sending SOL to your Solflare wallet...');
    const recipientPubkey = new PublicKey(solflareAddress);
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: newWallet.publicKey,
        toPubkey: recipientPubkey,
        lamports: 2 * LAMPORTS_PER_SOL, // Send 2 SOL
      })
    );
    
    const signature = await connection.sendTransaction(transaction, [newWallet]);
    await connection.confirmTransaction(signature);
    
    console.log('✅ SOL sent successfully!');
    console.log('🔗 Transaction:', signature);
    console.log('💰 Sent: 2 SOL to your Solflare wallet');
    
    // Check final balances
    const newWalletBalance = await connection.getBalance(newWallet.publicKey);
    const solflareBalance = await connection.getBalance(recipientPubkey);
    
    console.log('\n📊 Final Balances:');
    console.log('💰 New wallet:', newWalletBalance / LAMPORTS_PER_SOL, 'SOL');
    console.log('💰 Your Solflare wallet:', solflareBalance / LAMPORTS_PER_SOL, 'SOL');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Check your Solflare wallet - you should see 2 SOL');
    console.log('2. Test minting: npm run mint');
    console.log('3. Test batch minting: npm run batch-mint');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('429')) {
      console.log('💡 Rate limit reached. Try again in a few minutes.');
    } else if (error.message.includes('Invalid public key')) {
      console.log('💡 Make sure you entered a valid Solana address.');
    }
  }
}

// Alternative: Just create a funded wallet and show the details
async function createFundedWalletOnly() {
  console.log('💰 Creating Funded Wallet...');
  console.log('=' * 50);
  
  try {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const newWallet = Keypair.generate();
    
    console.log('🔑 New wallet created:', newWallet.publicKey.toString());
    
    // Request airdrop
    console.log('🔄 Requesting airdrop...');
    const signature = await connection.requestAirdrop(newWallet.publicKey, 3 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(signature);
    
    const balance = await connection.getBalance(newWallet.publicKey);
    console.log('✅ Airdrop successful!');
    console.log('💰 Balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    console.log('\n📋 Wallet Details:');
    console.log('🔑 Public Key:', newWallet.publicKey.toString());
    console.log('🔐 Private Key:', Array.from(newWallet.secretKey).join(','));
    console.log('💰 Balance:', balance / LAMPORTS_PER_SOL, 'SOL');
    
    console.log('\n💡 To use this wallet:');
    console.log('1. Copy the private key above');
    console.log('2. Update wallet-config.js with this private key');
    console.log('3. Run: npm run test:wallet');
    console.log('4. Test minting: npm run mint');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
if (args.includes('--create-only')) {
  createFundedWalletOnly();
} else {
  createAndFundWallet();
}
