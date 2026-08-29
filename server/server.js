const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { fetchCurrentPrice, checkPrice } = require('./priceChecker');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'Price Tracker API is running' });
});

// Get current price for a coin
app.get('/api/price/:coinId', async (req, res) => {
  const { coinId } = req.params;

  try {
    const price = await fetchCurrentPrice(coinId);
    res.json({ coin: coinId, price_usd: price });
  } catch (error) {
    console.error('Error fetching price:', error.message);
    res.status(500).json({ error: 'Failed to fetch price data' });
  }
});

// Check a coin's price against a threshold
// Example: /api/check?coinId=bitcoin&threshold=60000&direction=above
app.get('/api/check', async (req, res) => {
  const { coinId, threshold, direction } = req.query;

  if (!coinId || !threshold || !direction) {
    return res.status(400).json({
      error: 'Missing required query params: coinId, threshold, direction'
    });
  }

  try {
    const result = await checkPrice({
      coinId,
      threshold: parseFloat(threshold),
      direction
    });
    res.json(result);
  } catch (error) {
    console.error('Error checking price threshold:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
