# 🚀 SOLalchemists Website Deployment Guide

## Vercel Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

### 3. Custom Domain Setup

#### Option A: Buy Domain from Vercel
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Search for available domains (e.g., `solalchemists.com`)
5. Purchase domain (usually $10-15/year)
6. Vercel automatically configures DNS

#### Option B: Use Existing Domain
1. Buy domain from provider (Namecheap, GoDaddy, etc.)
2. In Vercel dashboard, go to "Settings" → "Domains"
3. Add your domain
4. Update DNS records at your domain provider:
   - Add A record: `@` → `76.76.19.19`
   - Add CNAME record: `www` → `your-project.vercel.app`

### 4. Environment Variables (if needed)
In Vercel dashboard → Settings → Environment Variables:
- Add any API keys or configuration

### 5. Automatic Deployments
- Every push to `main` branch automatically deploys
- Preview deployments for pull requests

## 🔧 Troubleshooting

### If images don't load:
- Check file paths in HTML
- Ensure all images are in the `images/` folder
- Verify file permissions

### If Firebase doesn't work:
- Update Firebase config with production domain
- Add domain to Firebase Console → Authentication → Settings

### If wallet connection fails:
- Ensure HTTPS is enabled (Vercel provides this automatically)
- Update wallet connection URLs to use your custom domain

## 📱 Mobile Testing
- Test on different devices
- Check responsive design
- Verify wallet connections work on mobile

## 🎯 Success Checklist
- [ ] Website loads on Vercel
- [ ] Custom domain works
- [ ] Images display correctly
- [ ] Social login works
- [ ] Wallet connection works
- [ ] Mobile responsive
- [ ] SSL certificate active (https://)

## 💰 Cost Breakdown
- **Vercel**: FREE (Hobby plan)
- **Custom Domain**: $10-15/year
- **Total**: $10-15/year
