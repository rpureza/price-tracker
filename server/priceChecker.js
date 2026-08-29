const axios = require('axios');

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

/**
 * Fetches the current USD price for a given coin from CoinGecko.
 * @param {string} coinId - e.g. 'bitcoin', 'ethereum'
 * @returns {Promise<number>} current price in USD
 */
async function fetchCurrentPrice(coinId) {
  const response = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
    params: {
      ids: coinId,
      vs_currencies: 'usd'
    }
  });

  if (!response.data[coinId]) {
    throw new Error(`Coin "${coinId}" not found`);
  }

  return response.data[coinId].usd;
}

/**
 * Checks whether the current price has crossed a threshold.
 * @param {number} currentPrice
 * @param {number} threshold
 * @param {'above'|'below'} direction - alert when price goes above or below threshold
 * @returns {boolean} true if the alert condition is met
 */
function hasCrossedThreshold(currentPrice, threshold, direction) {
  if (direction === 'above') {
    return currentPrice >= threshold;
  }
  if (direction === 'below') {
    return currentPrice <= threshold;
  }
  throw new Error(`Invalid direction "${direction}". Use "above" or "below".`);
}

/**
 * Runs a full check for one tracked coin: fetches price, compares to threshold,
 * and returns a result object describing what happened.
 * @param {{coinId: string, threshold: number, direction: 'above'|'below'}} tracked
 */
async function checkPrice(tracked) {
  const { coinId, threshold, direction } = tracked;
  const currentPrice = await fetchCurrentPrice(coinId);
  const triggered = hasCrossedThreshold(currentPrice, threshold, direction);

  return {
    coinId,
    currentPrice,
    threshold,
    direction,
    triggered
  };
}

module.exports = {
  fetchCurrentPrice,
  hasCrossedThreshold,
  checkPrice
};
