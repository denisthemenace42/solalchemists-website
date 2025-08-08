# 🧪 Devnet Testing Guide - Mystery NFT Reveal

## 🎯 **Complete Testing Setup**

### **Step 1: Create Mystery NFT for Testing**
```bash
# Create a mystery NFT on devnet
npm run test:create-mystery
```

### **Step 2: Start Reveal Website**
```bash
# Start the reveal website (configured for devnet)
npm run reveal:serve
```

### **Step 3: Test the Full Flow**
1. **Visit:** http://localhost:3000
2. **Connect wallet** (Phantom/Solflare on devnet)
3. **See mystery NFT** in your wallet
4. **Click "Reveal NFT"** button
5. **Confirm transaction** in wallet
6. **See revealed NFT** with attributes!

---

## 🔧 **Prerequisites**

### **Wallet Setup:**
1. **Install Phantom/Solflare** wallet extension
2. **Switch to devnet** in wallet settings
3. **Import your devnet wallet** (from wallet-config.js)
4. **Get devnet SOL** (run: `npm run airdrop:devnet`)

### **Devnet SOL:**
```bash
# Get devnet SOL for testing
npm run airdrop:devnet
```

---

## 🎭 **Testing Animation & Attributes**

### **What You'll See:**

#### **Before Reveal:**
- **Mystery Image:** Gray placeholder with "Mystery Alchemist" text
- **Attributes:** 
  - Status: Mystery
  - Reveal Date: TBA

#### **After Reveal:**
- **Real Image:** Red background with "SOLalchemists #1!" text
- **Attributes:**
  - Background: Solana
  - Items: Black_Stick
  - Robe: Cyber_Robe
  - Headwear: Red_Eyes

---

## 🚀 **Quick Test Commands**

```bash
# Complete testing setup
npm run test:reveal-setup

# Individual steps
npm run test:create-mystery    # Create mystery NFT
npm run reveal:serve          # Start website
npm run airdrop:devnet        # Get devnet SOL
```

---

## 📱 **Testing Checklist**

- [ ] **Wallet connected** to devnet
- [ ] **Devnet SOL** available (0.1+ SOL)
- [ ] **Mystery NFT** created successfully
- [ ] **Website loads** at http://localhost:3000
- [ ] **Wallet connects** without errors
- [ ] **Mystery NFT appears** in list
- [ ] **Reveal button works** and shows loading
- [ ] **Transaction confirms** in wallet
- [ ] **NFT updates** with real image and attributes
- [ ] **Success message** appears
- [ ] **Solscan link** works (devnet)

---

## 🎯 **Expected Results**

### **Successful Test:**
- ✅ Mystery NFT created on devnet
- ✅ Website shows mystery NFT
- ✅ Reveal button triggers wallet popup
- ✅ Transaction confirms successfully
- ✅ NFT updates to revealed state
- ✅ All 4 attributes visible
- ✅ Success message with Solscan link

### **If Issues:**
- Check wallet is on devnet
- Ensure sufficient devnet SOL
- Verify wallet connection
- Check browser console for errors

---

## 🌟 **Perfect for Testing!**

This setup lets you test the complete user experience:
- **Mystery NFT creation** ✅
- **Website functionality** ✅
- **Wallet integration** ✅
- **Reveal animation** ✅
- **Attribute display** ✅
- **Transaction flow** ✅

**Ready to test the full mystery reveal experience! 🚀**
