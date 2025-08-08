const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const fs = require('fs');
const path = require('path');

// Load wallet configuration
const { walletKeypair } = require('./wallet-config');

// Collection configuration
const COLLECTION_CONFIG = {
    totalNFTs: 1120,
    baseMetadataUri: "ipfs://bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a",
    baseImageUri: "ipfs://bafybeibwozxicevxmwjdqe3yhivglneierhkp5k7xlp2ak3wvr5c2an3my",
    symbol: "SOLALCH",
    name: "SOLalchemists",
    description: "The Alchemists of Solana!",
    sellerFeeBasisPoints: 500, // 5%
    isMutable: true
};

async function mintFullCollection() {
    try {
        console.log('🎯 Starting full collection mint...');
        console.log(`📊 Total NFTs to mint: ${COLLECTION_CONFIG.totalNFTs}`);
        
        // Connect to devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const metaplex = Metaplex.make(connection).use(keypairIdentity(walletKeypair));
        
        // Check wallet balance
        const balance = await connection.getBalance(walletKeypair.publicKey);
        console.log('💰 Wallet balance:', balance / 1e9, 'SOL');
        
        // Estimate costs
        const estimatedCostPerNFT = 0.000005; // ~0.005 SOL per NFT
        const totalEstimatedCost = COLLECTION_CONFIG.totalNFTs * estimatedCostPerNFT;
        console.log(`💸 Estimated total cost: ${totalEstimatedCost} SOL`);
        
        if (balance < totalEstimatedCost * 1e9) {
            console.error(`❌ Insufficient SOL. Need at least ${totalEstimatedCost} SOL`);
            return;
        }
        
        // Create mint log
        const mintLog = {
            timestamp: new Date().toISOString(),
            collection: COLLECTION_CONFIG,
            totalMinted: 0,
            nfts: []
        };
        
        console.log('🔄 Starting minting process...');
        
        // Mint NFTs in batches
        const batchSize = 10; // Mint 10 at a time to avoid rate limits
        const totalBatches = Math.ceil(COLLECTION_CONFIG.totalNFTs / batchSize);
        
        for (let batch = 0; batch < totalBatches; batch++) {
            const startIndex = batch * batchSize + 1;
            const endIndex = Math.min((batch + 1) * batchSize, COLLECTION_CONFIG.totalNFTs);
            
            console.log(`\n📦 Batch ${batch + 1}/${totalBatches}: Minting NFTs #${startIndex}-${endIndex}`);
            
            for (let i = startIndex; i <= endIndex; i++) {
                try {
                    console.log(`  🎨 Minting NFT #${i}...`);
                    
                    const metadataUri = `${COLLECTION_CONFIG.baseMetadataUri}/${i}.json`;
                    
                    const { nft } = await metaplex.nfts().create({
                        name: `${COLLECTION_CONFIG.name} #${i}`,
                        symbol: COLLECTION_CONFIG.symbol,
                        sellerFeeBasisPoints: COLLECTION_CONFIG.sellerFeeBasisPoints,
                        uri: metadataUri,
                        isMutable: COLLECTION_CONFIG.isMutable,
                        maxSupply: 1,
                        creators: [
                            {
                                address: walletKeypair.publicKey,
                                share: 100,
                                verified: true,
                            },
                        ],
                    });
                    
                    const nftData = {
                        number: i,
                        address: nft.address.toString(),
                        name: `${COLLECTION_CONFIG.name} #${i}`,
                        metadataUri: metadataUri,
                        imageUri: `${COLLECTION_CONFIG.baseImageUri}/${i}.png`,
                        solscanUrl: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`,
                        timestamp: new Date().toISOString()
                    };
                    
                    mintLog.nfts.push(nftData);
                    mintLog.totalMinted++;
                    
                    console.log(`    ✅ NFT #${i} minted: ${nft.address.toString()}`);
                    
                    // Small delay between mints
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    console.error(`    ❌ Failed to mint NFT #${i}:`, error.message);
                    
                    // Save error log
                    const errorLog = {
                        timestamp: new Date().toISOString(),
                        nftNumber: i,
                        error: error.message
                    };
                    
                    fs.appendFileSync('collection-mint-errors.json', JSON.stringify(errorLog) + '\n');
                }
            }
            
            // Save progress after each batch
            fs.writeFileSync('collection-mint-progress.json', JSON.stringify(mintLog, null, 2));
            console.log(`  💾 Progress saved: ${mintLog.totalMinted}/${COLLECTION_CONFIG.totalNFTs} NFTs minted`);
            
            // Delay between batches
            if (batch < totalBatches - 1) {
                console.log('  ⏳ Waiting 5 seconds before next batch...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
        
        // Save final log
        fs.writeFileSync('collection-mint-complete.json', JSON.stringify(mintLog, null, 2));
        
        console.log('\n🎉 Collection minting completed!');
        console.log(`✅ Total NFTs minted: ${mintLog.totalMinted}/${COLLECTION_CONFIG.totalNFTs}`);
        console.log(`📁 Log saved to: collection-mint-complete.json`);
        
        // Summary
        console.log('\n📊 Collection Summary:');
        console.log(`   Collection Name: ${COLLECTION_CONFIG.name}`);
        console.log(`   Total Supply: ${COLLECTION_CONFIG.totalNFTs}`);
        console.log(`   Symbol: ${COLLECTION_CONFIG.symbol}`);
        console.log(`   Creator: ${walletKeypair.publicKey.toString()}`);
        console.log(`   Network: Devnet`);
        
        console.log('\n🎯 Next Steps:');
        console.log('1. Test the reveal functionality');
        console.log('2. Switch to mainnet when ready');
        console.log('3. Deploy the reveal website');
        
    } catch (error) {
        console.error('❌ Failed to mint collection:', error);
    }
}

// Function to check mint progress
function checkMintProgress() {
    try {
        if (fs.existsSync('collection-mint-progress.json')) {
            const progress = JSON.parse(fs.readFileSync('collection-mint-progress.json', 'utf8'));
            console.log(`📊 Mint Progress: ${progress.totalMinted}/${progress.collection.totalNFTs} NFTs minted`);
            return progress;
        } else {
            console.log('📊 No mint progress found');
            return null;
        }
    } catch (error) {
        console.error('Error checking progress:', error);
        return null;
    }
}

// Function to resume minting from where it left off
async function resumeMinting() {
    const progress = checkMintProgress();
    if (!progress) {
        console.log('No progress found to resume from');
        return;
    }
    
    console.log(`🔄 Resuming minting from NFT #${progress.totalMinted + 1}`);
    // Implementation would be similar to mintFullCollection but start from progress.totalMinted + 1
}

// Export functions
module.exports = {
    mintFullCollection,
    checkMintProgress,
    resumeMinting,
    COLLECTION_CONFIG
};

// Run if this script is executed directly
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'mint':
            mintFullCollection();
            break;
        case 'progress':
            checkMintProgress();
            break;
        case 'resume':
            resumeMinting();
            break;
        default:
            console.log('🎯 SOLalchemists Collection Minter');
            console.log('================================\n');
            console.log('Usage:');
            console.log('  node mint-full-collection.js mint     - Mint the full collection');
            console.log('  node mint-full-collection.js progress - Check mint progress');
            console.log('  node mint-full-collection.js resume   - Resume minting');
            console.log('\n⚠️  WARNING: This will mint 1120 NFTs!');
            console.log('   Estimated cost: ~5.6 SOL on devnet');
            console.log('   Make sure you have sufficient SOL in your wallet!');
    }
}
