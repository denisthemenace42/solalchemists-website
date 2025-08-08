# 🦊 Solflare Devnet Quick Start

## ✅ Yes! You Can Use Solflare with Devnet

This is the **perfect approach** for testing your NFT project before mainnet.

## 🚀 Quick Setup (5 Steps)

### 1. Switch Solflare to Devnet
- Open Solflare extension
- Click network selector (shows "Mainnet")
- Select **"Devnet"**

### 2. Get Devnet SOL
- In Solflare devnet, click "Receive"
- Look for "Airdrop" or "Get SOL"
- Request devnet SOL (free!)

### 3. Export Private Key
- Solflare → Settings → Export Private Key
- Enter password → Copy private key

### 4. Update Configuration
```bash
# Open wallet-config.js and replace:
const PRIVATE_KEY_STRING = "YOUR_SOLFLARE_DEVNET_PRIVATE_KEY";
```

### 5. Test Everything
```bash
npm run test:wallet    # Test wallet
npm run mint          # Test single NFT
npm run batch-mint    # Test batch minting
```

## 🎯 What You Get

### ✅ Free Testing Environment
- No real SOL needed
- All features work exactly like mainnet
- Safe to experiment

### ✅ Real Wallet Experience
- Same wallet interface as mainnet
- Real transaction signing
- Full functionality testing

### ✅ Easy Verification
- View NFTs on devnet Solscan
- Check transaction history
- Verify metadata and images

## 📊 Testing Results

After successful testing, you'll have:
- ✅ Wallet working correctly
- ✅ NFTs minted successfully
- ✅ Metadata loading properly
- ✅ Confidence for mainnet launch

## 🚀 Next Steps

1. **Complete devnet testing**
2. **Switch Solflare back to mainnet**
3. **Update config for mainnet**
4. **Launch on mainnet with confidence**

## 💡 Why This Approach is Best

- **Most realistic testing** - Uses real wallet
- **Completely free** - No real SOL needed
- **Full functionality** - Everything works like mainnet
- **Safe environment** - No risk of losing funds
- **Easy verification** - View results on explorer

---

**Start now:** `npm run setup:devnet`
