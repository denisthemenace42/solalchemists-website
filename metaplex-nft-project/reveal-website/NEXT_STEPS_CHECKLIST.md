# ✅ Next Steps Checklist

## 🚨 **CRITICAL: Complete These Steps in Order**

### **Step 1: Regenerate Firebase API Key** ⚠️
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Select project: `sol-alchemists`
- [ ] Click gear icon ⚙️ → "Project settings"
- [ ] Go to "General" tab
- [ ] Scroll to "Your apps" section
- [ ] Click three dots → "Manage API keys"
- [ ] Click "Regenerate API key"
- [ ] **Copy and save the new API key**

### **Step 2: Update Local Firebase Config**
- [ ] Open `firebase-config.js` in your code editor
- [ ] Replace `"YOUR_API_KEY_HERE"` with your new API key
- [ ] Replace `"YOUR_PROJECT_ID"` with `"sol-alchemists"`
- [ ] Replace `"YOUR_SENDER_ID"` with `"898278444"`
- [ ] Replace `"YOUR_APP_ID"` with `"1:898278444:web:28f2b6b20afc0852ab5d89"`
- [ ] Replace `"YOUR_MEASUREMENT_ID"` with `"G-ME4BQE7K0L"`

### **Step 3: Test Local Development**
- [ ] Run `npm start` to start local server
- [ ] Open http://localhost:3000
- [ ] Test Twitter login functionality
- [ ] Verify no console errors

### **Step 4: Set Up Vercel Environment Variables**
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Select your project: `solalchemists-website`
- [ ] Go to "Settings" tab
- [ ] Click "Environment Variables"
- [ ] Add these variables:

```
FIREBASE_API_KEY = your_new_api_key
FIREBASE_AUTH_DOMAIN = sol-alchemists.firebaseapp.com
FIREBASE_PROJECT_ID = sol-alchemists
FIREBASE_STORAGE_BUCKET = sol-alchemists.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID = 898278444
FIREBASE_APP_ID = 1:898278444:web:28f2b6b20afc0852ab5d89
FIREBASE_MEASUREMENT_ID = G-ME4BQE7K0L
```

### **Step 5: Deploy to Vercel**
- [ ] Commit your changes: `git add . && git commit -m "Update Firebase config"`
- [ ] Push to GitHub: `git push`
- [ ] Vercel will auto-deploy
- [ ] Check deployment status in Vercel dashboard

### **Step 6: Test Production**
- [ ] Visit your Vercel URL
- [ ] Test Twitter login on production
- [ ] Verify no console errors
- [ ] Check that social features work

### **Step 7: Add Firebase Authorized Domains**
- [ ] Go back to [Firebase Console](https://console.firebase.google.com/)
- [ ] Authentication → Settings tab
- [ ] Scroll to "Authorized domains"
- [ ] Add your Vercel domain (e.g., `solalchemists-website.vercel.app`)
- [ ] Add your custom domain if you have one
- [ ] Click "Save"

## 🔧 **Troubleshooting**

### **If Twitter Login Fails:**
- [ ] Check Firebase Console → Authentication → Sign-in method → Twitter is enabled
- [ ] Verify Twitter app callback URLs match your domain
- [ ] Check that authorized domains include your Vercel URL
- [ ] Wait 5-10 minutes for changes to propagate

### **If Environment Variables Don't Work:**
- [ ] Verify all variables are set in Vercel
- [ ] Check variable names match exactly (case-sensitive)
- [ ] Redeploy after adding environment variables
- [ ] Clear browser cache and try again

### **If Local Development Fails:**
- [ ] Check `firebase-config.js` has correct values
- [ ] Verify no syntax errors in the file
- [ ] Restart the development server
- [ ] Check browser console for errors

## ✅ **Success Indicators**

- [ ] Twitter login works locally
- [ ] Twitter login works on Vercel
- [ ] No console errors
- [ ] Social features function properly
- [ ] Firebase config is secure (not in git)
- [ ] Environment variables are set in Vercel

## 🎯 **Final Verification**

Run this command to check your setup:
```bash
node setup-firebase.js
```

You should see: "✅ Config appears to be properly set up"

## 📞 **Need Help?**

1. Check `ENVIRONMENT_SETUP.md` for detailed instructions
2. Review `SECURITY.md` for security best practices
3. Check browser console for specific error messages
4. Verify all steps in this checklist are completed
