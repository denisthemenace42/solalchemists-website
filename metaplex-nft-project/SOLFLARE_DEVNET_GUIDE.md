# 🦊 Solflare Devnet Testing Guide

## ✅ Yes, You Can Use Solflare with Devnet!

This is actually a **great approach** for testing before mainnet. Here's how to set it up:

## 🔧 Step 1: Configure Solflare for Devnet

### 1. Open Solflare Wallet
- Open your Solflare browser extension
- Click on the network selector (usually shows "Mainnet")

### 2. Switch to Devnet
- Click on the network dropdown
- Select **"Devnet"** from the list
- Your wallet will now be connected to Solana devnet

### 3. Get Devnet SOL
- In Solflare devnet, you should see 0 SOL initially
- Click on "Receive" or "Deposit"
- Look for "Airdrop" or "Get SOL" option
- Request devnet SOL (usually 2 SOL for free)

## 🔑 Step 2: Export Your Solflare Private Key

### 1. Access Private Key
- In Solflare, go to **Settings**
- Look for **"Export Private Key"** or **"Backup Wallet"**
- Enter your password

### 2. Copy the Private Key
- Copy the private key (it will be a long string)
- **Keep it secure** - this is your devnet wallet key

## 📝 Step 3: Update Your Configuration

### 1. Update wallet-config.js
Replace the private key in `wallet-config.js`:

```javascript
const { Keypair } = require('@solana/web3.js');

// Replace with your Solflare devnet private key
const PRIVATE_KEY_STRING = "YOUR_SOLFLARE_DEVNET_PRIVATE_KEY";

// Convert private key string to Uint8Array
const privateKeyArray = Uint8Array.from(PRIVATE_KEY_STRING.split(',').map(num => parseInt(num)));
const walletKeypair = Keypair.fromSecretKey(privateKeyArray);

module.exports = { walletKeypair };
```

### 2. Update config.js for Devnet
Make sure your `config.js` uses devnet:

```javascript
module.exports = {
  network: {
    endpoint: 'https://api.devnet.solana.com', // Devnet endpoint
    commitment: 'confirmed'
  },
  // ... rest of your config
};
```

## 🧪 Step 4: Test Your Setup

### 1. Test Wallet Connection
```bash
npm run test:wallet
```

### 2. Test Single NFT Mint
```bash
npm run mint
```

### 3. Test Batch Minting
```bash
npm run batch-mint
```

## 🌐 Step 5: Verify on Devnet Explorer

### 1. View Your NFTs
- Go to: https://solscan.io/?cluster=devnet
- Search for your wallet address
- You should see your minted NFTs

### 2. Check Transaction History
- All transactions will be visible on devnet Solscan
- You can verify metadata and images

## 🎯 Advantages of Solflare Devnet Testing

### ✅ Benefits:
- **Real wallet experience** - Same as mainnet
- **Free testing** - No real SOL needed
- **Full functionality** - All features work
- **Easy verification** - View on devnet explorer
- **Safe environment** - No risk of losing real funds

### ✅ What You Can Test:
- Wallet connection and balance
- Single NFT minting
- Batch minting
- Metadata validation
- Transaction confirmation
- Error handling

## 🚀 Testing Workflow

### Phase 1: Devnet Testing with Solflare
```bash
# 1. Set up Solflare devnet wallet
# 2. Get devnet SOL
# 3. Export private key
# 4. Update wallet-config.js
# 5. Test everything on devnet

npm run test:wallet
npm run mint
npm run batch-mint
```

### Phase 2: Mainnet Launch
```bash
# 1. Switch Solflare back to mainnet
# 2. Update config.js for mainnet
# 3. Use mainnet wallet with real SOL
# 4. Launch on mainnet
```

## 🔧 Troubleshooting

### If Devnet SOL Airdrop Fails:
- Try different devnet RPC endpoints
- Wait a few minutes and try again
- Use alternative faucets

### If Private Key Import Fails:
- Make sure you copied the full private key
- Check the format (should be comma-separated numbers)
- Verify you're using devnet private key

### If Transactions Fail:
- Check devnet SOL balance
- Verify network connection
- Check transaction logs

## 📊 Expected Results

### Successful Devnet Test:
- ✅ Wallet loads correctly
- ✅ Devnet SOL balance > 0
- ✅ Single NFT mints successfully
- ✅ Batch minting works
- ✅ NFTs visible on devnet Solscan
- ✅ Metadata and images load correctly

## 🎯 Next Steps After Devnet Testing

1. **Verify all tests pass on devnet**
2. **Switch Solflare back to mainnet**
3. **Update configuration for mainnet**
4. **Ensure sufficient mainnet SOL**
5. **Launch on mainnet with confidence**

---

**This approach gives you the most realistic testing experience before mainnet! 🚀**
