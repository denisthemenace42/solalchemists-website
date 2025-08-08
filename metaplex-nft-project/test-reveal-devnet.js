const { 
  Metaplex, 
  keypairIdentity
} = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Devnet configuration
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// 🔑 WALLET SETUP: Use your actual wallet
const { walletKeypair } = require('./wallet-config');
const keypair = walletKeypair;

// Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair));

async function createMysteryNFTForTesting() {
  try {
    console.log('🔮 Creating Mystery NFT for Testing...');
    console.log(`📍 Using Solana Devnet`);
    console.log(`💰 Wallet address: ${keypair.publicKey.toString()}`);
    console.log('---');
    
    // Check current balance
    const balance = await connection.getBalance(keypair.publicKey);
    console.log('💰 Current wallet balance:', balance / 1e9, 'SOL');
    
    if (balance < 0.1 * 1e9) {
      console.log('❌ Insufficient SOL balance (need at least 0.1 SOL)');
      console.log('💡 Run: npm run airdrop:devnet');
      return;
    }
    
    console.log('---');
    
    // For testing, we'll use a simple metadata URI
    // This points to a simple JSON file that we'll create
    const mysteryMetadataUri = "https://gist.githubusercontent.com/test/raw/mystery-test.json";
    
    console.log(`📄 Using test metadata URI for mystery NFT`);
    console.log(`🔗 Mystery URI: ${mysteryMetadataUri}`);
    
    // Create NFT with mystery metadata
    const { nft } = await metaplex.nfts().create({
      name: "Mystery Alchemist #TEST",
      symbol: 'MYST', // Shorter symbol
      sellerFeeBasisPoints: 500, // 5%
      uri: mysteryMetadataUri,
      isMutable: true, // Important: Keep mutable for reveal
      maxSupply: 1,
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
          verified: true,
        },
      ],
    });
    
    console.log('✅ Mystery NFT created successfully for testing!');
    console.log(`🔗 NFT Address: ${nft.address.toString()}`);
    console.log(`🌐 View on Solscan: https://solscan.io/token/${nft.address.toString()}?cluster=devnet`);
    console.log('---');
    
    // Save test NFT info
    const testNFTInfo = {
      name: "Mystery Alchemist #TEST",
      address: nft.address.toString(),
      solscan: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`,
      timestamp: new Date().toISOString(),
      type: 'mystery-test',
      network: 'devnet'
    };
    
    fs.writeFileSync('test-mystery-nft.json', JSON.stringify(testNFTInfo, null, 2));
    
    console.log('📝 Test NFT info saved to: test-mystery-nft.json');
    console.log('---');
    console.log('🎯 Next Steps:');
    console.log('1. The reveal website is already configured for devnet');
    console.log('2. Start the reveal website: npm run reveal:serve');
    console.log('3. Connect your wallet and test the reveal!');
    console.log('4. Note: The mystery NFT will show as "not found" initially');
    console.log('   This is expected since we used a test URI');
    
    return nft;
    
  } catch (error) {
    console.error('❌ Error creating mystery NFT:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🧪 Mystery NFT Testing Setup');
  console.log('=' * 50);
  
  await createMysteryNFTForTesting();
}

main().catch(console.error);
