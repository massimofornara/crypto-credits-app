const express = require('express');
const cors = require('cors');
const { pool, initializeDatabase } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Inizializza il database all'avvio
initializeDatabase();

// Route per la root
app.get('/', (req, res) => {
  res.send('Backend di Crypto Credits App è online!');
});

// Routes
const authRoutes = require('./routes/auth');
const withdrawRoutes = require('./routes/withdraw');
app.use('/api/auth', authRoutes);
app.use('/api/withdraw', withdrawRoutes);

// Test database
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, time: result.rows[0].now });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
