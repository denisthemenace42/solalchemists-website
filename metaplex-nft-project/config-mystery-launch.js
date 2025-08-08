module.exports = {
  // Network configuration for mainnet
  network: {
    endpoint: 'https://api.mainnet-beta.solana.com', // Mainnet endpoint
    commitment: 'confirmed'
  },
  
  // NFT configuration for mystery launch
  nft: {
    symbol: 'MYSTERY_ALCH', // Mystery symbol
    sellerFeeBasisPoints: 500, // 5% royalty
    isMutable: true, // Important: Keep mutable for reveal
    maxSupply: 1
  },
  
  // Batch minting configuration for mystery launch
  batch: {
    delayBetweenMints: 3000, // 3 seconds delay between mints
    airdropAmount: 0, // No airdrop on mainnet
    startFromIndex: 1, // Start from first NFT
    maxNFTs: 100, // Start with 100 mystery NFTs
    skipAirdrop: true // Always skip airdrop on mainnet
  },
  
  // File paths
  paths: {
    metadataDir: '../build/json',
    mintLogFile: 'mint-log-mystery.json',
    errorLogFile: 'error-log-mystery.json'
  }
};

/*
🔮 MYSTERY LAUNCH STRATEGY:

Phase 1: Mystery Launch (100 NFTs)
- All NFTs show same mystery image
- Build community and hype
- Create FOMO and scarcity

Phase 2: Community Building (2-4 weeks)
- Engage with holders
- Marketing campaigns
- Prepare for reveal

Phase 3: Full Reveal
- Update metadata to show real alchemists
- Launch on Magic Eden
- Enable secondary trading

💡 Benefits:
- Lower initial costs
- Build community first
- Test market demand
- Create anticipation
- Maximize engagement

🎯 Cost Estimate for 100 NFTs:
- Minting: ~0.0005 SOL
- Gas: ~0.025 SOL
- Total: ~0.0255 SOL

🚀 Ready for mystery launch!
*/
