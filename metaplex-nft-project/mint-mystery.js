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

async function mintMysteryNFT(index) {
  try {
    console.log(`🔮 Minting Mystery NFT #${index}...`);
    
    // Create mystery metadata
    const mysteryMetadata = {
      name: `Mystery Alchemist #${index}`,
      description: "A mysterious alchemist awaits discovery... 🔮",
      image: "ipfs://YOUR_MYSTERY_IMAGE_CID", // Replace with your mystery image CID
      attributes: [
        {
          trait_type: "Status",
          value: "Mystery"
        },
        {
          trait_type: "Reveal Date",
          value: "TBA"
        }
      ],
      properties: {
        files: [
          {
            type: "image/png",
            uri: "ipfs://YOUR_MYSTERY_IMAGE_CID" // Replace with your mystery image CID
          }
        ]
      }
    };
    
    // For now, use placeholder mystery metadata
    // In production, you'd upload this to IPFS first
    const mysteryMetadataUri = `ipfs://YOUR_MYSTERY_METADATA_CID/${index}.json`;
    
    console.log(`📄 Mystery metadata created for #${index}`);
    console.log(`🔗 Mystery URI: ${mysteryMetadataUri}`);
    
    // Create NFT with mystery metadata
    const { nft } = await metaplex.nfts().create({
      name: mysteryMetadata.name,
      symbol: 'MYSTERY_ALCH',
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
    
    console.log(`✅ Mystery NFT #${index} minted successfully!`);
    console.log(`🔗 NFT Address: ${nft.address.toString()}`);
    console.log(`🌐 View on Solscan: https://solscan.io/token/${nft.address.toString()}`);
    
    // Save mint info
    const mintInfo = {
      index: index,
      name: mysteryMetadata.name,
      address: nft.address.toString(),
      solscan: `https://solscan.io/token/${nft.address.toString()}`,
      timestamp: new Date().toISOString(),
      type: 'mystery'
    };
    
    fs.appendFileSync('mint-log-mystery.json', JSON.stringify(mintInfo) + '\n');
    
    return nft;
  } catch (error) {
    console.error(`❌ Error minting Mystery NFT #${index}:`, error.message);
    
    // Save error to log
    const errorInfo = {
      index: index,
      error: error.message,
      timestamp: new Date().toISOString(),
      type: 'mystery'
    };
    fs.appendFileSync('error-log-mystery.json', JSON.stringify(errorInfo) + '\n');
    
    throw error;
  }
}

async function batchMintMysteryNFTs(startIndex, count) {
  console.log(`🔮 Starting Mystery NFT Batch Minting...`);
  console.log(`📍 Using Solana Mainnet`);
  console.log(`💰 Wallet address: ${keypair.publicKey.toString()}`);
  console.log(`🎯 Minting ${count} mystery NFTs starting from #${startIndex}`);
  console.log('---');
  
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
  
  for (let i = 0; i < count; i++) {
    const currentIndex = startIndex + i;
    
    try {
      await mintMysteryNFT(currentIndex);
      successCount++;
      
      // Delay between mints
      if (i < count - 1) {
        console.log('⏳ Waiting 3 seconds before next mint...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error) {
      errorCount++;
      console.log(`⚠️  Skipping to next NFT...`);
    }
  }
  
  console.log('---');
  console.log('🎉 Mystery NFT batch minting completed!');
  console.log(`✅ Successfully minted: ${successCount} NFTs`);
  console.log(`❌ Errors: ${errorCount} NFTs`);
  console.log(`📊 Total processed: ${count} NFTs`);
  console.log('📝 Check mint-log-mystery.json for successful mints');
  console.log('📝 Check error-log-mystery.json for failed mints');
}

async function main() {
  const args = process.argv.slice(2);
  const startIndex = parseInt(args[0]) || 1;
  const count = parseInt(args[1]) || 10;
  
  console.log('🔮 Mystery NFT Minting Tool');
  console.log('=' * 50);
  console.log(`🎯 Starting index: ${startIndex}`);
  console.log(`🎯 Count: ${count}`);
  console.log('=' * 50);
  
  await batchMintMysteryNFTs(startIndex, count);
}

main().catch(console.error);
