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

async function airdropSOL() {
  try {
    console.log('💰 Requesting SOL airdrop...');
    const signature = await connection.requestAirdrop(keypair.publicKey, 2 * 1e9); // 2 SOL
    await connection.confirmTransaction(signature);
    console.log('✅ SOL airdropped successfully!');
    
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`💎 Wallet balance: ${balance / 1e9} SOL`);
  } catch (error) {
    console.error('❌ Error airdropping SOL:', error);
    throw error;
  }
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
  
  // Airdrop SOL first
  await airdropSOL();
  console.log('---');
  
  // Create collection NFT
  await createCollection();
  
  console.log('---');
  console.log('🎉 Collection creation completed!');
  console.log('📝 Next steps:');
  console.log('   1. Use the collection address in your NFT minting scripts');
  console.log('   2. Deploy to mainnet when ready');
  console.log('   3. Apply for Metaplex Certification through Magic Eden');
}

main().catch(console.error); 