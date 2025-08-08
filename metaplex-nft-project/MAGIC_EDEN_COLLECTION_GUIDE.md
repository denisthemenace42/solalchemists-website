# 🏆 Magic Eden Collection Setup Guide

## 🎯 **Metaplex Certified Collection Address**

### **What You Need for Magic Eden:**

#### **1. Metaplex Certified Collection Address**
- **This is the main requirement** for Magic Eden listing
- **Created when you mint your first collection NFT**
- **Links all your mystery NFTs together**
- **Required for Magic Eden's collection verification**

#### **2. Collection Requirements:**
- ✅ **Minimum 100 NFTs** (recommended)
- ✅ **Metadata on IPFS**
- ✅ **Images on IPFS**
- ✅ **5% royalties** (standard)
- ✅ **Verified creator**

## 🚀 **Step-by-Step Process**

### **Step 1: Create Certified Collection**

```bash
# Create the Metaplex Certified Collection
npm run collection:create

# This will:
# - Create collection NFT with isCollection: true
# - Generate collection address
# - Create sample mystery NFT
# - Save collection info to certified-collection.json
```

### **Step 2: Upload Collection Metadata to IPFS**

#### **Files to Upload:**
1. **`collection-metadata.json`** - Collection metadata
2. **`Mystery.png`** - Collection image (already uploaded)

#### **Upload Process:**
```bash
# Upload collection metadata to IPFS
# Use your preferred IPFS service (Pinata, NFT.Storage, etc.)
# Get the CID for collection-metadata.json
```

### **Step 3: Update Collection URI**

After uploading, update the collection with the correct IPFS URI:

```bash
# Update collection metadata URI
npm run collection:update-uri <new-ipfs-cid>
```

### **Step 4: Create Mystery NFT Collection**

```bash
# Create multiple mystery NFTs for Magic Eden
npm run mint:mystery-collection

# This creates 100-1000 mystery NFTs
# All linked to your certified collection
```

## 📋 **Magic Eden Application Process**

### **Information You'll Need:**

#### **1. Collection Details:**
- **Collection Name**: "SOLalchemists Mystery Collection"
- **Collection Symbol**: "MYSTERY_ALCH"
- **Collection Address**: (from certified-collection.json)
- **Total Supply**: 1000
- **Royalties**: 5%

#### **2. Collection Description:**
```
Mysterious alchemists waiting to be revealed! Each mystery NFT can be revealed to show a unique SOLalchemist from the 1120 collection. Holders can visit our reveal website to transform their mystery alchemist into a unique SOLalchemist NFT with rare traits and attributes.

Key Features:
- Mystery reveal mechanism
- 1120 unique SOLalchemists to discover
- On-demand minting system
- Interactive reveal website
- Rare trait combinations
```

#### **3. Social Media Links:**
- **Twitter**: Your project Twitter
- **Discord**: Your community Discord
- **Website**: Your reveal website
- **Instagram**: Project Instagram (optional)

### **Magic Eden Application Form:**

#### **Required Fields:**
1. **Collection Name**: SOLalchemists Mystery Collection
2. **Collection Address**: (from certified-collection.json)
3. **Collection Description**: (see above)
4. **Total Supply**: 1000
5. **Mint Price**: Your desired price (e.g., 0.5 SOL)
6. **Royalties**: 5%
7. **Social Media Links**: Your project links
8. **Website**: Your reveal website URL

## 🎭 **Collection Strategy**

### **What You're Listing:**
- ✅ **Mystery NFTs** (not the 1120 real NFTs)
- ✅ **All mystery NFTs** use the same mystery image
- ✅ **Users buy mystery NFTs** on Magic Eden
- ✅ **Users reveal** on your website to get real NFTs

### **Collection Structure:**
```
SOLalchemists Mystery Collection (Certified Collection)
├── Mystery Alchemist #1
├── Mystery Alchemist #2
├── Mystery Alchemist #3
└── ... (up to 1000)
```

### **Reveal Process:**
1. **User buys mystery NFT** on Magic Eden
2. **User visits your reveal website**
3. **User connects wallet** with mystery NFT
4. **User clicks "Reveal"**
5. **System mints real SOLalchemist NFT** to user's wallet
6. **Real NFT appears** in user's Solflare collection

## 💰 **Pricing Strategy**

### **Recommended Pricing:**
- **Mystery NFT Price**: 0.3-0.8 SOL
- **Reveal Cost**: 0.005 SOL (you absorb this)
- **Profit Margin**: 80-90% after costs

### **Revenue Example:**
- **1000 mystery NFTs** at 0.5 SOL each = 500 SOL
- **Minus reveal costs**: 500 - 5 = 495 SOL profit
- **Minus initial costs**: 495 - 1 = 494 SOL net profit

## 🔧 **Technical Implementation**

### **Current Status:**
- ✅ **Real reveal system** working
- ✅ **Holdings display** implemented
- ✅ **Website** functional
- ❌ **Certified collection** not created yet
- ❌ **Mystery NFT collection** not created yet

### **Next Steps:**
1. **Create certified collection** (this gives you the address)
2. **Upload collection metadata** to IPFS
3. **Create mystery NFT collection** (100-1000 NFTs)
4. **Apply to Magic Eden** with collection address
5. **Launch reveal website** for users

## 🎯 **When You Get the Collection Address**

### **You'll get it IMMEDIATELY after running:**
```bash
npm run collection:create
```

### **The address will be:**
- **Saved to**: `certified-collection.json`
- **Displayed in**: console output
- **Format**: Solana public key (base58)
- **Example**: `ABC123...XYZ789`

### **What to do with it:**
1. **Copy the address** from the output
2. **Use it in Magic Eden application**
3. **All mystery NFTs** will be linked to this collection
4. **Magic Eden will verify** the collection automatically

## 🚀 **Ready to Create Your Collection?**

### **Run this command to get your collection address:**
```bash
npm run collection:create
```

### **After creation, you'll have:**
- ✅ **Metaplex Certified Collection Address**
- ✅ **Collection metadata** ready for IPFS
- ✅ **Sample mystery NFT** in the collection
- ✅ **All info saved** for Magic Eden application

**Your collection address will be ready for Magic Eden listing! 🎉**
