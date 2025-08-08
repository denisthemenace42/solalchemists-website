module.exports = {
  // Network configuration for testnet
  network: {
    endpoint: 'https://api.testnet.solana.com', // Testnet endpoint
    commitment: 'confirmed'
  },
  
  // NFT configuration (same as production)
  nft: {
    symbol: 'SOLALCH',
    sellerFeeBasisPoints: 500, // 5% royalty
    isMutable: true,
    maxSupply: 1
  },
  
  // Batch minting configuration for testnet
  batch: {
    delayBetweenMints: 2000, // 2 seconds delay between mints
    airdropAmount: 2, // SOL amount to airdrop for testing
    startFromIndex: 1, // Start from first NFT
    maxNFTs: 10, // Test with more NFTs than devnet
    skipAirdrop: false // Enable airdrop for testnet
  },
  
  // File paths
  paths: {
    metadataDir: '../build/json',
    mintLogFile: 'mint-log-testnet.json',
    errorLogFile: 'error-log-testnet.json'
  }
};
