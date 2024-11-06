// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define a simple route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import models
const User = require('./models/User');
const RunHistory = require('./models/RunHistory');

// Endpoint to register a user
app.post('/api/users', async (req, res) => {
  const { name, dateOfBirth, gender, height, weight, walletAddress } = req.body;

  const normalizedAddress = walletAddress.toLowerCase();

  try {
    const newUser = new User({ name, dateOfBirth, gender, height, weight, walletAddress: normalizedAddress });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});

app.get('/api/users/:address', async (req, res) => {
  const { address } = req.params;

  const normalizedAddress = address.toLowerCase();

  try {
    const user = await User.findOne({ walletAddress: normalizedAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/run-history/log-run', async (req, res) => {
  console.log("Log Run endpoint hit:", req.body);
  const { userAddress, distance, latitude, longitude } = req.body;

  try {
    const newRun = new RunHistory({
      userAddress,
      distance,
      destination: { latitude, longitude }
    });

    await newRun.save();
    res.status(201).json({ message: 'Run logged successfully!' });
  } catch (error) {
    console.error("Error saving run history:", error);
    res.status(500).json({ error: 'Error logging run' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
