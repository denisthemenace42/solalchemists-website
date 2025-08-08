const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const fs = require('fs');

// Load wallet configuration
const { walletKeypair } = require('./wallet-config');

async function createSimpleMysteryNFT() {
    try {
        console.log('🔧 Creating simple mystery NFT...');
        
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
        
        console.log('🔄 Minting mystery NFT...');
        
        // Create the mystery NFT with your real mystery image
        const { nft } = await metaplex.nfts().create({
            name: "Mystery Alchemist #TEST",
            symbol: 'MYST',
            sellerFeeBasisPoints: 500,
            uri: "ipfs://bafybeidojayq2h3ja5qqragcu3nxik5qpk65yn6ratpu5mupgtwhi6etcu/mystery-metadata.json",
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
            name: "Mystery Alchemist #TEST",
            symbol: 'MYST',
            solscanUrl: `https://solscan.io/token/${nft.address.toString()}?cluster=devnet`
        };
        
        fs.writeFileSync('simple-mystery-nft-log.json', JSON.stringify(logData, null, 2));
        console.log('📝 Log saved to simple-mystery-nft-log.json');
        
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
createSimpleMysteryNFT();
