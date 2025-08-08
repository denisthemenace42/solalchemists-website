# 🎭 Mystery NFT Image Storage Guide

## 📁 **Where to Store Your Mystery NFT Image**

### **Option 1: IPFS (Recommended)**
```
📂 Your IPFS Structure:
├── bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a/  (Metadata JSONs)
│   ├── 1.json
│   ├── 2.json
│   └── ...
├── bafybeibwozxicevxmwjdqe3yhivglneierhkp5k7xlp2ak3wvr5c2an3my/  (Real NFT Images)
│   ├── 1.png
│   ├── 2.png
│   └── ...
└── bafybeimystery.../  (NEW: Mystery NFT Image)
    └── mystery-alchemist.png
```

### **Option 2: Same IPFS Directory**
```
📂 Alternative Structure:
├── bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a/
│   ├── 1.json
│   ├── 2.json
│   └── ...
├── bafybeibwozxicevxmwjdqe3yhivglneierhkp5k7xlp2ak3wvr5c2an3my/
│   ├── mystery-alchemist.png  ← Add here
│   ├── 1.png
│   ├── 2.png
│   └── ...
```

## 🎨 **Mystery NFT Image Requirements**

### **Image Specifications:**
- **Format**: PNG (recommended) or JPG
- **Size**: 200x200px to 1000x1000px
- **Background**: Dark/mysterious theme
- **Content**: Silhouette or mysterious alchemist figure
- **File Size**: Under 5MB

### **Example Mystery Image:**
```
🎭 Mystery Alchemist Design:
├── Dark background (purple/black)
├── Silhouette of alchemist
├── Mysterious symbols/runes
├── "?" or "Mystery" text overlay
└── Glowing effects
```

## 📝 **Mystery NFT Metadata**

### **Metadata Structure:**
```json
{
  "name": "Mystery Alchemist",
  "description": "A mysterious alchemist waiting to be revealed...",
  "image": "ipfs://bafybeibwozxicevxmwjdqe3yhivglneierhkp5k7xlp2ak3wvr5c2an3my/mystery-alchemist.png",
  "attributes": [
    {
      "trait_type": "Status",
      "value": "Mystery"
    },
    {
      "trait_type": "Reveal Date",
      "value": "TBA"
    },
    {
      "trait_type": "Collection",
      "value": "SOLalchemists"
    }
  ]
}
```

## 🚀 **Upload Process**

### **Step 1: Create Mystery Image**
1. Design your mystery alchemist image
2. Save as `mystery-alchemist.png`
3. Ensure it's mysterious and intriguing

### **Step 2: Upload to IPFS**
```bash
# Using IPFS Desktop or CLI
ipfs add mystery-alchemist.png

# Or use Pinata/Infura
# Upload to your existing IPFS gateway
```

### **Step 3: Update Configuration**
```javascript
// In your mystery NFT scripts
const MYSTERY_NFT_CONFIG = {
    name: "Mystery Alchemist",
    symbol: "MYSTERY_ALCH",
    image: "ipfs://YOUR_NEW_CID/mystery-alchemist.png",
    metadata: "ipfs://YOUR_NEW_CID/mystery-metadata.json"
};
```

## 💡 **Design Tips**

### **Visual Elements:**
- ✅ **Dark color scheme** (purple, black, dark blue)
- ✅ **Silhouette design** (mysterious figure)
- ✅ **Mystical symbols** (runes, alchemy symbols)
- ✅ **Glowing effects** (mysterious aura)
- ✅ **"?" or "Mystery" text**

### **Avoid:**
- ❌ **Bright colors** (should be mysterious)
- ❌ **Clear details** (keep it mysterious)
- ❌ **Large file sizes** (keep under 5MB)
- ❌ **Complex designs** (simple is better)

## 🔧 **Integration with Your System**

### **Update Mystery NFT Scripts:**
```javascript
// In mint-mystery.js
const mysteryMetadata = {
    name: "Mystery Alchemist",
    description: "A mysterious alchemist waiting to be revealed...",
    image: "ipfs://YOUR_CID/mystery-alchemist.png",
    attributes: [
        { trait_type: "Status", value: "Mystery" },
        { trait_type: "Reveal Date", value: "TBA" }
    ]
};
```

### **Update Reveal Website:**
```javascript
// In real-nft-reveal.html
const MYSTERY_NFT = {
    image: "ipfs://YOUR_CID/mystery-alchemist.png",
    name: "Mystery Alchemist",
    // ... other properties
};
```

## 📊 **File Organization**

### **Recommended Structure:**
```
📁 Your Project:
├── images/
│   ├── mystery-alchemist.png
│   └── real-nft-images/
├── metadata/
│   ├── mystery-metadata.json
│   └── real-nft-metadata/
├── scripts/
│   ├── mint-mystery.js
│   └── reveal-nfts.js
└── reveal-website/
    └── real-nft-reveal.html
```

## 🎯 **Next Steps**

1. **Create mystery image** following the design tips
2. **Upload to IPFS** using your preferred method
3. **Update configuration** in your scripts
4. **Test mystery NFT minting** on devnet
5. **Test reveal functionality** with the new image

## 💰 **Cost Considerations**

- **IPFS Upload**: Free (using public gateways)
- **Mystery NFT Mint**: ~0.005 SOL per mystery NFT
- **Reveal Mint**: ~0.005 SOL per reveal (on-demand)
- **Total Cost**: Much lower than pre-minting 1120 NFTs!

This approach saves you money and gives you flexibility! 🎉
