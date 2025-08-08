# 🔧 Twitter OAuth Domain Fix

## Error: "This domain is not authorized for OAuth operations"

### **Quick Fix Steps:**

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select your project: `sol-alchemists`

2. **Navigate to Authentication:**
   - Click "Authentication" in the left sidebar
   - Go to "Settings" tab
   - Scroll down to "Authorized domains"

3. **Add Your Domains:**
   - Click "Add domain"
   - Add: `localhost` (for local development)
   - Add: `your-vercel-domain.vercel.app` (your Vercel domain)
   - Add: `your-custom-domain.com` (if you have one)

4. **Save Changes:**
   - Click "Save" to apply the changes

### **For Local Development:**
- Make sure `localhost` is in the authorized domains list
- This allows you to test Twitter login locally

### **For Production (Vercel):**
- Add your Vercel domain (e.g., `solalchemists-website.vercel.app`)
- Add your custom domain if you have one

### **Common Domains to Add:**
```
localhost
127.0.0.1
your-project-name.vercel.app
your-custom-domain.com
```

### **After Adding Domains:**
- Wait 5-10 minutes for changes to propagate
- Clear browser cache and try again
- The error should be resolved

### **If Still Having Issues:**
- Check that your Twitter app callback URLs match
- Verify Firebase project settings
- Ensure Twitter app is properly configured
