const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base URL for CoinGecko's free public API
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'Price Tracker API is running' });
});

// Test route: fetch the current price of a coin (default: bitcoin) in USD
app.get('/api/price/:coinId', async (req, res) => {
  const { coinId } = req.params;

  try {
    const response = await axios.get(`${COINGECKO_BASE_URL}/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'usd'
      }
    });

    if (!response.data[coinId]) {
      return res.status(404).json({ error: `Coin "${coinId}" not found` });
    }

    res.json({
      coin: coinId,
      price_usd: response.data[coinId].usd
    });
  } catch (error) {
    console.error('Error fetching price from CoinGecko:', error.message);
    res.status(500).json({ error: 'Failed to fetch price data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
