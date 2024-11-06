// models/RunHistory.js
const mongoose = require('mongoose');

const RunHistorySchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  distance: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  destination: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
});

module.exports = mongoose.model('RunHistory', RunHistorySchema);