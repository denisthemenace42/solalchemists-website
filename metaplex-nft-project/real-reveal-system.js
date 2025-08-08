const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity, walletAdapterIdentity } = require('@metaplex-foundation/js');
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

// Check if NFT number is already minted
function isNFTMinted(nftNumber) {
    const tracker = loadMintedNFTs();
    return tracker.minted.some(nft => nft.number === nftNumber);
}

// Mark NFT as minted
function markNFTAsMinted(nftNumber, nftAddress, userWallet) {
    const tracker = loadMintedNFTs();
    tracker.minted.push({
        number: nftNumber,
        address: nftAddress,
        userWallet: userWallet,
        timestamp: new Date().toISOString()
    });
    tracker.lastMinted = Math.max(tracker.lastMinted, nftNumber);
    saveMintedNFTs(tracker);
}

// Real reveal function - mints NFT to user's wallet
async function revealNFTToUser(userWalletAddress, nftNumber = null) {
    try {
        console.log('🎯 Starting real NFT reveal...');
        console.log('👤 User wallet:', userWalletAddress);
        
        // Connect to devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const metaplex = Metaplex.make(connection).use(keypairIdentity(walletKeypair));
        
        // Check your wallet balance
        const balance = await connection.getBalance(walletKeypair.publicKey);
        console.log('💰 Your wallet balance:', balance / 1e9, 'SOL');
        
        if (balance < 0.01 * 1e9) {
            throw new Error('Insufficient SOL for minting. Need at least 0.01 SOL');
        }
        
        // Get random NFT number if not specified
        if (!nftNumber) {
            // Get all available (unminted) NFT numbers
            const availableNumbers = [];
            for (let i = 1; i <= COLLECTION_CONFIG.totalNFTs; i++) {
                if (!isNFTMinted(i)) {
                    availableNumbers.push(i);
                }
            }
            
            if (availableNumbers.length === 0) {
                throw new Error('All 1120 NFTs have been revealed! Collection is complete.');
            }
            
            // Select random from available numbers
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            nftNumber = availableNumbers[randomIndex];
            console.log(`🎲 Selected random NFT #${nftNumber} from ${availableNumbers.length} available`);
        }
        
        // Check if already minted (double-check)
        if (isNFTMinted(nftNumber)) {
            throw new Error(`NFT #${nftNumber} is already minted. Please try again.`);
        }
        
        // Validate NFT number
        if (nftNumber < 1 || nftNumber > COLLECTION_CONFIG.totalNFTs) {
            throw new Error(`Invalid NFT number: ${nftNumber}. Must be between 1 and ${COLLECTION_CONFIG.totalNFTs}`);
        }
        
        // Create metadata URI
        const metadataUri = `${COLLECTION_CONFIG.baseMetadataUri}/${nftNumber}.json`;
        
        console.log(`🔄 Minting NFT #${nftNumber} to user's wallet...`);
        
        // Mint the NFT (you pay for it, but it goes to user's wallet)
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
            // This is the key part - mint to user's wallet
            tokenOwner: new PublicKey(userWalletAddress),
        });
        
        // Mark as minted
        markNFTAsMinted(nftNumber, nft.address.toString(), userWalletAddress);
        
        const result = {
            success: true,
            nftNumber: nftNumber,
            nftAddress: nft.address.toString(),
            name: `${COLLECTION_CONFIG.name} #${nftNumber}`,
            metadataUri: metadataUri,
            imageUri: `${COLLECTION_CONFIG.baseImageUri}/${nftNumber}.png`,
            solscanUrl: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`,
            userWallet: userWalletAddress,
            timestamp: new Date().toISOString()
        };
        
        console.log(`✅ NFT #${nftNumber} minted successfully to user's wallet!`);
        console.log(`   NFT Address: ${nft.address.toString()}`);
        console.log(`   User Wallet: ${userWalletAddress}`);
        console.log(`   Solscan: ${result.solscanUrl}`);
        
        // Save to log
        const logEntry = {
            ...result,
            type: 'real-reveal-mint'
        };
        
        fs.appendFileSync('real-reveals.log', JSON.stringify(logEntry) + '\n');
        
        return result;
        
    } catch (error) {
        console.error('❌ Failed to reveal NFT:', error.message);
        
        const errorLog = {
            timestamp: new Date().toISOString(),
            userWallet: userWalletAddress,
            nftNumber: nftNumber,
            error: error.message,
            type: 'real-reveal-error'
        };
        
        fs.appendFileSync('real-reveal-errors.log', JSON.stringify(errorLog) + '\n');
        
        throw error;
    }
}

// Function to get reveal statistics
function getRevealStats() {
    const tracker = loadMintedNFTs();
    const totalRevealed = tracker.minted.length;
    const totalAvailable = COLLECTION_CONFIG.totalNFTs;
    const remaining = totalAvailable - totalRevealed;
    
    return {
        totalRevealed,
        totalAvailable,
        remaining,
        progress: ((totalRevealed / totalAvailable) * 100).toFixed(2) + '%',
        lastRevealed: tracker.lastMinted,
        estimatedCostRemaining: (remaining * 0.005).toFixed(3) + ' SOL'
    };
}

// Export functions
module.exports = {
    revealNFTToUser,
    getRevealStats,
    isNFTMinted,
    loadMintedNFTs,
    COLLECTION_CONFIG
};

// Run if this script is executed directly
if (require.main === module) {
    const command = process.argv[2];
    const userWallet = process.argv[3];
    const nftNumber = parseInt(process.argv[4]);
    
    switch (command) {
        case 'reveal':
            if (!userWallet) {
                console.log('Usage: node real-reveal-system.js reveal <user-wallet-address> [nft-number]');
                break;
            }
            revealNFTToUser(userWallet, nftNumber).then(console.log).catch(console.error);
            break;
        case 'stats':
            console.log('📊 Reveal Statistics:');
            console.log(JSON.stringify(getRevealStats(), null, 2));
            break;
        case 'minted':
            console.log('📋 Revealed NFTs:');
            const tracker = loadMintedNFTs();
            console.log(JSON.stringify(tracker.minted, null, 2));
            break;
        default:
            console.log('🎯 SOLalchemists Real Reveal System');
            console.log('==================================\n');
            console.log('Usage:');
            console.log('  node real-reveal-system.js reveal <user-wallet> [nft-number] - Reveal NFT to user');
            console.log('  node real-reveal-system.js stats                           - Show reveal statistics');
            console.log('  node real-reveal-system.js minted                          - Show all revealed NFTs');
            console.log('\n💰 Cost per reveal: ~0.005 SOL (you pay, user gets NFT)');
            console.log('🎯 This mints NFTs directly to user wallets!');
    }
}

