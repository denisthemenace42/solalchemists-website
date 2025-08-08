const fs = require('fs');

// Cost constants (in SOL)
const MINTING_FEE_PER_NFT = 0.000005; // ~0.000005 SOL per NFT
const TRANSACTION_FEE = 0.00025; // ~0.00025 SOL per transaction
const BATCH_SIZE = 20; // NFTs per transaction

function calculateCosts(nftCount, strategy = 'batch') {
  console.log('💰 NFT Minting Cost Calculator');
  console.log('=' * 50);
  console.log(`🎯 NFT Count: ${nftCount}`);
  console.log(`📦 Strategy: ${strategy}`);
  console.log('---');
  
  let totalMintingFees = nftCount * MINTING_FEE_PER_NFT;
  let totalTransactionFees = 0;
  let totalCost = 0;
  
  if (strategy === 'batch') {
    // Calculate transactions needed
    const transactions = Math.ceil(nftCount / BATCH_SIZE);
    totalTransactionFees = transactions * TRANSACTION_FEE;
  } else if (strategy === 'individual') {
    // Each NFT is a separate transaction
    totalTransactionFees = nftCount * TRANSACTION_FEE;
  }
  
  totalCost = totalMintingFees + totalTransactionFees;
  
  console.log(`📊 Cost Breakdown:`);
  console.log(`   • Minting Fees: ${totalMintingFees.toFixed(6)} SOL`);
  console.log(`   • Transaction Fees: ${totalTransactionFees.toFixed(6)} SOL`);
  console.log(`   • Total Cost: ${totalCost.toFixed(6)} SOL`);
  console.log('---');
  
  // Convert to USD (approximate)
  const solPriceUSD = 100; // Approximate SOL price
  const totalCostUSD = totalCost * solPriceUSD;
  
  console.log(`💵 Estimated USD Cost (SOL @ $${solPriceUSD}):`);
  console.log(`   • Total: $${totalCostUSD.toFixed(2)} USD`);
  console.log('---');
  
  // Recommendations
  console.log(`💡 Recommendations:`);
  console.log(`   • Keep ${Math.max(1, totalCost * 3).toFixed(2)} SOL for safety`);
  console.log(`   • Use batch minting to reduce transaction fees`);
  console.log(`   • Monitor gas prices for optimal timing`);
  
  return {
    nftCount,
    strategy,
    totalMintingFees,
    totalTransactionFees,
    totalCost,
    totalCostUSD,
    recommendedSOL: Math.max(1, totalCost * 3)
  };
}

function compareStrategies(nftCount) {
  console.log('🔄 Strategy Comparison');
  console.log('=' * 50);
  
  const batchCosts = calculateCosts(nftCount, 'batch');
  console.log('\n');
  const individualCosts = calculateCosts(nftCount, 'individual');
  
  console.log('\n📈 Savings Analysis:');
  const savings = individualCosts.totalCost - batchCosts.totalCost;
  const savingsPercent = (savings / individualCosts.totalCost) * 100;
  
  console.log(`   • Batch vs Individual Savings: ${savings.toFixed(6)} SOL`);
  console.log(`   • Savings Percentage: ${savingsPercent.toFixed(1)}%`);
  console.log(`   • USD Savings: $${(savings * 100).toFixed(2)}`);
}

function mysteryStrategyCosts() {
  console.log('🔮 Mystery Strategy Cost Analysis');
  console.log('=' * 50);
  
  const phases = [
    { name: 'Phase 1: Mystery Launch', count: 100, description: 'Initial mystery NFTs' },
    { name: 'Phase 2: Community Building', count: 0, description: 'No minting, just marketing' },
    { name: 'Phase 3: Full Reveal', count: 100, description: 'Reveal existing NFTs (no new minting)' },
    { name: 'Phase 4: Full Collection', count: 911, description: 'Remaining NFTs' }
  ];
  
  let totalCost = 0;
  
  phases.forEach((phase, index) => {
    if (phase.count > 0) {
      const costs = calculateCosts(phase.count, 'batch');
      totalCost += costs.totalCost;
      
      console.log(`\n📋 ${phase.name}:`);
      console.log(`   • NFTs: ${phase.count}`);
      console.log(`   • Cost: ${costs.totalCost.toFixed(6)} SOL`);
      console.log(`   • Description: ${phase.description}`);
    } else {
      console.log(`\n📋 ${phase.name}:`);
      console.log(`   • NFTs: ${phase.count}`);
      console.log(`   • Cost: 0 SOL`);
      console.log(`   • Description: ${phase.description}`);
    }
  });
  
  console.log('\n💰 Total Mystery Strategy Cost:');
  console.log(`   • Total: ${totalCost.toFixed(6)} SOL`);
  console.log(`   • USD: $${(totalCost * 100).toFixed(2)}`);
  console.log(`   • Recommended SOL: ${(totalCost * 3).toFixed(2)} SOL`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  switch (command) {
    case 'mystery':
      mysteryStrategyCosts();
      break;
    case 'compare':
      const count = parseInt(args[1]) || 100;
      compareStrategies(count);
      break;
    case 'calculate':
      const nftCount = parseInt(args[1]) || 100;
      const strategy = args[2] || 'batch';
      calculateCosts(nftCount, strategy);
      break;
    case 'full':
      console.log('🎯 Full Collection (1,111 NFTs) Analysis');
      console.log('=' * 50);
      calculateCosts(1111, 'batch');
      break;
    case 'help':
    default:
      console.log('💰 NFT Cost Calculator - Usage:');
      console.log('  npm run cost:calculate <nft_count> [strategy]');
      console.log('  npm run cost:compare <nft_count>');
      console.log('  npm run cost:mystery');
      console.log('  npm run cost:full');
      console.log('');
      console.log('Examples:');
      console.log('  npm run cost:calculate 100 batch');
      console.log('  npm run cost:compare 500');
      console.log('  npm run cost:mystery');
      console.log('  npm run cost:full');
      break;
  }
}

main();
