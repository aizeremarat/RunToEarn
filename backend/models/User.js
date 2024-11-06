// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  height: { type: Number, required: true }, // in cm
  weight: { type: Number, required: true }, // in kg
  walletAddress: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('User', userSchema);