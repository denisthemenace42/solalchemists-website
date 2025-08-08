# 🔑 Quick Wallet Setup

## What You Need to Do

### ❌ Don't Use Just Public Key
You need your **private key** (not just public key) to sign transactions.

### ✅ Step-by-Step Setup

#### 1. Get Your Private Key from Phantom
1. Open Phantom Wallet
2. Go to Settings (gear icon)
3. Click "Export Private Key"
4. Enter your password
5. Copy the private key

#### 2. Update wallet-config.js
Open `wallet-config.js` and replace this line:
```javascript
const PRIVATE_KEY_STRING = "REPLACE_WITH_YOUR_ACTUAL_PRIVATE_KEY";
```

With your actual private key (it should look like a long string of numbers separated by commas).

#### 3. Test Your Wallet Setup
```bash
npm run test:wallet
```

This will:
- ✅ Verify your wallet loaded correctly
- ✅ Check your SOL balance
- ✅ Confirm wallet format is correct

#### 4. Update Your Minting Scripts
Your scripts are already updated to use the wallet config. Just make sure you have sufficient SOL balance.

## 🚨 Security Warnings

- **Never share your private key**
- **Never commit it to git**
- **Keep it secure**
- **Test with small amounts first**

## 🎯 Ready to Launch?

After setting up your wallet:

1. **Test wallet setup:**
   ```bash
   npm run test:wallet
   ```

2. **Update config for mainnet:**
   ```bash
   cp config-mainnet-ready.js config.js
   ```

3. **Start minting (small batch first):**
   ```bash
   npm run batch-mint
   ```

## 💡 Example Private Key Format

Your private key should look something like this:
```
123,45,67,89,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90,12,34,56,78,90
```

**Note:** This is just an example - use your actual private key from Phantom!

---

**Start here:** `npm run test:wallet`
