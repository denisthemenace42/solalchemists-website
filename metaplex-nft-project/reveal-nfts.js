const { 
  Metaplex, 
  keypairIdentity
} = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Configuration
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// 🔑 WALLET SETUP: Use your actual wallet
const { walletKeypair } = require('./wallet-config');
const keypair = walletKeypair;

// Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair));

async function revealNFT(nftAddress, realMetadataIndex) {
  try {
    console.log(`🎭 Revealing NFT: ${nftAddress}`);
    
    // Load the real metadata
    const metadataPath = `../build/json/${realMetadataIndex}.json`;
    const realMetadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    // Create the real metadata URI
    const realMetadataUri = `ipfs://bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a/${realMetadataIndex}.json`;
    
    console.log(`📄 Real metadata loaded: ${realMetadata.name}`);
    console.log(`🔗 Real metadata URI: ${realMetadataUri}`);
    
    // Update the NFT metadata
    const { response } = await metaplex.nfts().update({
      nftOrSft: { address: new PublicKey(nftAddress) },
      name: realMetadata.name,
      symbol: 'SOLALCH', // Change from MYSTERY_ALCH to SOLALCH
      uri: realMetadataUri,
      sellerFeeBasisPoints: 500,
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
          verified: true,
        },
      ],
    });
    
    console.log(`✅ NFT revealed successfully!`);
    console.log(`🔗 Transaction: ${response.signature}`);
    console.log(`🌐 View on Solscan: https://solscan.io/token/${nftAddress}`);
    
    // Save reveal info
    const revealInfo = {
      nftAddress: nftAddress,
      realMetadataIndex: realMetadataIndex,
      realName: realMetadata.name,
      transaction: response.signature,
      timestamp: new Date().toISOString(),
      type: 'reveal'
    };
    
    fs.appendFileSync('reveal-log.json', JSON.stringify(revealInfo) + '\n');
    
    return response;
  } catch (error) {
    console.error(`❌ Error revealing NFT ${nftAddress}:`, error.message);
    
    // Save error to log
    const errorInfo = {
      nftAddress: nftAddress,
      error: error.message,
      timestamp: new Date().toISOString(),
      type: 'reveal'
    };
    fs.appendFileSync('error-log-reveal.json', JSON.stringify(errorInfo) + '\n');
    
    throw error;
  }
}

async function batchRevealNFTs(mysteryLogFile) {
  console.log(`🎭 Starting NFT Reveal Process...`);
  console.log(`📍 Using Solana Mainnet`);
  console.log(`💰 Wallet address: ${keypair.publicKey.toString()}`);
  console.log('---');
  
  // Check if mystery log file exists
  if (!fs.existsSync(mysteryLogFile)) {
    console.log(`❌ Mystery log file not found: ${mysteryLogFile}`);
    console.log('💡 Run mystery minting first to create this file');
    return;
  }
  
  // Read mystery NFTs from log
  const mysteryNFTs = fs.readFileSync(mysteryLogFile, 'utf8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
  
  console.log(`📄 Found ${mysteryNFTs.length} mystery NFTs to reveal`);
  
  // Check current balance
  const balance = await connection.getBalance(keypair.publicKey);
  console.log('💰 Current wallet balance:', balance / 1e9, 'SOL');
  
  if (balance < 0.1 * 1e9) {
    console.log('❌ Insufficient SOL balance (need at least 0.1 SOL)');
    return;
  }
  
  console.log('---');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < mysteryNFTs.length; i++) {
    const mysteryNFT = mysteryNFTs[i];
    const realMetadataIndex = mysteryNFT.index; // Use the same index for real metadata
    
    try {
      await revealNFT(mysteryNFT.address, realMetadataIndex);
      successCount++;
      
      // Delay between reveals
      if (i < mysteryNFTs.length - 1) {
        console.log('⏳ Waiting 2 seconds before next reveal...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      errorCount++;
      console.log(`⚠️  Skipping to next NFT...`);
    }
  }
  
  console.log('---');
  console.log('🎉 NFT reveal process completed!');
  console.log(`✅ Successfully revealed: ${successCount} NFTs`);
  console.log(`❌ Errors: ${errorCount} NFTs`);
  console.log(`📊 Total processed: ${mysteryNFTs.length} NFTs`);
  console.log('📝 Check reveal-log.json for successful reveals');
  console.log('📝 Check error-log-reveal.json for failed reveals');
}

async function main() {
  const args = process.argv.slice(2);
  const mysteryLogFile = args[0] || 'mint-log-mystery.json';
  
  console.log('🎭 NFT Reveal Tool');
  console.log('=' * 50);
  console.log(`📄 Mystery log file: ${mysteryLogFile}`);
  console.log('=' * 50);
  
  await batchRevealNFTs(mysteryLogFile);
}

main().catch(console.error);
