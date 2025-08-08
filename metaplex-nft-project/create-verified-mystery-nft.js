const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const fs = require('fs');

// Load wallet configuration
const { walletKeypair } = require('./wallet-config');

async function createVerifiedMysteryNFT() {
    try {
        console.log('🔧 Creating verified mystery NFT...');
        
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
        
        console.log('🔄 Minting verified mystery NFT...');
        
        // Create the mystery NFT with proper metadata
        const { nft } = await metaplex.nfts().create({
            name: "Mystery Alchemist #VERIFIED",
            symbol: 'MYST',
            sellerFeeBasisPoints: 500,
            uri: "https://arweave.net/your-metadata-uri-here", // This should point to actual metadata
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
        
        console.log('✅ Verified mystery NFT created successfully!');
        console.log('📍 NFT Address:', nft.address.toString());
        console.log('🔗 View on Solscan:', `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`);
        
        // Save to log file
        const logData = {
            timestamp: new Date().toISOString(),
            nftAddress: nft.address.toString(),
            name: "Mystery Alchemist #VERIFIED",
            symbol: 'MYST',
            solscanUrl: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`,
            note: "This NFT has proper metadata URI but needs actual metadata uploaded to Arweave"
        };
        
        fs.writeFileSync('verified-mystery-nft-log.json', JSON.stringify(logData, null, 2));
        console.log('📝 Log saved to verified-mystery-nft-log.json');
        
        console.log('\n🎯 Next Steps:');
        console.log('1. Upload metadata to Arweave or IPFS');
        console.log('2. Update the NFT with the real metadata URI');
        console.log('3. Test the reveal functionality');
        
    } catch (error) {
        console.error('❌ Failed to create verified mystery NFT:', error);
    }
}

// Run the function
createVerifiedMysteryNFT();
