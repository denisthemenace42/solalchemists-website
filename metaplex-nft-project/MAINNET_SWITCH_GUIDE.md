# 🚀 Mainnet Switch Guide

## 🎯 **Complete Steps to Switch to Mainnet**

### **Step 1: Update Reveal Website for Mainnet**

Edit `reveal-website/reveal.js`:
```javascript
// Change this line:
this.connection = new solanaWeb3.Connection('https://api.devnet.solana.com', 'confirmed');

// To this:
this.connection = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com', 'confirmed');
```

### **Step 2: Update Metadata URI for Production**

Edit `reveal-website/reveal.js`:
```javascript
// Change this line:
const realMetadataUri = "data:application/json;base64," + Buffer.from(JSON.stringify(revealedMetadata)).toString('base64');

// To this:
const realMetadataUri = `ipfs://bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a/${nftNumber}.json`;
```

### **Step 3: Update Solscan Links**

Edit `reveal-website/reveal.js`:
```javascript
// Change this line:
solscanLink.href = `https://solscan.io/token/${nftAddress}?cluster=devnet`;

// To this:
solscanLink.href = `https://solscan.io/token/${nftAddress}`;
```

### **Step 4: Update NFT Filter for Production**

Edit `reveal-website/reveal.js`:
```javascript
// Change this line:
this.mysteryNFTs = nfts.filter(nft => 
    nft.symbol === 'MYST' && 
    nft.name.includes('Mystery')
);

// To this:
this.mysteryNFTs = nfts.filter(nft => 
    nft.symbol === 'MYSTERY_ALCH' && 
    nft.json?.attributes?.some(attr => 
        attr.trait_type === 'Status' && attr.value === 'Mystery'
    )
);
```

---

## 🧪 **Final Devnet Test**

### **Current Status:**
- ✅ **Mystery NFT created** on devnet: `35rxvUggqBKNdXeCDNwerpfEQLUpxk6pmEdbirBZTJDP`
- ✅ **Reveal website running** at: http://localhost:3000
- ✅ **Website configured** for devnet testing

### **Test the Complete Flow:**
1. **Visit:** http://localhost:3000
2. **Connect wallet** (Phantom/Solflare on devnet)
3. **See mystery NFT** in your wallet
4. **Click "Reveal NFT"** button
5. **Confirm transaction** in wallet
6. **See revealed NFT** with attributes!

---

## 🎯 **Mainnet Launch Checklist**

### **Before Mainnet Launch:**
- [ ] **Update reveal website** to mainnet endpoints
- [ ] **Test devnet flow** completely
- [ ] **Ensure sufficient mainnet SOL** (1+ SOL recommended)
- [ ] **Deploy website** to production (Vercel/Netlify)
- [ ] **Test production website** with mainnet wallet

### **Mainnet Launch Steps:**
1. **Mint mystery NFTs** on mainnet
2. **Deploy reveal website** to production
3. **Share with community**
4. **Monitor reveals**

---

## 💰 **Mainnet Costs**

### **Mystery NFT Creation:**
- **100 mystery NFTs:** ~$0.18 USD
- **Transaction fees:** ~$0.025 USD
- **Total:** ~$0.205 USD

### **Website Deployment:**
- **Vercel/Netlify:** Free
- **Domain (optional):** $10-15/year
- **Total:** ~$10-15/year

---

## 🚀 **Quick Commands**

### **For Devnet Testing:**
```bash
# Create mystery NFT for testing
npm run test:create-mystery

# Start reveal website (devnet)
npm run reveal:serve
```

### **For Mainnet Launch:**
```bash
# Update website to mainnet (manual edit required)
# Deploy to production
cd reveal-website
vercel --prod

# Mint mystery NFTs on mainnet
npm run mint:mystery 1 100
```

---

## 🌟 **Production Ready!**

### **Your Complete Strategy:**
1. **Test on devnet** ✅ (current)
2. **Switch to mainnet** (next step)
3. **Deploy website** to production
4. **Launch mystery collection**
5. **Build community**
6. **Scale to full collection**

**Total Investment: ~$1.79 USD for entire strategy! 🚀**
