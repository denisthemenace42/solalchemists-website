const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const fs = require('fs');
const path = require('path');

// Test configurations
const testConfigs = {
  devnet: {
    endpoint: 'https://api.devnet.solana.com',
    name: 'Devnet',
    maxTestNFTs: 3
  },
  testnet: {
    endpoint: 'https://api.testnet.solana.com',
    name: 'Testnet',
    maxTestNFTs: 5
  }
};

class NFTTestSuite {
  constructor(network = 'devnet') {
    this.config = testConfigs[network];
    this.connection = new Connection(this.config.endpoint, 'confirmed');
    this.keypair = Keypair.generate();
    this.metaplex = Metaplex.make(this.connection).use(keypairIdentity(this.keypair));
    this.testResults = [];
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    console.log(logMessage);
    this.testResults.push({ timestamp, type, message });
  }

  async testConnection() {
    try {
      this.log('Testing network connection...');
      const version = await this.connection.getVersion();
      this.log(`✅ Connected to ${this.config.name}. Version: ${version['solana-core']}`);
      return true;
    } catch (error) {
      this.log(`❌ Connection failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testWalletSetup() {
    try {
      this.log('Testing wallet setup...');
      const balance = await this.connection.getBalance(this.keypair.publicKey);
      this.log(`✅ Wallet created: ${this.keypair.publicKey.toString()}`);
      this.log(`💰 Balance: ${balance / 1e9} SOL`);
      
      if (balance === 0) {
        this.log('Requesting airdrop for testing...');
        try {
          const signature = await this.connection.requestAirdrop(this.keypair.publicKey, 2 * 1e9);
          await this.connection.confirmTransaction(signature);
          const newBalance = await this.connection.getBalance(this.keypair.publicKey);
          this.log(`✅ Airdrop successful. New balance: ${newBalance / 1e9} SOL`);
        } catch (airdropError) {
          this.log(`⚠️  Airdrop failed: ${airdropError.message}`, 'warning');
          this.log('💡 This is common on testnet. You can:');
          this.log('   1. Use devnet for testing (recommended)');
          this.log('   2. Manually fund the testnet wallet');
          this.log('   3. Skip testnet and go directly to mainnet');
          
          // For testnet, we'll continue with 0 balance but warn about it
          if (this.config.name === 'Testnet') {
            this.log('⚠️  Continuing with 0 SOL balance - minting will fail');
            return true; // Continue test but expect failures
          }
          throw airdropError;
        }
      }
      return true;
    } catch (error) {
      this.log(`❌ Wallet setup failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testMetadataFiles() {
    try {
      this.log('Testing metadata files...');
      const metadataDir = '../build/json';
      const metadataPath = path.resolve(__dirname, metadataDir);
      
      if (!fs.existsSync(metadataPath)) {
        this.log(`❌ Metadata directory not found: ${metadataPath}`, 'error');
        return false;
      }

      const files = fs.readdirSync(metadataPath).filter(file => file.endsWith('.json'));
      this.log(`📁 Found ${files.length} metadata files`);

      if (files.length === 0) {
        this.log('❌ No metadata files found', 'error');
        return false;
      }

      // Test first few metadata files
      const testFiles = files.slice(0, Math.min(3, files.length));
      for (const file of testFiles) {
        const filePath = path.join(metadataPath, file);
        const metadata = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        if (!metadata.name || !metadata.image) {
          this.log(`❌ Invalid metadata in ${file}`, 'error');
          return false;
        }
        this.log(`✅ Validated metadata: ${metadata.name}`);
      }

      return true;
    } catch (error) {
      this.log(`❌ Metadata test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testSingleNFTMint() {
    try {
      this.log('Testing single NFT mint...');
      
      // Check wallet balance first
      const balance = await this.connection.getBalance(this.keypair.publicKey);
      if (balance === 0) {
        this.log('❌ Cannot mint NFT: Wallet has 0 SOL balance', 'error');
        this.log('💡 Solutions:');
        this.log('   1. Use devnet for testing (npm run test:devnet)');
        this.log('   2. Manually fund this wallet with SOL');
        this.log('   3. Skip testnet testing and proceed to mainnet');
        return false;
      }
      
      const metadataPath = '../build/json/1.json';
      const fullPath = path.resolve(__dirname, metadataPath);
      
      if (!fs.existsSync(fullPath)) {
        this.log('❌ Test metadata file not found', 'error');
        return false;
      }

      const metadata = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      
      const { nft } = await this.metaplex.nfts().create({
        name: metadata.name,
        symbol: 'SOLALCH',
        sellerFeeBasisPoints: 500,
        uri: metadata.image,
        isMutable: true,
        maxSupply: 1,
        creators: [
          {
            address: this.keypair.publicKey,
            share: 100,
            verified: true,
          },
        ],
      });

      this.log(`✅ NFT minted successfully!`);
      this.log(`🔗 NFT Address: ${nft.address.toString()}`);
      this.log(`🌐 View on Solscan: https://solscan.io/token/${nft.address.toString()}?cluster=${this.config.name.toLowerCase()}`);
      
      return nft;
    } catch (error) {
      this.log(`❌ NFT mint test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testBatchMint() {
    try {
      this.log('Testing batch minting...');
      
      // Check wallet balance first
      const balance = await this.connection.getBalance(this.keypair.publicKey);
      if (balance === 0) {
        this.log('❌ Cannot mint NFTs: Wallet has 0 SOL balance', 'error');
        this.log('💡 Solutions:');
        this.log('   1. Use devnet for testing (npm run test:devnet)');
        this.log('   2. Manually fund this wallet with SOL');
        this.log('   3. Skip testnet testing and proceed to mainnet');
        return false;
      }
      
      const metadataDir = '../build/json';
      const metadataPath = path.resolve(__dirname, metadataDir);
      const files = fs.readdirSync(metadataPath).filter(file => file.endsWith('.json'));
      
      const testFiles = files.slice(0, Math.min(this.config.maxTestNFTs, files.length));
      const mintedNFTs = [];

      for (let i = 0; i < testFiles.length; i++) {
        const file = testFiles[i];
        const filePath = path.join(metadataPath, file);
        const metadata = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        this.log(`Minting NFT ${i + 1}/${testFiles.length}: ${metadata.name}`);
        
        const { nft } = await this.metaplex.nfts().create({
          name: metadata.name,
          symbol: 'SOLALCH',
          sellerFeeBasisPoints: 500,
          uri: metadata.image,
          isMutable: true,
          maxSupply: 1,
          creators: [
            {
              address: this.keypair.publicKey,
              share: 100,
              verified: true,
            },
          ],
        });

        mintedNFTs.push(nft);
        this.log(`✅ Minted: ${nft.address.toString()}`);
        
        // Delay between mints
        if (i < testFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      this.log(`✅ Batch mint test completed. Minted ${mintedNFTs.length} NFTs`);
      return mintedNFTs;
    } catch (error) {
      this.log(`❌ Batch mint test failed: ${error.message}`, 'error');
      return false;
    }
  }

  async runAllTests() {
    this.log(`🚀 Starting ${this.config.name} test suite...`);
    this.log('=' * 50);

    const tests = [
      { name: 'Network Connection', test: () => this.testConnection() },
      { name: 'Wallet Setup', test: () => this.testWalletSetup() },
      { name: 'Metadata Files', test: () => this.testMetadataFiles() },
      { name: 'Single NFT Mint', test: () => this.testSingleNFTMint() },
      { name: 'Batch Mint', test: () => this.testBatchMint() }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const test of tests) {
      this.log(`\n🧪 Running: ${test.name}`);
      try {
        const result = await test.test();
        if (result) {
          passedTests++;
          this.log(`✅ ${test.name} PASSED`);
        } else {
          this.log(`❌ ${test.name} FAILED`);
        }
      } catch (error) {
        this.log(`❌ ${test.name} FAILED: ${error.message}`, 'error');
      }
    }

    this.log('\n' + '=' * 50);
    this.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      this.log('🎉 All tests passed! Ready for mainnet deployment.');
    } else {
      this.log('⚠️  Some tests failed. Please fix issues before mainnet deployment.');
    }

    // Save test results
    const resultsFile = `test-results-${this.config.name.toLowerCase()}-${Date.now()}.json`;
    fs.writeFileSync(resultsFile, JSON.stringify(this.testResults, null, 2));
    this.log(`📄 Test results saved to: ${resultsFile}`);

    return passedTests === totalTests;
  }
}

// Run tests
async function main() {
  const args = process.argv.slice(2);
  const network = args[0] || 'devnet';
  
  if (!testConfigs[network]) {
    console.log('❌ Invalid network. Use: devnet or testnet');
    process.exit(1);
  }

  const testSuite = new NFTTestSuite(network);
  const success = await testSuite.runAllTests();
  
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = NFTTestSuite;
