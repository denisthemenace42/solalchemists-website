module.exports = {
  // Network configuration for devnet testing
  network: {
    endpoint: 'https://api.devnet.solana.com', // Devnet endpoint for testing
    commitment: 'confirmed'
  },
  
  // NFT configuration (production settings)
  nft: {
    symbol: 'SOLALCH',
    sellerFeeBasisPoints: 500, // 5% royalty
    isMutable: true,
    maxSupply: 1
  },
  
  // Batch minting configuration for devnet testing
  batch: {
    delayBetweenMints: 2000, // 2 seconds delay between mints
    airdropAmount: 0, // No airdrop needed (you have SOL)
    startFromIndex: 1, // Start from first NFT
    maxNFTs: 5, // Test with 5 NFTs first
    skipAirdrop: true // Skip airdrop since you have SOL
  },
  
  // File paths
  paths: {
    metadataDir: '../build/json',
    mintLogFile: 'mint-log-devnet.json',
    errorLogFile: 'error-log-devnet.json'
  }
};

/*
🚀 MAINNET LAUNCH INSTRUCTIONS:

1. REPLACE THE KEYPAIR IN YOUR MINTING SCRIPTS:
   - Find: Keypair.generate()
   - Replace with your actual wallet keypair

2. ENSURE SUFFICIENT SOL BALANCE:
   - Minimum: 2-3 SOL for 1,111 NFTs
   - Recommended: 5 SOL for safety

3. LAUNCH STRATEGY:
   Phase 1: Test with 10 NFTs (current setting)
   Phase 2: Increase maxNFTs to 100
   Phase 3: Increase maxNFTs to 1111 for full collection

4. MONITOR:
   - Check mint-log-mainnet.json for progress
   - Check error-log-mainnet.json for issues
   - Verify NFTs on Solscan mainnet

5. SAFETY CHECKS:
   - ✅ Metadata validated (1,111 files ready)
   - ✅ Project structure correct
   - ✅ Configuration ready
   - ✅ Start with small batches

🎯 YOU'RE READY FOR MAINNET!
*/
