# 🔑 Wallet Setup Guide for Mainnet

## Important: You Need Your Private Key, Not Just Public Key

**❌ Don't use just the public key** - You need the full keypair (private + public key) to sign transactions.

## 🎯 Method 1: Using Phantom Wallet (Recommended)

### Step 1: Export Your Private Key from Phantom

1. **Open Phantom Wallet**
2. **Go to Settings** (gear icon)
3. **Click "Export Private Key"**
4. **Enter your password**
5. **Copy the private key** (it's a long string of letters/numbers)

### Step 2: Create a Wallet Configuration File

Create a new file called `wallet-config.js`:

```javascript
const { Keypair } = require('@solana/web3.js');

// Replace this with your actual private key from Phantom
const PRIVATE_KEY_STRING = "YOUR_PRIVATE_KEY_HERE"; // Replace this!

// Convert private key string to Uint8Array
const privateKeyArray = Uint8Array.from(PRIVATE_KEY_STRING.split(',').map(num => parseInt(num)));

// Create keypair from private key
const walletKeypair = Keypair.fromSecretKey(privateKeyArray);

module.exports = { walletKeypair };
```

### Step 3: Update Your Minting Scripts

Replace the keypair generation in your scripts:

**Before:**
```javascript
const keypair = Keypair.generate(); // For testing
```

**After:**
```javascript
const { walletKeypair } = require('./wallet-config');
const keypair = walletKeypair; // Your actual wallet
```

## 🔧 Method 2: Using Base58 Private Key

If your private key is in base58 format:

```javascript
const { Keypair } = require('@solana/web3.js');
const bs58 = require('bs58'); // You may need to install: npm install bs58

const PRIVATE_KEY_BASE58 = "YOUR_BASE58_PRIVATE_KEY";

const privateKeyArray = bs58.decode(PRIVATE_KEY_BASE58);
const walletKeypair = Keypair.fromSecretKey(privateKeyArray);

module.exports = { walletKeypair };
```

## 🔧 Method 3: Using Array of Numbers

If your private key is an array of numbers:

```javascript
const { Keypair } = require('@solana/web3.js');

const PRIVATE_KEY_ARRAY = [1, 2, 3, ...]; // Your private key array

const walletKeypair = Keypair.fromSecretKey(new Uint8Array(PRIVATE_KEY_ARRAY));

module.exports = { walletKeypair };
```

## 🛡️ Security Best Practices

### ✅ Do This:
- Keep your private key secure
- Use environment variables for production
- Never commit private keys to git
- Test with small amounts first

### ❌ Don't Do This:
- Share your private key
- Store it in plain text files
- Use it on untrusted websites
- Commit it to version control

## 🔒 Using Environment Variables (Recommended for Production)

Create a `.env` file:

```bash
# .env file
WALLET_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE
```

Then update your wallet config:

```javascript
const { Keypair } = require('@solana/web3.js');
require('dotenv').config(); // npm install dotenv

const privateKeyArray = Uint8Array.from(
  process.env.WALLET_PRIVATE_KEY.split(',').map(num => parseInt(num))
);

const walletKeypair = Keypair.fromSecretKey(privateKeyArray);

module.exports = { walletKeypair };
```

## 📝 Step-by-Step Implementation

### 1. Install dotenv (if using environment variables)
```bash
npm install dotenv
```

### 2. Create wallet-config.js
```javascript
const { Keypair } = require('@solana/web3.js');
require('dotenv').config();

// Get private key from environment variable
const privateKeyString = process.env.WALLET_PRIVATE_KEY;

if (!privateKeyString) {
  throw new Error('WALLET_PRIVATE_KEY not found in environment variables');
}

// Convert to array
const privateKeyArray = Uint8Array.from(
  privateKeyString.split(',').map(num => parseInt(num))
);

// Create keypair
const walletKeypair = Keypair.fromSecretKey(privateKeyArray);

console.log('✅ Wallet loaded:', walletKeypair.publicKey.toString());

module.exports = { walletKeypair };
```

### 3. Update Your Scripts

In `mint-nft.js`, `batch-mint.js`, etc.:

```javascript
// Replace this line:
// const keypair = Keypair.generate();

// With this:
const { walletKeypair } = require('./wallet-config');
const keypair = walletKeypair;
```

### 4. Test Your Setup

```javascript
// Add this to verify your wallet is loaded correctly
console.log('💰 Wallet address:', keypair.publicKey.toString());
console.log('🔐 Wallet loaded successfully');
```

## 🚨 Important Warnings

1. **Never share your private key**
2. **Test with small amounts first**
3. **Keep backups of your wallet**
4. **Use a dedicated wallet for minting**
5. **Monitor your transactions carefully**

## ✅ Verification Checklist

Before launching on mainnet:

- [ ] Private key loaded correctly
- [ ] Wallet address matches your Phantom wallet
- [ ] Sufficient SOL balance (2-3 SOL minimum)
- [ ] Test with small batch first
- [ ] Monitor transaction logs
- [ ] Verify NFTs on Solscan

## 🎯 Quick Start Commands

```bash
# 1. Create .env file with your private key
echo "WALLET_PRIVATE_KEY=YOUR_PRIVATE_KEY_HERE" > .env

# 2. Install dotenv
npm install dotenv

# 3. Test wallet loading
node -e "const { walletKeypair } = require('./wallet-config'); console.log('Wallet:', walletKeypair.publicKey.toString());"

# 4. Start minting (small batch first)
npm run batch-mint
```

---

**Remember:** Your private key is like your password - keep it secure and never share it!
