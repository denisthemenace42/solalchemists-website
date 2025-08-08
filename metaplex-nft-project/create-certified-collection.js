const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const fs = require('fs');

// Load wallet configuration
const { walletKeypair } = require('./wallet-config');

async function createCertifiedCollection() {
    try {
        console.log('🏆 Creating Metaplex Certified Collection...');
        
        // Connect to devnet
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const metaplex = Metaplex.make(connection).use(keypairIdentity(walletKeypair));
        
        // Check wallet balance
        const balance = await connection.getBalance(walletKeypair.publicKey);
        console.log('💰 Wallet balance:', balance / 1e9, 'SOL');
        
        if (balance < 0.01 * 1e9) {
            throw new Error('Insufficient SOL. Need at least 0.01 SOL');
        }
        
        // Collection metadata
        const collectionMetadata = {
            name: "SOLalchemists Mystery Collection",
            symbol: "MYSTALCH",
            description: "Mysterious alchemists waiting to be revealed! Each mystery NFT can be revealed to show a unique SOLalchemist from the 1120 collection.",
            image: "ipfs://bafybeidojayq2h3ja5qqragcu3nxik5qpk65yn6ratpu5mupgtwhi6etcu/Mystery.png",
            external_url: "https://your-website.com",
            seller_fee_basis_points: 500, // 5%
            creators: [
                {
                    address: walletKeypair.publicKey,
                    share: 100,
                    verified: true,
                },
            ],
            attributes: [
                {
                    trait_type: "Collection Type",
                    value: "Mystery"
                },
                {
                    trait_type: "Total Supply",
                    value: "1000"
                },
                {
                    trait_type: "Reveal Status",
                    value: "Available"
                }
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: "ipfs://bafybeidojayq2h3ja5qqragcu3nxik5qpk65yn6ratpu5mupgtwhi6etcu/Mystery.png"
                    }
                ],
                category: "image"
            }
        };
        
        console.log('📝 Collection metadata prepared');
        console.log('🔄 Creating collection...');
        
        // Create the collection
        const { nft: collection } = await metaplex.nfts().create({
            name: collectionMetadata.name,
            symbol: collectionMetadata.symbol,
            sellerFeeBasisPoints: collectionMetadata.seller_fee_basis_points,
            uri: "ipfs://bafybeidojayq2h3ja5qqragcu3nxik5qpk65yn6ratpu5mupgtwhi6etcu/collection-metadata.json",
            isCollection: true, // This makes it a certified collection
            creators: collectionMetadata.creators,
        });
        
        console.log('✅ Collection created successfully!');
        console.log('🏆 Collection Address:', collection.address.toString());
        console.log('🔗 Solscan:', `https://solscan.io/token/${collection.address.toString()}?cluster=devnet`);
        
        // Save collection info
        const collectionInfo = {
            address: collection.address.toString(),
            name: collectionMetadata.name,
            symbol: collectionMetadata.symbol,
            description: collectionMetadata.description,
            solscanUrl: `https://solscan.io/token/${collection.address.toString()}?cluster=devnet`,
            timestamp: new Date().toISOString(),
            network: 'devnet'
        };
        
        fs.writeFileSync('certified-collection.json', JSON.stringify(collectionInfo, null, 2));
        console.log('💾 Collection info saved to certified-collection.json');
        
        // Create a sample mystery NFT in the collection
        console.log('🎭 Creating sample mystery NFT in collection...');
        
        const { nft: mysteryNFT } = await metaplex.nfts().create({
            name: "Mystery Alchemist #1",
            symbol: "MYSTALCH",
            sellerFeeBasisPoints: 500,
            uri: "ipfs://bafybeidojayq2h3ja5qqragcu3nxik5qpk65yn6ratpu5mupgtwhi6etcu/mystery-metadata.json",
            isMutable: true,
            maxSupply: 1,
            collection: collection.address, // Link to the collection
            creators: [
                {
                    address: walletKeypair.publicKey,
                    share: 100,
                    verified: true,
                },
            ],
        });
        
        console.log('✅ Sample mystery NFT created!');
        console.log('🎭 NFT Address:', mysteryNFT.address.toString());
        console.log('🔗 NFT Solscan:', `https://solscan.io/token/${mysteryNFT.address.toString()}?cluster=devnet`);
        
        // Update collection info with sample NFT
        collectionInfo.sampleNFT = {
            address: mysteryNFT.address.toString(),
            name: "Mystery Alchemist #1",
            solscanUrl: `https://solscan.io/token/${mysteryNFT.address.toString()}?cluster=devnet`
        };
        
        fs.writeFileSync('certified-collection.json', JSON.stringify(collectionInfo, null, 2));
        
        console.log('\n🎉 METAPLEX CERTIFIED COLLECTION CREATED!');
        console.log('==========================================');
        console.log('🏆 Collection Address:', collection.address.toString());
        console.log('📝 Name:', collectionMetadata.name);
        console.log('🎭 Symbol:', collectionMetadata.symbol);
        console.log('💰 Royalties: 5%');
        console.log('🔗 Solscan:', `https://solscan.io/token/${collection.address.toString()}?cluster=devnet`);
        console.log('\n📋 For Magic Eden:');
        console.log('- Use this collection address for listing');
        console.log('- All mystery NFTs will be part of this collection');
        console.log('- Collection is certified and ready for Magic Eden');
        
        return collectionInfo;
        
    } catch (error) {
        console.error('❌ Failed to create collection:', error.message);
        throw error;
    }
}

// Function to get collection info
function getCollectionInfo() {
    try {
        if (fs.existsSync('certified-collection.json')) {
            const data = JSON.parse(fs.readFileSync('certified-collection.json', 'utf8'));
            console.log('🏆 Current Certified Collection:');
            console.log(JSON.stringify(data, null, 2));
            return data;
        } else {
            console.log('❌ No certified collection found. Run createCertifiedCollection() first.');
            return null;
        }
    } catch (error) {
        console.error('Error reading collection info:', error);
        return null;
    }
}

// Export functions
module.exports = {
    createCertifiedCollection,
    getCollectionInfo
};

// Run if this script is executed directly
if (require.main === module) {
    const command = process.argv[2];
    
    switch (command) {
        case 'create':
            createCertifiedCollection().then(console.log).catch(console.error);
            break;
        case 'info':
            getCollectionInfo();
            break;
        default:
            console.log('🏆 Metaplex Certified Collection Creator');
            console.log('=====================================\n');
            console.log('Usage:');
            console.log('  node create-certified-collection.js create - Create certified collection');
            console.log('  node create-certified-collection.js info   - Show collection info');
            console.log('\n📋 This creates the collection address needed for Magic Eden listing!');
    }
}
