# 🔮 SOLalchemists Mystery Reveal Website

A beautiful, interactive website where users can reveal their mystery NFTs by connecting their wallet.

## ✨ Features

- 🔗 **Wallet Connection** - Connect Phantom, Solflare, or any Solana wallet
- 🔍 **Auto-Detection** - Automatically finds mystery NFTs in connected wallet
- 🎭 **One-Click Reveal** - Users can reveal their NFTs with a single click
- 📱 **Mobile Friendly** - Responsive design works on all devices
- ⚡ **Real-time Updates** - NFT list updates automatically after reveals
- 🔒 **Secure** - No private keys required, uses wallet connection

## 🚀 Quick Start

### Option 1: Simple HTTP Server
```bash
# Navigate to the reveal-website directory
cd reveal-website

# Start with Python (if you have Python installed)
python3 -m http.server 3000

# Or with Node.js serve
npx serve .

# Or with any other static file server
```

### Option 2: Express Server
```bash
# Install dependencies
npm install

# Start the server
npm start

# Or in development mode
npm run dev
```

### Option 3: Direct File Opening
Simply open `index.html` in your browser (some features may not work due to CORS).

## 🌐 Access the Website

Once started, visit:
- **Local:** http://localhost:3000
- **Network:** http://your-ip:3000 (for testing on mobile)

## 📱 How It Works

### For Users:
1. **Connect Wallet** - Click "Connect Wallet" button
2. **View NFTs** - See all mystery NFTs in their wallet
3. **Click Reveal** - Click "Reveal NFT" button for each mystery NFT
4. **Confirm Transaction** - Approve the transaction in their wallet
5. **See Results** - NFT is revealed with real alchemist artwork!

### Technical Process:
1. **Wallet Connection** - Uses Solana wallet adapter
2. **NFT Detection** - Queries wallet for MYSTERY_ALCH NFTs
3. **Metadata Update** - Updates NFT metadata to real alchemist
4. **Transaction Signing** - User signs the update transaction
5. **Success Feedback** - Shows success message with Solscan link

## 🎨 Customization

### Colors and Styling
Edit the CSS in `index.html` to match your brand:
```css
body {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}

.reveal-button {
    background: linear-gradient(45deg, #YOUR_BUTTON_COLOR1, #YOUR_BUTTON_COLOR2);
}
```

### Mystery Image
Replace the mystery image by updating the base64 SVG in `reveal.js`:
```javascript
// Find this line and replace with your mystery image URL
src="${nft.json?.image || 'YOUR_MYSTERY_IMAGE_URL'}"
```

### Metadata URI
Update the metadata URI in `reveal.js`:
```javascript
// Update this line with your metadata CID
const realMetadataUri = `ipfs://YOUR_METADATA_CID/${nftNumber}.json`;
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### GitHub Pages
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main`)

### Traditional Hosting
Upload all files to your web hosting service:
- `index.html`
- `reveal.js`
- `package.json` (optional)

## 🔧 Configuration

### Network Configuration
To change from mainnet to devnet, update in `reveal.js`:
```javascript
// Change this line
this.connection = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// To this for devnet
this.connection = new solanaWeb3.Connection('https://api.devnet.solana.com', 'confirmed');
```

### Metadata Configuration
Update your metadata CID in `reveal.js`:
```javascript
// Replace with your actual metadata CID
const realMetadataUri = `ipfs://bafybeigpyq4qqmigd5mhghp5zfdz7hckyiv7hdkxdz5sxi2jeyyetnnr5a/${nftNumber}.json`;
```

## 🛠️ Development

### Adding New Features
1. Edit `index.html` for UI changes
2. Edit `reveal.js` for functionality
3. Test with `npm start`
4. Deploy when ready

### Debugging
Open browser developer tools (F12) to see:
- Console logs for debugging
- Network requests for API calls
- Wallet connection status

## 🔒 Security Notes

- ✅ **No Private Keys** - Website never sees private keys
- ✅ **Wallet Signing** - All transactions signed by user's wallet
- ✅ **Client-Side** - All processing happens in user's browser
- ✅ **HTTPS Recommended** - Use HTTPS in production

## 📞 Support

If you need help:
1. Check browser console for errors
2. Ensure wallet is connected
3. Verify you have mystery NFTs
4. Check network connection

## 🎉 Success!

Your users can now:
- Connect their wallet
- See their mystery NFTs
- Click to reveal them
- View the revealed alchemists on Solscan

**Perfect for building engagement and community! 🚀**
