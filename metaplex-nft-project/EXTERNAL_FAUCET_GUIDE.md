# 💰 Get Devnet SOL Using External Faucets

## 🚀 Quick Solution: Use External Faucets

Since the built-in airdrop is hitting rate limits, use these external faucets:

## 🌐 Option 1: Official Solana Faucet (Recommended)

### Step 1: Get Your Wallet Address
```bash
npm run test:wallet
```
This will show your wallet address.

### Step 2: Use Official Faucet
1. **Go to:** https://faucet.solana.com/
2. **Select "Devnet"** from the dropdown
3. **Paste your wallet address**
4. **Click "Request SOL"**
5. **Wait for confirmation**

## 🌐 Option 2: SolFaucet

1. **Go to:** https://solfaucet.com/
2. **Select "Devnet"**
3. **Paste your wallet address**
4. **Click "Request SOL"**

## 🌐 Option 3: GenesysGo Faucet

1. **Go to:** https://faucet.genesysgo.net/
2. **Paste your wallet address**
3. **Click "Request SOL"**

## 🔧 Alternative: Create a New Funded Wallet

If you want to create a completely new wallet with SOL:

### Step 1: Create New Wallet
```bash
npm run fund:wallet
```

### Step 2: Use External Faucet
1. Copy the public address from the output
2. Go to https://faucet.solana.com/
3. Select "Devnet"
4. Paste the address
5. Request SOL

### Step 3: Use the New Wallet
1. Copy the private key from the output
2. Update `wallet-config.js` with the private key
3. Test: `npm run test:wallet`

## 📋 Step-by-Step Process

### Method A: Fund Your Existing Wallet
1. **Get your address:**
   ```bash
   npm run test:wallet
   ```

2. **Use external faucet:**
   - Go to https://faucet.solana.com/
   - Select "Devnet"
   - Paste your address
   - Request SOL

3. **Verify balance:**
   ```bash
   npm run test:wallet
   ```

### Method B: Create New Funded Wallet
1. **Create new wallet:**
   ```bash
   npm run fund:wallet
   ```

2. **Fund it with external faucet:**
   - Copy the public address
   - Use https://faucet.solana.com/
   - Request SOL

3. **Use the new wallet:**
   - Copy the private key
   - Update `wallet-config.js`
   - Test: `npm run test:wallet`

## 🎯 Expected Results

After successful funding:
- ✅ Wallet balance > 0 SOL
- ✅ Can mint NFTs
- ✅ All transactions work

## 💡 Pro Tips

1. **Try multiple faucets** - If one fails, try another
2. **Wait for confirmations** - Transactions take a few seconds
3. **Check devnet Solscan** - Verify transactions went through
4. **Keep your private keys secure** - Never share them

## 🚀 Quick Commands

```bash
# Get your wallet address
npm run test:wallet

# Create new wallet (if needed)
npm run fund:wallet

# Test after funding
npm run test:wallet

# Test minting
npm run mint
```

## 🔧 Troubleshooting

### If Faucet Fails:
- Try a different faucet
- Wait a few minutes and try again
- Check if the address is correct

### If Balance Doesn't Update:
- Wait a few minutes for confirmation
- Check devnet Solscan for transaction status
- Refresh your wallet

---

**Start here:** `npm run test:wallet` to get your address, then use https://faucet.solana.com/
