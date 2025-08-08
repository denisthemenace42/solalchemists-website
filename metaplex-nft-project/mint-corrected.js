const { 
  Metaplex, 
  keypairIdentity
} = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Configuration
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// 🔑 WALLET SETUP: Use your actual wallet
const { walletKeypair } = require('./wallet-config');
const keypair = walletKeypair;

// Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair));

async function mintNFTWithCorrectMetadata(metadataPath) {
  try {
    // Read metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    console.log('📄 Metadata loaded:', metadata.name);
    console.log('🖼️  Image URI:', metadata.image);
    console.log('📊 Attributes:', metadata.attributes.length, 'traits');
    
    // Create the correct metadata URI
    // This should point to the metadata JSON file, not the image
    const fileName = path.basename(metadataPath);
    const metadataUri = `ipfs://bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a/${fileName}`;
    
    console.log('🔗 Metadata URI:', metadataUri);
    
    // Create NFT with correct metadata URI
    const { nft } = await metaplex.nfts().create({
      name: metadata.name,
      symbol: 'SOLALCH',
      sellerFeeBasisPoints: 500, // 5%
      uri: metadataUri, // Use metadata JSON URI, not image URI
      isMutable: true,
      maxSupply: 1,
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
          verified: true,
        },
      ],
    });
    
    console.log(`✅ NFT minted successfully!`);
    console.log(`🔗 NFT Address: ${nft.address.toString()}`);
    console.log(`🌐 View on Solscan: https://solscan.io/token/${nft.address.toString()}?cluster=devnet`);
    
    return nft;
  } catch (error) {
    console.error('❌ Error minting NFT:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Corrected NFT Minting...');
  console.log('📍 Using Solana Devnet');
  console.log('💰 Wallet address:', keypair.publicKey.toString());
  console.log('---');
  
  // Check current balance
  const balance = await connection.getBalance(keypair.publicKey);
  console.log('💰 Current wallet balance:', balance / 1e9, 'SOL');
  
  if (balance < 0.01 * 1e9) {
    console.log('❌ Insufficient SOL balance');
    return;
  }
  
  console.log('---');
  
  // Mint NFT with correct metadata
  const metadataPath = '../build/json/1.json';
  
  if (fs.existsSync(metadataPath)) {
    console.log('📁 Found metadata file:', metadataPath);
    await mintNFTWithCorrectMetadata(metadataPath);
  } else {
    console.log('⚠️  Metadata file not found:', metadataPath);
  }
}

main().catch(console.error);
