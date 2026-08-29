const cron = require('node-cron');
const { checkPrice } = require('./priceChecker');

// In-memory list of tracked coins for now (Day 5 will move this to a database)
const trackedCoins = [
  { coinId: 'bitcoin', threshold: 60000, direction: 'above' },
  { coinId: 'ethereum', threshold: 2500, direction: 'below' }
];

async function runScheduledChecks() {
  console.log(`\n[${new Date().toISOString()}] Running scheduled price checks...`);

  for (const tracked of trackedCoins) {
    try {
      const result = await checkPrice(tracked);
      const status = result.triggered ? 'ALERT TRIGGERED' : 'no alert';
      console.log(
        `  ${result.coinId}: $${result.currentPrice} (threshold ${result.direction} ${result.threshold}) -> ${status}`
      );
    } catch (error) {
      console.error(`  Error checking ${tracked.coinId}:`, error.message);
    }
  }
}

function startScheduler() {
  cron.schedule('*/10 * * * *', runScheduledChecks);
  console.log('Price check scheduler started (runs every 10 minutes)');
}

module.exports = { startScheduler, runScheduledChecks, trackedCoins };