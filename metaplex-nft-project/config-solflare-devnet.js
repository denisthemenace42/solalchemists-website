module.exports = {
  // Network configuration for devnet (Solflare testing)
  network: {
    endpoint: 'https://api.devnet.solana.com', // Devnet endpoint
    commitment: 'confirmed'
  },
  
  // NFT configuration (same as production)
  nft: {
    symbol: 'SOLALCH',
    sellerFeeBasisPoints: 500, // 5% royalty
    isMutable: true,
    maxSupply: 1
  },
  
  // Batch minting configuration for devnet testing
  batch: {
    delayBetweenMints: 2000, // 2 seconds delay between mints
    airdropAmount: 2, // SOL amount to airdrop for testing
    startFromIndex: 1, // Start from first NFT
    maxNFTs: 5, // Test with 5 NFTs first
    skipAirdrop: false // Enable airdrop for devnet
  },
  
  // File paths
  paths: {
    metadataDir: '../build/json',
    mintLogFile: 'mint-log-devnet.json',
    errorLogFile: 'error-log-devnet.json'
  }
};

/*
🦊 SOLFLARE DEVNET TESTING SETUP:

1. CONFIGURE SOLFLARE WALLET:
   - Open Solflare extension
   - Switch network to "Devnet"
   - Get devnet SOL (free airdrop)

2. EXPORT PRIVATE KEY:
   - Go to Solflare Settings
   - Export Private Key
   - Copy the private key

3. UPDATE WALLET CONFIG:
   - Open wallet-config.js
   - Replace PRIVATE_KEY_STRING with your Solflare devnet private key

4. TEST SEQUENCE:
   npm run test:wallet    # Test wallet setup
   npm run mint          # Test single NFT
   npm run batch-mint    # Test batch minting

5. VERIFY RESULTS:
   - Check https://solscan.io/?cluster=devnet
   - Search your wallet address
   - Verify NFTs and metadata

6. AFTER SUCCESSFUL TESTING:
   - Switch Solflare back to mainnet
   - Update config for mainnet
   - Launch on mainnet with confidence

🎯 This gives you the most realistic testing experience!
*/
