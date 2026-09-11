const express = require('express');
const cors = require('cors');
const { pool } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

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
