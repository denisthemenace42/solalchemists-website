const { 
  Metaplex, 
  keypairIdentity
} = require('@metaplex-foundation/js');
const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Configuration
const connection = new Connection(config.network.endpoint, config.network.commitment);

// Use the wallet from our previous successful mint
// This is the wallet that already has SOL from our airdrop
const keypair = Keypair.fromSecretKey(new Uint8Array([
  174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
  222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
  15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
  121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135
]));

// Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair));

async function checkBalance() {
  const balance = await connection.getBalance(keypair.publicKey);
  console.log(`💎 Current wallet balance: ${balance / 1e9} SOL`);
  
  if (balance < 0.01 * 1e9) { // Less than 0.01 SOL
    console.log('⚠️  Warning: Low balance. You may need to fund the wallet manually.');
    console.log('💡 Visit: https://faucet.solana.com for test SOL');
    return false;
  }
  return true;
}

async function mintNFT(metadataPath, index) {
  try {
    // Read metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    console.log(`📄 [${index}] Loading: ${metadata.name}`);
    
    // Create NFT using existing IPFS metadata
    const { nft } = await metaplex.nfts().create({
      name: metadata.name,
      symbol: config.nft.symbol,
      sellerFeeBasisPoints: config.nft.sellerFeeBasisPoints,
      uri: metadata.image, // Use the IPFS URL from metadata
      isMutable: config.nft.isMutable,
      maxSupply: config.nft.maxSupply,
      creators: [
        {
          address: keypair.publicKey,
          share: 100,
          verified: true,
        },
      ],
    });
    
    console.log(`✅ [${index}] NFT minted: ${nft.address.toString()}`);
    
    // Save mint info to a log file
    const mintInfo = {
      index: index,
      name: metadata.name,
      address: nft.address.toString(),
      solscan: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`,
      timestamp: new Date().toISOString()
    };
    
    fs.appendFileSync(config.paths.mintLogFile, JSON.stringify(mintInfo) + '\n');
    
    return nft;
  } catch (error) {
    console.error(`❌ [${index}] Error minting NFT:`, error.message);
    // Save error to log
    const errorInfo = {
      index: index,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    fs.appendFileSync(config.paths.errorLogFile, JSON.stringify(errorInfo) + '\n');
    throw error;
  }
}

async function batchMint() {
  try {
    const metadataDir = config.paths.metadataDir;
    const files = fs.readdirSync(metadataDir)
      .filter(file => file.endsWith('.json'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('.json', ''));
        const numB = parseInt(b.replace('.json', ''));
        return numA - numB;
      });
    
    // Limit files based on config
    const filesToProcess = files.slice(0, config.batch.maxNFTs);
    
    console.log(`📁 Found ${files.length} total metadata files`);
    console.log(`🎯 Processing ${filesToProcess.length} NFTs (limited by config)`);
    console.log('🚀 Starting batch minting...');
    console.log('---');
    
    // Clear previous logs
    if (fs.existsSync(config.paths.mintLogFile)) fs.unlinkSync(config.paths.mintLogFile);
    if (fs.existsSync(config.paths.errorLogFile)) fs.unlinkSync(config.paths.errorLogFile);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const index = i + 1;
      const metadataPath = path.join(metadataDir, file);
      
      try {
        await mintNFT(metadataPath, index);
        successCount++;
        
        // Add delay between mints to avoid rate limiting
        if (i < filesToProcess.length - 1) {
          console.log(`⏳ Waiting ${config.batch.delayBetweenMints/1000} seconds before next mint...`);
          await new Promise(resolve => setTimeout(resolve, config.batch.delayBetweenMints));
        }
        
      } catch (error) {
        errorCount++;
        console.log(`⚠️  [${index}] Skipping to next NFT...`);
        
        // Continue with next NFT instead of stopping
        continue;
      }
    }
    
    console.log('---');
    console.log('🎉 Batch minting completed!');
    console.log(`✅ Successfully minted: ${successCount} NFTs`);
    console.log(`❌ Errors: ${errorCount} NFTs`);
    console.log(`📊 Total processed: ${filesToProcess.length} NFTs`);
    console.log('📝 Check mint-log.json for successful mints');
    console.log('📝 Check error-log.json for failed mints');
    
  } catch (error) {
    console.error('❌ Batch minting failed:', error);
  }
}

async function main() {
  console.log('🚀 Starting batch NFT minting process...');
  console.log('📍 Using Solana Devnet');
  console.log('💰 Using existing wallet with SOL');
  console.log('⚙️  Configuration:', JSON.stringify(config.batch, null, 2));
  console.log('---');
  
  // Check balance first
  const hasBalance = await checkBalance();
  if (!hasBalance) {
    console.log('❌ Insufficient balance. Please fund the wallet first.');
    return;
  }
  console.log('---');
  
  // Start batch minting
  await batchMint();
}

main().catch(console.error); 