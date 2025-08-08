const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const fs = require('fs');

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

// Track minted NFTs to avoid duplicates
const MINTED_NFTS_FILE = 'minted-nfts-tracker.json';

// Load or create minted NFTs tracker
function loadMintedNFTs() {
    try {
        if (fs.existsSync(MINTED_NFTS_FILE)) {
            return JSON.parse(fs.readFileSync(MINTED_NFTS_FILE, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading minted NFTs:', error);
    }
    return { minted: [], lastMinted: 0 };
}

// Save minted NFTs tracker
function saveMintedNFTs(data) {
    fs.writeFileSync(MINTED_NFTS_FILE, JSON.stringify(data, null, 2));
}

// Get next available NFT number
function getNextNFTNumber() {
    const tracker = loadMintedNFTs();
    return tracker.lastMinted + 1;
}

// Mark NFT as minted
function markNFTAsMinted(nftNumber, nftAddress) {
    const tracker = loadMintedNFTs();
    tracker.minted.push({
        number: nftNumber,
        address: nftAddress,
        timestamp: new Date().toISOString()
    });
    tracker.lastMinted = Math.max(tracker.lastMinted, nftNumber);
    saveMintedNFTs(tracker);
}

// Check if NFT number is already minted
function isNFTMinted(nftNumber) {
    const tracker = loadMintedNFTs();
    return tracker.minted.some(nft => nft.number === nftNumber);
}

// Mint NFT on demand
async function mintNFTOnDemand(nftNumber, userWalletAddress) {
    try {
        console.log(`🎯 Minting NFT #${nftNumber} on demand...`);
        
        // Validate NFT number
        if (nftNumber < 1 || nftNumber > COLLECTION_CONFIG.totalNFTs) {
            throw new Error(`Invalid NFT number: ${nftNumber}. Must be between 1 and ${COLLECTION_CONFIG.totalNFTs}`);
        }
        
        // Check if already minted
        if (isNFTMinted(nftNumber)) {
            console.log(`⚠️ NFT #${nftNumber} already minted, skipping...`);
            return { alreadyMinted: true, nftNumber };
        }
        
        // Connect to devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const metaplex = Metaplex.make(connection).use(keypairIdentity(walletKeypair));
        
        // Check wallet balance
        const balance = await connection.getBalance(walletKeypair.publicKey);
        console.log('💰 Wallet balance:', balance / 1e9, 'SOL');
        
        if (balance < 0.01 * 1e9) { // Need at least 0.01 SOL
            throw new Error('Insufficient SOL for minting. Need at least 0.01 SOL');
        }
        
        // Create metadata URI
        const metadataUri = `${COLLECTION_CONFIG.baseMetadataUri}/${nftNumber}.json`;
        
        console.log(`🔄 Creating NFT #${nftNumber}...`);
        
        // Mint the NFT
        const { nft } = await metaplex.nfts().create({
            name: `${COLLECTION_CONFIG.name} #${nftNumber}`,
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
        
        // Mark as minted
        markNFTAsMinted(nftNumber, nft.address.toString());
        
        const result = {
            success: true,
            nftNumber: nftNumber,
            nftAddress: nft.address.toString(),
            name: `${COLLECTION_CONFIG.name} #${nftNumber}`,
            metadataUri: metadataUri,
            imageUri: `${COLLECTION_CONFIG.baseImageUri}/${nftNumber}.png`,
            solscanUrl: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`,
            timestamp: new Date().toISOString(),
            userWallet: userWalletAddress
        };
        
        console.log(`✅ NFT #${nftNumber} minted successfully!`);
        console.log(`   Address: ${nft.address.toString()}`);
        console.log(`   Solscan: ${result.solscanUrl}`);
        
        // Save to log
        const logEntry = {
            ...result,
            type: 'on-demand-mint'
        };
        
        fs.appendFileSync('on-demand-mints.log', JSON.stringify(logEntry) + '\n');
        
        return result;
        
    } catch (error) {
        console.error(`❌ Failed to mint NFT #${nftNumber}:`, error.message);
        
        const errorLog = {
            timestamp: new Date().toISOString(),
            nftNumber: nftNumber,
            userWallet: userWalletAddress,
            error: error.message,
            type: 'on-demand-mint-error'
        };
        
        fs.appendFileSync('on-demand-mint-errors.log', JSON.stringify(errorLog) + '\n');
        
        throw error;
    }
}

// Get random NFT for reveal (mint if needed)
async function getRandomNFTForReveal(userWalletAddress) {
    try {
        console.log('🎲 Getting random NFT for reveal...');
        
        // Get random number
        const randomNumber = Math.floor(Math.random() * COLLECTION_CONFIG.totalNFTs) + 1;
        console.log(`🎯 Selected random NFT #${randomNumber}`);
        
        // Check if already minted
        if (isNFTMinted(randomNumber)) {
            console.log(`✅ NFT #${randomNumber} already exists, returning existing data`);
            
            const tracker = loadMintedNFTs();
            const existingNFT = tracker.minted.find(nft => nft.number === randomNumber);
            
            return {
                success: true,
                nftNumber: randomNumber,
                nftAddress: existingNFT.address,
                name: `${COLLECTION_CONFIG.name} #${randomNumber}`,
                metadataUri: `${COLLECTION_CONFIG.baseMetadataUri}/${randomNumber}.json`,
                imageUri: `${COLLECTION_CONFIG.baseImageUri}/${randomNumber}.png`,
                solscanUrl: `https://solscan.io/token/${existingNFT.address}?cluster=devnet`,
                alreadyMinted: true,
                timestamp: new Date().toISOString()
            };
        }
        
        // Mint on demand
        console.log(`🔄 NFT #${randomNumber} not minted yet, minting on demand...`);
        return await mintNFTOnDemand(randomNumber, userWalletAddress);
        
    } catch (error) {
        console.error('❌ Failed to get random NFT for reveal:', error.message);
        throw error;
    }
}

// Get specific NFT (mint if needed)
async function getSpecificNFT(nftNumber, userWalletAddress) {
    try {
        console.log(`🎯 Getting specific NFT #${nftNumber}...`);
        
        // Check if already minted
        if (isNFTMinted(nftNumber)) {
            console.log(`✅ NFT #${nftNumber} already exists`);
            
            const tracker = loadMintedNFTs();
            const existingNFT = tracker.minted.find(nft => nft.number === nftNumber);
            
            return {
                success: true,
                nftNumber: nftNumber,
                nftAddress: existingNFT.address,
                name: `${COLLECTION_CONFIG.name} #${nftNumber}`,
                metadataUri: `${COLLECTION_CONFIG.baseMetadataUri}/${nftNumber}.json`,
                imageUri: `${COLLECTION_CONFIG.baseImageUri}/${nftNumber}.png`,
                solscanUrl: `https://solscan.io/token/${existingNFT.address}?cluster=devnet`,
                alreadyMinted: true,
                timestamp: new Date().toISOString()
            };
        }
        
        // Mint on demand
        console.log(`🔄 NFT #${nftNumber} not minted yet, minting on demand...`);
        return await mintNFTOnDemand(nftNumber, userWalletAddress);
        
    } catch (error) {
        console.error(`❌ Failed to get specific NFT #${nftNumber}:`, error.message);
        throw error;
    }
}

// Get minting statistics
function getMintingStats() {
    const tracker = loadMintedNFTs();
    const totalMinted = tracker.minted.length;
    const totalAvailable = COLLECTION_CONFIG.totalNFTs;
    const remaining = totalAvailable - totalMinted;
    
    return {
        totalMinted,
        totalAvailable,
        remaining,
        progress: ((totalMinted / totalAvailable) * 100).toFixed(2) + '%',
        lastMinted: tracker.lastMinted,
        estimatedCostRemaining: (remaining * 0.005).toFixed(3) + ' SOL'
    };
}

// Export functions
module.exports = {
    mintNFTOnDemand,
    getRandomNFTForReveal,
    getSpecificNFT,
    getMintingStats,
    isNFTMinted,
    loadMintedNFTs,
    COLLECTION_CONFIG
};

// Run if this script is executed directly
if (require.main === module) {
    const command = process.argv[2];
    const nftNumber = parseInt(process.argv[3]);
    
    switch (command) {
        case 'random':
            getRandomNFTForReveal('test-user').then(console.log).catch(console.error);
            break;
        case 'specific':
            if (!nftNumber) {
                console.log('Usage: node mint-on-demand-reveal.js specific <nft-number>');
                break;
            }
            getSpecificNFT(nftNumber, 'test-user').then(console.log).catch(console.error);
            break;
        case 'stats':
            console.log('📊 Minting Statistics:');
            console.log(JSON.stringify(getMintingStats(), null, 2));
            break;
        case 'minted':
            console.log('📋 Minted NFTs:');
            const tracker = loadMintedNFTs();
            console.log(JSON.stringify(tracker.minted, null, 2));
            break;
        default:
            console.log('🎯 SOLalchemists Mint-on-Demand Reveal System');
            console.log('============================================\n');
            console.log('Usage:');
            console.log('  node mint-on-demand-reveal.js random     - Get random NFT (mint if needed)');
            console.log('  node mint-on-demand-reveal.js specific <n> - Get specific NFT #n (mint if needed)');
            console.log('  node mint-on-demand-reveal.js stats      - Show minting statistics');
            console.log('  node mint-on-demand-reveal.js minted     - Show all minted NFTs');
            console.log('\n💰 Cost per mint: ~0.005 SOL');
            console.log('🎯 Perfect for gradual minting as users reveal!');
    }
}
