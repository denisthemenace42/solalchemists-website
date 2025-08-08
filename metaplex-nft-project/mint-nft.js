const { 
  Metaplex, 
  keypairIdentity
} = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Configuration
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// 🔑 WALLET SETUP: Replace the generated keypair with your actual wallet
// Option 1: Use your actual wallet (for mainnet)
const { walletKeypair } = require('./wallet-config');
const keypair = walletKeypair;

// Option 2: Use generated keypair (for testing only)
// const keypair = Keypair.generate(); // For testing - use your actual keypair in production

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

async function mintNFT(metadataPath) {
  try {
    // Read metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    console.log('📄 Metadata loaded:', metadata.name);
    console.log('🖼️  Image URI:', metadata.image);
    
    // Create NFT using existing IPFS metadata
    const fileName = path.basename(metadataPath);
    const metadataUri = `ipfs://bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a/${fileName}`;
    
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
  console.log('🚀 Starting NFT minting process...');
  console.log('📍 Using Solana Devnet');
  console.log('💰 Test wallet address:', keypair.publicKey.toString());
  console.log('---');
  
  // Check current balance first
  const balance = await connection.getBalance(keypair.publicKey);
  console.log('💰 Current wallet balance:', balance / 1e9, 'SOL');
  
  // Only airdrop if balance is 0
  if (balance === 0) {
    console.log('⚠️  Wallet has 0 SOL, requesting airdrop...');
    await airdropSOL();
  } else {
    console.log('✅ Wallet has sufficient SOL, skipping airdrop');
  }
  console.log('---');
  
  // Example: Mint first NFT
  const metadataPath = '../build/json/1.json';
  
  if (fs.existsSync(metadataPath)) {
    console.log('📁 Found metadata file:', metadataPath);
    await mintNFT(metadataPath);
  } else {
    console.log('⚠️  Metadata file not found:', metadataPath);
    console.log('💡 Make sure the path is correct relative to this script');
  }
}

main().catch(console.error); 