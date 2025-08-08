# 🔐 Security Guide

## Protecting Sensitive Information

This repository is public, so **NEVER commit sensitive information** like API keys, private keys, or wallet addresses.

### ✅ What's Safe to Commit:
- HTML, CSS, JavaScript files
- Images and assets
- Configuration examples
- Documentation

### ❌ What's NOT Safe to Commit:
- API keys
- Private keys
- Wallet addresses
- Database credentials
- Firebase config with real keys
- Environment variables (.env files)

## Setup Instructions

### 1. Firebase Configuration
1. Copy `firebase-config.example.js` to `firebase-config.js`
2. Replace placeholder values with your actual Firebase config
3. The real `firebase-config.js` is already in `.gitignore`

### 2. Environment Variables
Create a `.env` file (already in `.gitignore`) for any additional secrets:
```
FIREBASE_API_KEY=your_actual_api_key
TWITTER_CLIENT_ID=your_twitter_client_id
WALLET_PRIVATE_KEY=your_wallet_private_key
```

### 3. Vercel Deployment
Set environment variables in Vercel dashboard:
- Go to your project settings
- Add environment variables
- Never commit them to the repository

## Security Checklist

- [ ] Firebase config is in `.gitignore`
- [ ] No API keys in committed files
- [ ] No wallet private keys in repository
- [ ] Environment variables are set in deployment platform
- [ ] Example files don't contain real credentials

## If You Accidentally Committed Secrets

1. **Immediately rotate/regenerate** the exposed credentials
2. **Remove from git history** using:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch path/to/file" \
   --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** to remove from remote:
   ```bash
   git push origin --force --all
   ```

## 🚨 CRITICAL: Firebase API Keys Exposed

**Your Firebase API keys were exposed in the repository!**

### **Immediate Actions Required:**

1. **Regenerate Firebase API Key:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Project Settings → General → Your apps
   - Click web app → "Regenerate API key"
   - **Save the new key securely**

2. **Set up Environment Variables:**
   - Create `.env` file for local development
   - Add environment variables to Vercel
   - Use `firebase-config.example.js` as template

3. **Remove Exposed Keys:**
   - The `firebase-config.js` file has been deleted
   - Update `.gitignore` to prevent future commits
   - Follow `ENVIRONMENT_SETUP.md` for complete setup

### **Security Impact:**
- Exposed API keys can be used by malicious actors
- Immediate regeneration is critical
- Monitor Firebase usage for unauthorized access

## Best Practices

- Use environment variables for all secrets
- Keep example files with placeholder values
- Regularly audit your repository for exposed secrets
- Use tools like `git-secrets` to prevent accidental commits
- Consider using a private repository for development
