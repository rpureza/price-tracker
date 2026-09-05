const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  coinId: {
    type: String,
    required: true
  },
  threshold: {
    type: Number,
    required: true
  },
  direction: {
    type: String,
    enum: ['above', 'below'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Coin', coinSchema);