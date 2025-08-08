const fs = require('fs');
const path = require('path');

// Configuration for your 1120 collection
const COLLECTION_CONFIG = {
    totalNFTs: 1120,
    baseMetadataUri: "ipfs://bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a",
    baseImageUri: "ipfs://bafybeibwozxicevxmwjdqe3yhivglneierhkp5k7xlp2ak3wvr5c2an3my",
    symbol: "SOLALCH",
    name: "SOLalchemists"
};

// Function to get random NFT from collection
function getRandomNFT() {
    const randomNumber = Math.floor(Math.random() * COLLECTION_CONFIG.totalNFTs) + 1;
    return {
        number: randomNumber,
        metadataUri: `${COLLECTION_CONFIG.baseMetadataUri}/${randomNumber}.json`,
        imageUri: `${COLLECTION_CONFIG.baseImageUri}/${randomNumber}.png`,
        name: `${COLLECTION_CONFIG.name} #${randomNumber}`
    };
}

// Function to get specific NFT by number
function getNFTByNumber(number) {
    if (number < 1 || number > COLLECTION_CONFIG.totalNFTs) {
        throw new Error(`NFT number must be between 1 and ${COLLECTION_CONFIG.totalNFTs}`);
    }
    
    return {
        number: number,
        metadataUri: `${COLLECTION_CONFIG.baseMetadataUri}/${number}.json`,
        imageUri: `${COLLECTION_CONFIG.baseImageUri}/${number}.png`,
        name: `${COLLECTION_CONFIG.name} #${number}`
    };
}

// Function to fetch metadata for an NFT
async function fetchNFTMetadata(nftNumber) {
    try {
        const metadataUrl = `https://ipfs.io/ipfs/bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a/${nftNumber}.json`;
        const response = await fetch(metadataUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch metadata for NFT #${nftNumber}`);
        }
        
        const metadata = await response.json();
        return {
            number: nftNumber,
            name: metadata.name,
            description: metadata.description,
            image: metadata.image,
            attributes: metadata.attributes || [],
            metadataUri: `${COLLECTION_CONFIG.baseMetadataUri}/${nftNumber}.json`
        };
    } catch (error) {
        console.error(`Error fetching metadata for NFT #${nftNumber}:`, error.message);
        return null;
    }
}

// Function to generate reveal data for multiple NFTs
function generateRevealData(count = 10) {
    const reveals = [];
    const usedNumbers = new Set();
    
    for (let i = 0; i < count; i++) {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * COLLECTION_CONFIG.totalNFTs) + 1;
        } while (usedNumbers.has(randomNumber));
        
        usedNumbers.add(randomNumber);
        reveals.push(getNFTByNumber(randomNumber));
    }
    
    return reveals;
}

// Function to save reveal data to file
function saveRevealData(reveals, filename = 'reveal-data.json') {
    const data = {
        timestamp: new Date().toISOString(),
        totalReveals: reveals.length,
        reveals: reveals,
        collection: COLLECTION_CONFIG
    };
    
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`✅ Reveal data saved to ${filename}`);
    return data;
}

// Function to load reveal data from file
function loadRevealData(filename = 'reveal-data.json') {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading reveal data: ${error.message}`);
        return null;
    }
}

// Example usage functions
function exampleRandomReveal() {
    console.log('🎲 Generating random reveal...');
    const randomNFT = getRandomNFT();
    console.log('✅ Random NFT selected:', randomNFT);
    return randomNFT;
}

function exampleMultipleReveals() {
    console.log('🎲 Generating multiple random reveals...');
    const reveals = generateRevealData(5);
    console.log('✅ Generated reveals:', reveals);
    
    const savedData = saveRevealData(reveals, 'random-reveals.json');
    return savedData;
}

// Export functions for use in other scripts
module.exports = {
    COLLECTION_CONFIG,
    getRandomNFT,
    getNFTByNumber,
    fetchNFTMetadata,
    generateRevealData,
    saveRevealData,
    loadRevealData,
    exampleRandomReveal,
    exampleMultipleReveals
};

// Run examples if this script is executed directly
if (require.main === module) {
    console.log('🎯 SOLalchemists Random Reveal Generator');
    console.log('=====================================\n');
    
    // Example 1: Single random reveal
    console.log('1️⃣ Single Random Reveal:');
    const singleReveal = exampleRandomReveal();
    console.log(`   NFT: ${singleReveal.name}`);
    console.log(`   Metadata: ${singleReveal.metadataUri}`);
    console.log(`   Image: ${singleReveal.imageUri}\n`);
    
    // Example 2: Multiple reveals
    console.log('2️⃣ Multiple Random Reveals:');
    const multipleReveals = exampleMultipleReveals();
    console.log(`   Generated ${multipleReveals.totalReveals} reveals\n`);
    
    // Example 3: Specific NFT
    console.log('3️⃣ Specific NFT (e.g., #42):');
    const specificNFT = getNFTByNumber(42);
    console.log(`   NFT: ${specificNFT.name}`);
    console.log(`   Metadata: ${specificNFT.metadataUri}`);
    console.log(`   Image: ${specificNFT.imageUri}\n`);
    
    console.log('🎉 Random reveal generator ready!');
    console.log('Use these functions in your reveal scripts.');
}
