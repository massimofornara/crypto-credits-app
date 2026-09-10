const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

// Routes
const authRoutes = require('./routes/auth'); // ✅ Importa il router
const withdrawRoutes = require('./routes/withdraw'); // ✅ Importa il router

app.use('/api/auth', authRoutes); // ✅ Usa il router
app.use('/api/withdraw', withdrawRoutes); // ✅ Usa il router

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { pool }; // ✅ Esporta pool per le route
