const { Connection, PublicKey } = require('@solana/web3.js');
const { Metaplex } = require('@metaplex-foundation/js');
const fs = require('fs');

// Load wallet configuration
const { walletKeypair } = require('./wallet-config');

async function checkHoldings() {
    try {
        console.log('🔍 Checking your SOLalchemists holdings...');
        
        // Connect to devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const metaplex = Metaplex.make(connection);
        
        const walletAddress = walletKeypair.publicKey.toString();
        console.log('👤 Wallet:', walletAddress);
        
        // Get all NFTs owned by the wallet
        const nfts = await metaplex.nfts().findAllByOwner({
            owner: walletKeypair.publicKey
        });
        
        console.log(`📊 Found ${nfts.length} total NFTs in wallet`);
        
        // Filter for SOLalchemists NFTs
        const solalchemistsNFTs = nfts.filter(nft => 
            nft.name && nft.name.includes('SOLalchemists') ||
            nft.symbol === 'SOLALCH' ||
            nft.symbol === 'MYST'
        );
        
        console.log(`🎭 Found ${solalchemistsNFTs.length} SOLalchemists NFTs:`);
        console.log('');
        
        if (solalchemistsNFTs.length === 0) {
            console.log('❌ No SOLalchemists NFTs found in your wallet');
            return;
        }
        
        // Display each NFT
        solalchemistsNFTs.forEach((nft, index) => {
            console.log(`${index + 1}. ${nft.name}`);
            console.log(`   Symbol: ${nft.symbol}`);
            console.log(`   Address: ${nft.address.toString()}`);
            console.log(`   URI: ${nft.uri}`);
            console.log(`   Solscan: https://solscan.io/token/${nft.address.toString()}?cluster=devnet`);
            
            // Check if image is accessible
            if (nft.uri) {
                const imageUrl = nft.uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                console.log(`   Image: ${imageUrl}`);
            }
            console.log('');
        });
        
        // Save holdings to file
        const holdingsData = {
            timestamp: new Date().toISOString(),
            wallet: walletAddress,
            totalNFTs: nfts.length,
            solalchemistsNFTs: solalchemistsNFTs.length,
            nfts: solalchemistsNFTs.map(nft => ({
                name: nft.name,
                symbol: nft.symbol,
                address: nft.address.toString(),
                uri: nft.uri,
                solscanUrl: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`
            }))
        };
        
        fs.writeFileSync('holdings.json', JSON.stringify(holdingsData, null, 2));
        console.log('💾 Holdings saved to holdings.json');
        
        return holdingsData;
        
    } catch (error) {
        console.error('❌ Error checking holdings:', error);
    }
}

// Function to get holdings data for website
async function getHoldingsData(walletAddress) {
    try {
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const metaplex = Metaplex.make(connection);
        
        const publicKey = new PublicKey(walletAddress);
        
        // Get all NFTs owned by the wallet
        const nfts = await metaplex.nfts().findAllByOwner({
            owner: publicKey
        });
        
        // Filter for SOLalchemists NFTs
        const solalchemistsNFTs = nfts.filter(nft => 
            nft.name && nft.name.includes('SOLalchemists') ||
            nft.symbol === 'SOLALCH' ||
            nft.symbol === 'MYST'
        );
        
        return {
            totalNFTs: nfts.length,
            solalchemistsNFTs: solalchemistsNFTs.length,
            nfts: solalchemistsNFTs.map(nft => ({
                name: nft.name,
                symbol: nft.symbol,
                address: nft.address.toString(),
                uri: nft.uri,
                imageUrl: nft.uri ? nft.uri.replace('ipfs://', 'https://ipfs.io/ipfs/') : null,
                solscanUrl: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`
            }))
        };
        
    } catch (error) {
        console.error('Error getting holdings data:', error);
        return { error: error.message };
    }
}

// Export functions
module.exports = {
    checkHoldings,
    getHoldingsData
};

// Run if this script is executed directly
if (require.main === module) {
    checkHoldings();
}
