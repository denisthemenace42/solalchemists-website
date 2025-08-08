# 🧪 NFT Project Testing Checklist

## Pre-Launch Testing Strategy

### Phase 1: Devnet Testing ✅
**Current Status: Ready to test**

```bash
# Run comprehensive devnet tests
npm run test:devnet
```

**What to verify:**
- [ ] Network connection works
- [ ] Wallet creation and airdrop
- [ ] Metadata files are valid
- [ ] Single NFT minting works
- [ ] Batch minting works (3 NFTs)
- [ ] All NFTs appear on Solscan devnet
- [ ] Metadata and images load correctly

### Phase 2: Testnet Testing 🔄
**Next Step: Intermediate testing**

```bash
# Run testnet tests
npm run test:testnet
```

**What to verify:**
- [ ] All devnet tests pass on testnet
- [ ] Batch minting works (5 NFTs)
- [ ] Network stability with more transactions
- [ ] Error handling works correctly
- [ ] Logging and monitoring functions

### Phase 3: Mainnet Preparation 🚀
**Final Step: Production readiness**

**Configuration Changes:**
- [ ] Switch to mainnet endpoint
- [ ] Use real wallet (not generated)
- [ ] Ensure sufficient SOL balance
- [ ] Set proper delays between mints
- [ ] Disable airdrop functionality

**Final Verification:**
- [ ] All metadata files are uploaded to IPFS
- [ ] Images are accessible and load correctly
- [ ] Collection metadata is finalized
- [ ] Royalty settings are correct (5%)
- [ ] Creator wallet is verified

## Testing Commands

### Basic Testing
```bash
# Test on devnet
npm run test:devnet

# Test on testnet  
npm run test:testnet

# Test single NFT mint
npm run mint

# Test batch minting
npm run batch-mint
```

### Advanced Testing
```bash
# Test collection creation
npm run create-collection

# Test batch minting with collection
npm run batch-with-collection

# Test with existing wallet
npm run batch-mint-existing
```

## What Each Test Validates

### 1. Network Connection Test
- ✅ Solana network connectivity
- ✅ RPC endpoint responsiveness
- ✅ Network version compatibility

### 2. Wallet Setup Test
- ✅ Keypair generation
- ✅ Public key derivation
- ✅ Balance checking
- ✅ Airdrop functionality (devnet/testnet)

### 3. Metadata Files Test
- ✅ File existence and accessibility
- ✅ JSON format validation
- ✅ Required fields (name, image)
- ✅ IPFS URI validation

### 4. Single NFT Mint Test
- ✅ Metaplex SDK integration
- ✅ NFT creation transaction
- ✅ Metadata association
- ✅ Creator verification
- ✅ Solscan verification

### 5. Batch Mint Test
- ✅ Multiple NFT creation
- ✅ Transaction sequencing
- ✅ Error handling
- ✅ Progress tracking
- ✅ Gas fee management

## Common Issues & Solutions

### ❌ "Metadata file not found"
**Solution:** Check file paths in config.js and ensure metadata directory exists

### ❌ "Insufficient SOL balance"
**Solution:** Request airdrop on devnet/testnet or add SOL to mainnet wallet

### ❌ "Transaction failed"
**Solution:** Check network congestion, increase delays, verify wallet balance

### ❌ "IPFS image not loading"
**Solution:** Verify IPFS gateway, check image file accessibility

## Mainnet Launch Checklist

### Before Launch
- [ ] All devnet tests pass
- [ ] All testnet tests pass  
- [ ] Real wallet configured with sufficient SOL
- [ ] Metadata and images uploaded to IPFS
- [ ] Collection metadata finalized
- [ ] Backup wallet prepared
- [ ] Monitoring tools ready

### During Launch
- [ ] Start with small batch (10-20 NFTs)
- [ ] Monitor transaction success rates
- [ ] Check Solscan for NFT verification
- [ ] Verify metadata and images load
- [ ] Monitor wallet balance

### After Launch
- [ ] Verify all NFTs minted successfully
- [ ] Check collection on marketplaces
- [ ] Test secondary sales (if applicable)
- [ ] Monitor community feedback
- [ ] Document any issues for future reference

## Emergency Procedures

### If Batch Minting Fails
1. Check error logs in `error-log.json`
2. Verify wallet balance
3. Check network status
4. Resume from last successful mint using `startFromIndex`

### If Metadata Issues Occur
1. Verify IPFS gateway accessibility
2. Check metadata JSON format
3. Re-upload problematic files
4. Update metadata URIs if needed

### If Network Issues
1. Switch to different RPC endpoint
2. Increase transaction delays
3. Check Solana network status
4. Consider using multiple RPC providers

## Success Criteria

### ✅ Ready for Mainnet When:
- [ ] All automated tests pass on devnet
- [ ] All automated tests pass on testnet
- [ ] Manual verification of minted NFTs
- [ ] Metadata and images load correctly
- [ ] Collection structure is verified
- [ ] Error handling is robust
- [ ] Monitoring is in place

### 🎯 Launch Success Metrics:
- 100% transaction success rate
- All 1,111 NFTs minted successfully
- Metadata and images accessible
- Collection verified on marketplaces
- No critical errors during process

---

**Remember:** Always test thoroughly on devnet and testnet before mainnet deployment. The cost of testing is minimal compared to the cost of failed mainnet transactions.
