const { 
  Metaplex, 
  keypairIdentity
} = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Configuration
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const keypair = Keypair.generate(); // For testing - use your actual keypair in production

// Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair));

async function checkBalance() {
  const balance = await connection.getBalance(keypair.publicKey);
  console.log(`💎 Current wallet balance: ${balance / 1e9} SOL`);
  
  if (balance < 0.01 * 1e9) { // Less than 0.01 SOL
    console.log('⚠️  Warning: Low balance. You need to fund the wallet manually.');
    console.log('💡 Visit: https://faucet.solana.com for test SOL');
    console.log('💡 Or use: https://solfaucet.com/');
    console.log('💡 Wallet address:', keypair.publicKey.toString());
    return false;
  }
  return true;
}

async function createCollection() {
  try {
    console.log('🏗️  Creating collection NFT...');
    
    // Create the collection NFT
    const { nft: collection } = await metaplex.nfts().create({
      name: "SOLalchemists Collection",
      symbol: "SOLALCH",
      sellerFeeBasisPoints: 500, // 5% royalty
      isCollection: true, // This makes it a collection NFT
      isMutable: true,
      maxSupply: 0, // Collection NFTs don't have a max supply
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
          verified: true,
        },
      ],
    });
    
    console.log('✅ Collection NFT created successfully!');
    console.log(`🔗 Collection Address: ${collection.address.toString()}`);
    console.log(`🌐 View on Solscan: https://solscan.io/token/${collection.address.toString()}?cluster=devnet`);
    
    // Save collection info to file
    const collectionInfo = {
      address: collection.address.toString(),
      name: "SOLalchemists Collection",
      symbol: "SOLALCH",
      solscan: `https://solscan.io/token/${collection.address.toString()}?cluster=devnet`,
      timestamp: new Date().toISOString(),
      wallet: keypair.publicKey.toString()
    };
    
    fs.writeFileSync('collection-info.json', JSON.stringify(collectionInfo, null, 2));
    console.log('📝 Collection info saved to collection-info.json');
    
    return collection;
  } catch (error) {
    console.error('❌ Error creating collection:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting collection creation process...');
  console.log('📍 Using Solana Devnet');
  console.log('💰 Test wallet address:', keypair.publicKey.toString());
  console.log('---');
  
  // Check balance first
  const hasBalance = await checkBalance();
  if (!hasBalance) {
    console.log('❌ Insufficient balance. Please fund the wallet first.');
    console.log('💡 You can fund it manually and then run this script again.');
    return;
  }
  console.log('---');
  
  // Create collection NFT
  await createCollection();
  
  console.log('---');
  console.log('🎉 Collection creation completed!');
  console.log('📝 Next steps:');
  console.log('   1. Use the collection address in your NFT minting scripts');
  console.log('   2. Deploy to mainnet when ready');
  console.log('   3. Apply for Metaplex Certification through Magic Eden');
  console.log('   4. Use Magic Eden Creator Studio for management');
}

main().catch(console.error); 