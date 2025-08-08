# 🔗 Wallet Connection Troubleshooting

## 🚨 **Issue: "Connect Wallet" Button Not Working**

### **Current Status:**
- ✅ **Website running** on: http://localhost:58151
- ✅ **Mystery NFT created** on devnet
- ❌ **Wallet connection** not working

---

## 🔧 **Step-by-Step Troubleshooting**

### **Step 1: Test Wallet Detection**
Visit: http://localhost:58151/test-wallet.html

This will show you:
- ✅ If your wallet is detected
- ✅ What type of wallet you have
- ✅ If connection works

### **Step 2: Check Browser Console**
1. **Open browser** (Chrome/Firefox)
2. **Press F12** to open developer tools
3. **Click Console tab**
4. **Click "Connect Wallet"** button
5. **Look for error messages**

### **Step 3: Verify Wallet Installation**
Make sure you have:
- ✅ **Phantom** or **Solflare** wallet extension installed
- ✅ **Wallet is unlocked** (not locked)
- ✅ **Wallet is on devnet** (not mainnet)

---

## 🎯 **Common Solutions**

### **Solution 1: Install Wallet**
If no wallet detected:
1. **Install Phantom:** https://phantom.app/
2. **Install Solflare:** https://solflare.com/
3. **Refresh page** after installation

### **Solution 2: Switch to Devnet**
If wallet is on mainnet:
1. **Open wallet extension**
2. **Go to settings**
3. **Switch to "Devnet"**
4. **Refresh page**

### **Solution 3: Unlock Wallet**
If wallet is locked:
1. **Click wallet extension**
2. **Enter password**
3. **Unlock wallet**
4. **Try connecting again**

### **Solution 4: Import Devnet Wallet**
If you need devnet SOL:
1. **Switch wallet to devnet**
2. **Import your devnet private key** (from wallet-config.js)
3. **Get devnet SOL:** `npm run airdrop:devnet`

---

## 🧪 **Test Commands**

### **Check Website Status:**
```bash
# Check if website is running
curl -s http://localhost:58151 | head -5

# Restart website if needed
npm run reveal:serve
```

### **Get Devnet SOL:**
```bash
# Get devnet SOL for testing
npm run airdrop:devnet
```

### **Check Wallet Balance:**
```bash
# Check your devnet wallet balance
npm run test:wallet
```

---

## 🔍 **Debug Information**

### **What to Check:**
1. **Browser console** for JavaScript errors
2. **Wallet extension** status
3. **Network setting** (devnet vs mainnet)
4. **Wallet balance** (need SOL for transactions)

### **Expected Console Output:**
```
Connect wallet button clicked
Wallet connection error: [any error message]
```

### **If No Console Output:**
- Button click not being detected
- JavaScript not loading properly
- Browser compatibility issue

---

## 🚀 **Quick Fix Steps**

### **Immediate Actions:**
1. **Visit test page:** http://localhost:58151/test-wallet.html
2. **Check wallet detection**
3. **Try connecting** on test page
4. **Report results** back

### **If Test Page Works:**
- Main page has JavaScript issue
- Need to refresh main page
- Clear browser cache

### **If Test Page Doesn't Work:**
- Wallet not installed
- Wallet not on devnet
- Browser compatibility issue

---

## 📱 **Alternative Testing**

### **Try Different Browser:**
- **Chrome** (recommended)
- **Firefox**
- **Safari**

### **Try Different Wallet:**
- **Phantom** (most common)
- **Solflare**
- **Backpack**

### **Try Incognito Mode:**
- **Open incognito/private window**
- **Install wallet extension**
- **Test connection**

---

## 🎯 **Expected Results**

### **Successful Connection:**
- ✅ Wallet popup appears
- ✅ Connection approved
- ✅ Wallet address shown
- ✅ Mystery NFT appears

### **Failed Connection:**
- ❌ No popup
- ❌ Error message
- ❌ Connection rejected

---

## 📞 **Next Steps**

### **If Still Not Working:**
1. **Share console errors** from browser
2. **Share test page results**
3. **Describe wallet setup**
4. **Try alternative solutions**

### **If Working:**
1. **Test mystery NFT reveal**
2. **Switch to mainnet**
3. **Deploy to production**

---

## 🌟 **Success Checklist**

- [ ] **Wallet detected** on test page
- [ ] **Connection successful** on test page
- [ ] **Main page connection** working
- [ ] **Mystery NFT visible**
- [ ] **Reveal button functional**

**Let me know what you see on the test page! 🔍**
