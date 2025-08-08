# 🌅 Solflare Wallet Troubleshooting

## 🚨 **Issue: Solflare Wallet Not Detected**

### **Current Status:**
- ✅ **Website running** on: http://localhost:58151
- ✅ **Solflare extension** installed in Chrome
- ❌ **Wallet not detected** by website

---

## 🔧 **Solflare-Specific Solutions**

### **Solution 1: Check Solflare Extension Status**
1. **Click Solflare extension** in Chrome toolbar
2. **Make sure it's unlocked** (not showing lock icon)
3. **Check if it shows "Connected"** or "Disconnected"
4. **Try refreshing the page** after unlocking

### **Solution 2: Switch Solflare to Devnet**
1. **Open Solflare extension**
2. **Click settings** (gear icon)
3. **Go to "Network"** section
4. **Select "Devnet"** instead of "Mainnet"
5. **Refresh the page**

### **Solution 3: Check Solflare Permissions**
1. **Right-click Solflare extension**
2. **Select "Manage Extensions"**
3. **Make sure it's enabled**
4. **Check if it has permission** to access the website
5. **Try "Allow in incognito"** if needed

### **Solution 4: Import Your Devnet Wallet**
1. **Switch Solflare to devnet**
2. **Click "Import Wallet"**
3. **Use your private key** from wallet-config.js:
   ```
   130,213,28,30,25,163,91,146,46,160,5,1,184,71,120,172,187,59,2,92,148,31,173,46,128,132,96,89,230,10,98,48,104,136,188,185,28,232,14,10,138,97,47,215,39,45,59,168,150,85,48,129,239,35,50,41,212,82,214,23,51,41,44,21
   ```

---

## 🧪 **Testing Steps**

### **Step 1: Use Debug Button**
1. **Visit:** http://localhost:58151
2. **Click "Debug Wallet"** button
3. **Check browser console** (F12 → Console)
4. **Look for wallet detection messages**

### **Step 2: Check Browser Console**
1. **Press F12** to open developer tools
2. **Click Console tab**
3. **Click "Debug Wallet"** button
4. **Look for these messages:**
   ```
   🔍 Testing wallet detection...
   ✅ window.solana is available
   Wallet info: {isSolflare: true, isPhantom: false, ...}
   ```

### **Step 3: Manual Console Test**
In browser console, type:
```javascript
// Check if Solflare is detected
console.log('window.solana:', window.solana);
console.log('isSolflare:', window.solana?.isSolflare);
console.log('isConnected:', window.solana?.isConnected);
```

---

## 🎯 **Common Solflare Issues**

### **Issue 1: Solflare Not Detected**
**Symptoms:** `window.solana` is undefined
**Solutions:**
- Restart Chrome browser
- Disable and re-enable Solflare extension
- Check if extension is properly installed

### **Issue 2: Solflare Detected But Not Connecting**
**Symptoms:** `isSolflare: true` but connection fails
**Solutions:**
- Unlock Solflare wallet
- Switch to devnet network
- Clear browser cache and cookies

### **Issue 3: Wrong Network**
**Symptoms:** Wallet connects but on wrong network
**Solutions:**
- Switch Solflare to devnet
- Import devnet wallet
- Get devnet SOL: `npm run airdrop:devnet`

---

## 🚀 **Quick Fix Commands**

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

### **Restart Website:**
```bash
# Restart the reveal website
npm run reveal:serve
```

---

## 🔍 **Debug Information**

### **What to Check:**
1. **Solflare extension status** (locked/unlocked)
2. **Network setting** (devnet vs mainnet)
3. **Browser console** for errors
4. **Extension permissions**

### **Expected Console Output:**
```
🔍 Testing wallet detection...
✅ window.solana is available
Wallet info: {
  isSolflare: true,
  isPhantom: false,
  isConnected: false,
  publicKey: "None"
}
```

### **If No Output:**
- Solflare extension not loaded
- Browser compatibility issue
- Extension disabled or corrupted

---

## 📱 **Alternative Testing**

### **Try Different Browser:**
- **Chrome** (recommended for Solflare)
- **Firefox** (if Chrome doesn't work)
- **Brave** (Chrome-based)

### **Try Incognito Mode:**
1. **Open incognito window**
2. **Enable Solflare** in incognito
3. **Import devnet wallet**
4. **Test connection**

### **Try Different Wallet:**
- **Phantom** (alternative to Solflare)
- **Backpack** (another option)

---

## 🎯 **Expected Results**

### **Successful Detection:**
- ✅ "Debug Wallet" shows "Solflare wallet detected!"
- ✅ Console shows `isSolflare: true`
- ✅ "Connect Wallet" button works
- ✅ Wallet popup appears

### **Failed Detection:**
- ❌ "Debug Wallet" shows "No Solana wallet detected"
- ❌ Console shows `window.solana: undefined`
- ❌ No wallet popup

---

## 📞 **Next Steps**

### **If Still Not Working:**
1. **Share console output** from "Debug Wallet"
2. **Describe Solflare setup** (network, locked/unlocked)
3. **Try Phantom wallet** as alternative
4. **Check browser compatibility**

### **If Working:**
1. **Test mystery NFT reveal**
2. **Switch to mainnet**
3. **Deploy to production**

---

## 🌟 **Success Checklist**

- [ ] **Solflare detected** by debug button
- [ ] **Console shows** `isSolflare: true`
- [ ] **Wallet connects** successfully
- [ ] **Mystery NFT visible**
- [ ] **Reveal button functional**

**Try the "Debug Wallet" button and let me know what you see! 🔍**
