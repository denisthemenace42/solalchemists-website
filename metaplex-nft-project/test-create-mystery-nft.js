const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const fs = require('fs');
const path = require('path');

// Load wallet configuration
const { walletKeypair } = require('./wallet-config');

async function createTestMysteryNFT() {
    try {
        console.log('🔧 Creating test mystery NFT...');
        
        // Connect to devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const metaplex = Metaplex.make(connection).use(keypairIdentity(walletKeypair));
        
        // Check wallet balance
        const balance = await connection.getBalance(walletKeypair.publicKey);
        console.log('💰 Wallet balance:', balance / 1e9, 'SOL');
        
        if (balance < 0.01 * 1e9) {
            console.error('❌ Insufficient SOL for minting. Need at least 0.01 SOL');
            return;
        }
        
        // Create mystery metadata (simplified to avoid buffer size issues)
        const mysteryMetadata = {
            name: "Mystery Alchemist #TEST",
            description: "A mysterious alchemist awaits discovery...",
            image: "https://via.placeholder.com/200x200/333333/FFFFFF?text=Mystery+Alchemist",
            attributes: [
                { trait_type: "Status", value: "Mystery" },
                { trait_type: "Reveal Date", value: "TBA" }
            ]
        };
        
        // Use a simple placeholder URI instead of base64 encoding
        const metadataUri = "https://gist.githubusercontent.com/test/raw/mystery-test.json";
        
        console.log('🔄 Minting mystery NFT...');
        
        // Create the mystery NFT
        const { nft } = await metaplex.nfts().create({
            name: mysteryMetadata.name,
            symbol: 'MYST', // Use MYST symbol for testing
            sellerFeeBasisPoints: 500,
            uri: metadataUri,
            isMutable: true,
            maxSupply: 1,
            creators: [
                {
                    address: walletKeypair.publicKey,
                    share: 100,
                    verified: true,
                },
            ],
        });
        
        console.log('✅ Mystery NFT created successfully!');
        console.log('📍 NFT Address:', nft.address.toString());
        console.log('🔗 View on Solscan:', `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`);
        
        // Save to log file
        const logData = {
            timestamp: new Date().toISOString(),
            nftAddress: nft.address.toString(),
            name: mysteryMetadata.name,
            symbol: 'MYST',
            solscanUrl: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`
        };
        
        fs.writeFileSync('mystery-nft-test-log.json', JSON.stringify(logData, null, 2));
        console.log('📝 Log saved to mystery-nft-test-log.json');
        
        console.log('\n🎯 Next Steps:');
        console.log('1. Visit: http://localhost:58151');
        console.log('2. Connect your wallet');
        console.log('3. You should see the mystery NFT');
        console.log('4. Click "Reveal NFT" to test the reveal functionality');
        
    } catch (error) {
        console.error('❌ Failed to create mystery NFT:', error);
    }
}

// Run the function
createTestMysteryNFT();
