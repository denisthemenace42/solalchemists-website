module.exports = {
  // Network configuration for mainnet
  network: {
    endpoint: 'https://api.mainnet-beta.solana.com', // Mainnet endpoint
    commitment: 'confirmed'
  },
  
  // NFT configuration (production settings)
  nft: {
    symbol: 'SOLALCH',
    sellerFeeBasisPoints: 500, // 5% royalty
    isMutable: true,
    maxSupply: 1
  },
  
  // Batch minting configuration for mainnet
  batch: {
    delayBetweenMints: 3000, // 3 seconds delay between mints (more conservative)
    airdropAmount: 0, // No airdrop on mainnet
    startFromIndex: 1, // Start from first NFT
    maxNFTs: 1111, // Full collection
    skipAirdrop: true // Always skip airdrop on mainnet
  },
  
  // File paths
  paths: {
    metadataDir: '../build/json',
    mintLogFile: 'mint-log-mainnet.json',
    errorLogFile: 'error-log-mainnet.json'
  }
};
