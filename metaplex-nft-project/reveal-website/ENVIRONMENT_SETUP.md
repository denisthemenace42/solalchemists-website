# 🔐 Environment Variables Setup

## Critical Security Update

Your Firebase API keys were exposed in the repository. This guide will help you set up secure environment variables.

## 🚨 Immediate Actions Required

### 1. **Regenerate Firebase API Keys**
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project: `sol-alchemists`
- Go to Project Settings → General
- Scroll down to "Your apps" section
- Click the web app → "Regenerate API key"
- **Save the new API key securely**

### 2. **Set Up Environment Variables**

#### **For Local Development:**
Create a `.env` file in your project root:
```bash
# Firebase Configuration
FIREBASE_API_KEY=your_new_api_key_here
FIREBASE_AUTH_DOMAIN=sol-alchemists.firebaseapp.com
FIREBASE_PROJECT_ID=sol-alchemists
FIREBASE_STORAGE_BUCKET=sol-alchemists.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=898278444
FIREBASE_APP_ID=1:898278444:web:28f2b6b20afc0852ab5d89
FIREBASE_MEASUREMENT_ID=G-ME4BQE7K0L
```

#### **For Vercel Deployment:**
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add each variable:
   - `FIREBASE_API_KEY` = your_new_api_key
   - `FIREBASE_AUTH_DOMAIN` = sol-alchemists.firebaseapp.com
   - `FIREBASE_PROJECT_ID` = sol-alchemists
   - `FIREBASE_STORAGE_BUCKET` = sol-alchemists.firebasestorage.app
   - `FIREBASE_MESSAGING_SENDER_ID` = 898278444
   - `FIREBASE_APP_ID` = 1:898278444:web:28f2b6b20afc0852ab5d89
   - `FIREBASE_MEASUREMENT_ID` = G-ME4BQE7K0L

### 3. **Create Your Firebase Config File**
```bash
# Copy the example file
cp firebase-config.example.js firebase-config.js

# Edit firebase-config.js and replace placeholder values with your actual keys
# This file is now protected by .gitignore
```

## 🔒 Security Best Practices

### ✅ **What's Safe:**
- Environment variables (`.env` files)
- Example files with placeholders
- Documentation

### ❌ **What's NOT Safe:**
- Hard-coded API keys in committed files
- Real credentials in public repositories
- Firebase config files with actual keys

## 🛠️ Implementation Steps

1. **Regenerate Firebase API key** (CRITICAL)
2. **Create `.env` file** with new keys
3. **Set Vercel environment variables**
4. **Create `firebase-config.js`** from example
5. **Test locally** with new configuration
6. **Deploy to Vercel** with environment variables

## 🧪 Testing

After setup, test:
- Local development server
- Twitter login functionality
- Vercel deployment
- Environment variable loading

## 📞 Support

If you need help:
1. Check Firebase Console for new API key
2. Verify environment variables are set correctly
3. Test with the example configuration first
4. Ensure `.env` file is in `.gitignore`

## ⚠️ Important Notes

- **NEVER commit** the real `firebase-config.js` file
- **ALWAYS use** environment variables for production
- **REGULARLY rotate** API keys for security
- **MONITOR** for any unauthorized usage
