const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Metadata URI Issue...');
console.log('=' * 50);

console.log('\n📋 The Issue:');
console.log('❌ Current NFTs are pointing to image files instead of metadata JSON files');
console.log('❌ This is why attributes are not showing up on Solscan');
console.log('❌ The URI should point to the metadata JSON, not the image');

console.log('\n💡 The Solution:');
console.log('✅ Upload metadata JSON files to IPFS');
console.log('✅ Use metadata JSON URI instead of image URI');
console.log('✅ This will make attributes and images show correctly');

console.log('\n📁 Current Metadata Structure:');
const metadataDir = '../build/json';
const metadataPath = path.resolve(__dirname, metadataDir);

if (fs.existsSync(metadataPath)) {
  const files = fs.readdirSync(metadataPath).filter(file => file.endsWith('.json'));
  console.log(`✅ Found ${files.length} metadata files`);
  
  // Show example metadata
  const exampleFile = path.join(metadataPath, '1.json');
  if (fs.existsSync(exampleFile)) {
    const metadata = JSON.parse(fs.readFileSync(exampleFile, 'utf8'));
    console.log('\n📄 Example Metadata (1.json):');
    console.log(`   Name: ${metadata.name}`);
    console.log(`   Image: ${metadata.image}`);
    console.log(`   Attributes: ${metadata.attributes.length} traits`);
    metadata.attributes.forEach(attr => {
      console.log(`     • ${attr.trait_type}: ${attr.value}`);
    });
  }
} else {
  console.log('❌ Metadata directory not found');
}

console.log('\n🚀 Next Steps:');
console.log('1. Upload metadata JSON files to IPFS');
console.log('2. Update minting scripts to use metadata JSON URI');
console.log('3. Test minting with correct metadata URI');
console.log('4. Verify attributes show on Solscan');

console.log('\n💡 Quick Fix Options:');
console.log('Option A: Upload metadata to IPFS and update scripts');
console.log('Option B: Use local metadata files (for testing)');
console.log('Option C: Create new NFTs with correct metadata URI');

console.log('\n🎯 Recommended Approach:');
console.log('1. Upload all metadata JSON files to IPFS');
console.log('2. Update the minting scripts to use the correct URI');
console.log('3. Test with a few new NFTs');
console.log('4. Verify attributes and images show correctly');

console.log('\n' + '=' * 50);
console.log('💡 This will ensure your NFTs display correctly with all attributes!');
