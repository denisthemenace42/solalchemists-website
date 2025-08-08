# 🚀 Quick Test Guide

## Immediate Testing Steps

### 1. Run Devnet Tests (Start Here)
```bash
cd /Users/belqta/hashlips_art_engine/metaplex-nft-project
npm run test:devnet
```

This will automatically:
- ✅ Test network connection
- ✅ Create test wallet and get SOL airdrop
- ✅ Validate your metadata files
- ✅ Mint a single test NFT
- ✅ Test batch minting (3 NFTs)
- ✅ Generate detailed test report

### 2. Check Test Results
After running tests, check:
- Console output for any ❌ errors
- Generated test report file: `test-results-devnet-[timestamp].json`
- Verify NFTs on Solscan devnet

### 3. If Tests Pass - Move to Testnet
```bash
npm run test:testnet
```

### 4. Manual Verification
Visit these URLs to verify your test NFTs:
- **Devnet Solscan:** https://solscan.io/?cluster=devnet
- **Testnet Solscan:** https://solscan.io/?cluster=testnet

## Common Quick Fixes

### If "Metadata file not found":
```bash
# Check if metadata directory exists
ls -la ../build/json/

# If missing, ensure your HashLips build completed successfully
```

### If "Insufficient SOL":
```bash
# The test suite should handle airdrops automatically
# If not, check network connectivity
```

### If "Transaction failed":
```bash
# Increase delays in config.js
# Check Solana network status
```

## Ready for Mainnet?

After all tests pass:
1. ✅ Update `config.js` to use mainnet endpoint
2. ✅ Replace generated keypair with your real wallet
3. ✅ Ensure sufficient SOL balance
4. ✅ Run final verification

---

**Start testing now:** `npm run test:devnet`
