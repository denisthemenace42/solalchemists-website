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

// 🔑 WALLET SETUP: Use your actual wallet
const { walletKeypair } = require('./wallet-config');
const keypair = walletKeypair;

// Initialize Metaplex
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair));

async function airdropSOL() {
  if (config.batch.skipAirdrop) {
    console.log('⏭️  Skipping SOL airdrop (configured to skip)');
    return;
  }
  
  try {
    console.log('💰 Requesting SOL airdrop...');
    const signature = await connection.requestAirdrop(keypair.publicKey, config.batch.airdropAmount * 1e9);
    await connection.confirmTransaction(signature);
    console.log('✅ SOL airdropped successfully!');
    
    const balance = await connection.getBalance(keypair.publicKey);
    console.log(`💎 Wallet balance: ${balance / 1e9} SOL`);
  } catch (error) {
    console.error('❌ Error airdropping SOL:', error);
    console.log('💡 You can manually fund the wallet or set skipAirdrop: true in config');
    throw error;
  }
}

async function checkBalance() {
  const balance = await connection.getBalance(keypair.publicKey);
  console.log(`💎 Current wallet balance: ${balance / 1e9} SOL`);
  
  if (balance < 0.01 * 1e9) { // Less than 0.01 SOL
    console.log('⚠️  Warning: Low balance. You may need to fund the wallet manually.');
    console.log('💡 Visit: https://faucet.solana.com for test SOL');
  }
}

async function mintNFT(metadataPath, index) {
  try {
    // Read metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    console.log(`📄 [${index}] Loading: ${metadata.name}`);
    
            // Create NFT using existing IPFS metadata
        const fileName = path.basename(filePath);
        const metadataUri = `ipfs://bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a/${fileName}`;
        
        const { nft } = await metaplex.nfts().create({
          name: metadata.name,
          symbol: config.nft.symbol,
          sellerFeeBasisPoints: config.nft.sellerFeeBasisPoints,
          uri: metadataUri, // Use metadata JSON URI, not image URI
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
  console.log('💰 Test wallet address:', keypair.publicKey.toString());
  console.log('⚙️  Configuration:', JSON.stringify(config.batch, null, 2));
  console.log('---');
  
  // Check balance first
  await checkBalance();
  console.log('---');
  
  // Airdrop SOL if not skipped
  await airdropSOL();
  console.log('---');
  
  // Start batch minting
  await batchMint();
}

main().catch(console.error); 