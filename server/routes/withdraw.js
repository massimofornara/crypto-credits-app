const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  const { amount, currency, walletAddress, walletType } = req.body;
  res.json({ success: true, message: `Withdrawal of ${amount} ${currency} to ${walletAddress} (${walletType}) processed.` });
});

module.exports = router;
