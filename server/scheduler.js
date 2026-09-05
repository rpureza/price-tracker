const cron = require('node-cron');
const { checkPrice } = require('./priceChecker');
const { sendAlertEmail } = require('./emailAlert');
const Coin = require('./models/Coin');

async function runScheduledChecks() {
  console.log(`\n[${new Date().toISOString()}] Running scheduled price checks...`);

  const trackedCoins = await Coin.find();

  for (const tracked of trackedCoins) {
    try {
      const result = await checkPrice(tracked);
      const status = result.triggered ? 'ALERT TRIGGERED' : 'no alert';
      console.log(
        `  ${result.coinId}: $${result.currentPrice} (threshold ${result.direction} ${result.threshold}) -> ${status}`
      );

      if (result.triggered) {
        await sendAlertEmail(result);
      }
    } catch (error) {
      console.error(`  Error checking ${tracked.coinId}:`, error.message);
    }
  }
}

function startScheduler() {
  cron.schedule('*/10 * * * *', runScheduledChecks);
  console.log('Price check scheduler started (runs every 10 minutes)');
}

module.exports = { startScheduler, runScheduledChecks };