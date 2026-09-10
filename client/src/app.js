const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ethers } = require('ethers');
const KrakenClient = require('kraken-api');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Kraken API setup
const kraken = new KrakenClient(
  process.env.KRAKEN_API_KEY,
  process.env.KRAKEN_PRIVATE_KEY
);

// Routes
const authRoutes = require('./routes/auth');
const withdrawRoutes = require('./routes/withdraw');
app.use('/api/auth', authRoutes);
app.use('/api/withdraw', withdrawRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { pool, kraken };