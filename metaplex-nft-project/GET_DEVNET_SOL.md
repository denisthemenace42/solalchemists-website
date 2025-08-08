# 💰 How to Get Devnet SOL in Solflare

## 🔍 Finding the Airdrop Option in Solflare

The airdrop option might be in different locations depending on your Solflare version. Here are all the places to look:

### Method 1: Check the Main Interface
1. **Open Solflare** (make sure you're on devnet)
2. **Look for these buttons:**
   - "Receive" button
   - "Deposit" button
   - "Get SOL" button
   - "Airdrop" button

### Method 2: Check the Menu
1. **Click the menu icon** (three dots or hamburger menu)
2. **Look for:**
   - "Airdrop"
   - "Get SOL"
   - "Request SOL"

### Method 3: Check Settings
1. **Go to Settings**
2. **Look for:**
   - "Devnet" section
   - "Airdrop" option
   - "Get Test SOL"

## 🚀 Alternative: Use Our Script

If you can't find the airdrop option in Solflare, use our script:

```bash
npm run airdrop:devnet
```

This will:
- ✅ Show your wallet address
- ✅ Check current balance
- ✅ Request airdrop automatically
- ✅ Show you external faucet options if it fails

## 🌐 External Faucets (If Solflare Airdrop Doesn't Work)

### Option 1: Official Solana Faucet
1. **Go to:** https://faucet.solana.com/
2. **Select "Devnet"**
3. **Paste your wallet address**
4. **Click "Request SOL"**

### Option 2: SolFaucet
1. **Go to:** https://solfaucet.com/
2. **Select "Devnet"**
3. **Paste your wallet address**
4. **Click "Request SOL"**

### Option 3: GenesysGo Faucet
1. **Go to:** https://faucet.genesysgo.net/
2. **Paste your wallet address**
3. **Click "Request SOL"**

## 📋 Step-by-Step Process

### Step 1: Get Your Wallet Address
```bash
npm run test:wallet
```
This will show your wallet address.

### Step 2: Try Automatic Airdrop
```bash
npm run airdrop:devnet
```

### Step 3: If Automatic Fails, Use External Faucet
1. Copy your wallet address from the script output
2. Go to https://faucet.solana.com/
3. Select "Devnet"
4. Paste your address
5. Request SOL

### Step 4: Verify Balance
```bash
npm run test:wallet
```
Check that your balance is now > 0 SOL.

## 🔧 Troubleshooting

### If Airdrop Fails with "Rate Limit":
- Wait 5-10 minutes and try again
- Use external faucets instead
- Try different RPC endpoints

### If Airdrop Fails with "Daily Limit":
- Use external faucets
- Wait until tomorrow
- Try different faucet websites

### If Wallet Shows 0 SOL After Airdrop:
- Wait a few minutes for transaction to confirm
- Check transaction status on devnet Solscan
- Try refreshing your wallet

## 🎯 Expected Results

After successful airdrop:
- ✅ Wallet balance > 0 SOL
- ✅ Can mint NFTs
- ✅ Transactions work properly

## 💡 Pro Tips

1. **Keep your wallet address handy** - You'll need it for faucets
2. **Try multiple faucets** - If one fails, try another
3. **Wait for confirmations** - Transactions take a few seconds
4. **Check devnet Solscan** - Verify transactions went through

## 🚀 Quick Commands

```bash
# Get your wallet address
npm run test:wallet

# Try automatic airdrop
npm run airdrop:devnet

# Test if you can mint (after getting SOL)
npm run mint
```

---

**Start here:** `npm run airdrop:devnet`
