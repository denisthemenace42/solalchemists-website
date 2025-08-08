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
    const signature = await connection.requestAirdrop(keypair.publicKey, 5 * 1e9); // 5 SOL for batch minting
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
    
    return collection;
  } catch (error) {
    console.error('❌ Error creating collection:', error);
    throw error;
  }
}

async function mintNFT(metadataPath, index, collectionAddress) {
  try {
    // Read metadata
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    
    console.log(`📄 [${index}] Loading: ${metadata.name}`);
    
    // Create NFT using existing IPFS metadata with collection reference
    const { nft } = await metaplex.nfts().create({
      name: metadata.name,
      symbol: config.nft.symbol,
      sellerFeeBasisPoints: config.nft.sellerFeeBasisPoints,
      uri: metadata.image, // Use the IPFS URL from metadata
      isMutable: config.nft.isMutable,
      maxSupply: config.nft.maxSupply,
      collection: collectionAddress, // Reference to collection NFT
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
      collection: collectionAddress.toString(),
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

async function batchMintWithCollection() {
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
    console.log('🚀 Starting batch minting with collection...');
    console.log('---');
    
    // Clear previous logs
    if (fs.existsSync(config.paths.mintLogFile)) fs.unlinkSync(config.paths.mintLogFile);
    if (fs.existsSync(config.paths.errorLogFile)) fs.unlinkSync(config.paths.errorLogFile);
    
    // Create collection first
    const collection = await createCollection();
    console.log('---');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const index = i + 1;
      const metadataPath = path.join(metadataDir, file);
      
      try {
        await mintNFT(metadataPath, index, collection.address);
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
    console.log('🎉 Batch minting with collection completed!');
    console.log(`✅ Successfully minted: ${successCount} NFTs`);
    console.log(`❌ Errors: ${errorCount} NFTs`);
    console.log(`📊 Total processed: ${filesToProcess.length} NFTs`);
    console.log(`🏗️  Collection Address: ${collection.address.toString()}`);
    console.log('📝 Check mint-log.json for successful mints');
    console.log('📝 Check error-log.json for failed mints');
    
    // Save final collection info
    const finalCollectionInfo = {
      address: collection.address.toString(),
      name: "SOLalchemists Collection",
      symbol: "SOLALCH",
      totalMinted: successCount,
      solscan: `https://solscan.io/token/${collection.address.toString()}?cluster=devnet`,
      timestamp: new Date().toISOString(),
      wallet: keypair.publicKey.toString()
    };
    
    fs.writeFileSync('final-collection-info.json', JSON.stringify(finalCollectionInfo, null, 2));
    console.log('📝 Final collection info saved to final-collection-info.json');
    
  } catch (error) {
    console.error('❌ Batch minting failed:', error);
  }
}

async function main() {
  console.log('🚀 Starting batch NFT minting with collection...');
  console.log('📍 Using Solana Devnet');
  console.log('💰 Test wallet address:', keypair.publicKey.toString());
  console.log('⚙️  Configuration:', JSON.stringify(config.batch, null, 2));
  console.log('---');
  
  // Airdrop SOL first
  await airdropSOL();
  console.log('---');
  
  // Start batch minting with collection
  await batchMintWithCollection();
}

main().catch(console.error); 