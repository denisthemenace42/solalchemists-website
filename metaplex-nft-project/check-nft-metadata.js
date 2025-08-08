const { Connection, PublicKey } = require('@solana/web3.js');
const { Metaplex } = require('@metaplex-foundation/js');

async function checkNFTMetadata() {
  console.log('🔍 Checking NFT Metadata on Devnet...');
  console.log('=' * 50);
  
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
  const metaplex = Metaplex.make(connection);
  
  // NFT addresses from your minting
  const nftAddresses = [
    '73KP4Vin81UJCPPcckceS4wqyX3RLzvX2sPN2wUTySLQ', // Single mint
    'Bw2SkR8iTM94EbFNVZfEXEuiap4xRsn3R7E5C9SCmAb', // Batch mint #1
    '14M7jnLDUCiNspgiXfH3YpN1HT6nfXBACUPF7NZgqmGh', // Batch mint #2
    'G4h2Hc2FnBFX3X8WY51vAxjoY8exWQygN72nSxSVrXTK', // Batch mint #3
    'FRzEQNXwKKk9s1LtXB7icQ29YRM2Dc3hKXTvt6FQxtqo', // Batch mint #4
    'ELdE564y1xuAufrAjTrGdkYFm4RrgCmwrQv6zqKhfTz6'  // Batch mint #5
  ];
  
  for (let i = 0; i < nftAddresses.length; i++) {
    const address = nftAddresses[i];
    console.log(`\n📄 Checking NFT ${i + 1}: ${address}`);
    
    try {
      const nft = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(address) });
      
      console.log(`✅ NFT Found: ${nft.name}`);
      console.log(`🔗 Metadata URI: ${nft.uri}`);
      console.log(`🎨 Image URI: ${nft.json?.image || 'Not found'}`);
      
      // Check if attributes exist
      if (nft.json?.attributes) {
        console.log(`📊 Attributes (${nft.json.attributes.length}):`);
        nft.json.attributes.forEach(attr => {
          console.log(`   • ${attr.trait_type}: ${attr.value}`);
        });
      } else {
        console.log('⚠️  No attributes found');
      }
      
      // Check if image is accessible
      if (nft.json?.image) {
        try {
          const imageUrl = nft.json.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
          const response = await fetch(imageUrl, { method: 'HEAD' });
          if (response.ok) {
            console.log('✅ Image is accessible');
          } else {
            console.log('❌ Image not accessible');
          }
        } catch (error) {
          console.log('❌ Error checking image:', error.message);
        }
      }
      
      console.log(`🌐 Solscan: https://solscan.io/token/${address}?cluster=devnet`);
      
    } catch (error) {
      console.log(`❌ Error fetching NFT: ${error.message}`);
    }
  }
  
  console.log('\n' + '=' * 50);
  console.log('🎯 NFT Metadata Check Complete!');
  console.log('💡 If images and attributes are showing correctly, your NFTs are properly configured.');
}

checkNFTMetadata().catch(console.error);
