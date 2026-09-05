const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { fetchCurrentPrice, checkPrice } = require('./priceChecker');
const { startScheduler, runScheduledChecks } = require('./scheduler');
const Coin = require('./models/Coin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.get('/', (req, res) => {
  res.json({ status: 'Price Tracker API is running' });
});

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

// Get all tracked coins
app.get('/api/tracked', async (req, res) => {
  try {
    const coins = await Coin.find();
    res.json(coins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracked coins' });
  }
});

// Add a new tracked coin
app.post('/api/tracked', async (req, res) => {
  const { coinId, threshold, direction } = req.body;
  if (!coinId || !threshold || !direction) {
    return res.status(400).json({ error: 'Missing coinId, threshold, or direction' });
  }
  try {
    const newCoin = await Coin.create({ coinId, threshold, direction });
    res.status(201).json(newCoin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add tracked coin' });
  }
});

// Delete a tracked coin
app.delete('/api/tracked/:id', async (req, res) => {
  try {
    await Coin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coin removed from tracking' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tracked coin' });
  }
});

app.post('/api/check-now', async (req, res) => {
  await runScheduledChecks();
  res.json({ message: 'Manual check complete. See server logs for results.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startScheduler();
});