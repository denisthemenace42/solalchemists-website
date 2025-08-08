# Metaplex NFT Project

This project uses Metaplex JavaScript SDK to mint NFTs on Solana.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure your wallet:**
   - Replace the `Keypair.generate()` with your actual keypair
   - For production, use mainnet instead of devnet

3. **Update file paths:**
   - Modify the paths in `mint-nft.js` to point to your actual files
   - Make sure your metadata and image files are accessible

## Usage

### Mint a single NFT:
```bash
npm run mint
```

### For production:
1. Change connection to mainnet
2. Use your actual wallet keypair
3. Test on devnet first

## File Structure

```
metaplex-nft-project/
├── mint-nft.js          # Main minting script
├── package.json         # Dependencies
└── README.md           # This file
```

## Next Steps

1. **Test on devnet first**
2. **Batch mint your entire collection**
3. **Deploy to mainnet**
4. **Create a minting website**

## Important Notes

- This script currently mints one NFT at a time
- For your 1,111 NFT collection, you'll need to modify the script for batch minting
- Consider using Candy Machine v3 for large collections
- Always test on devnet before mainnet 