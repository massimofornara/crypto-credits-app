const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authenticateToken = require('../middleware/auth');

router.post('/', authenticateToken, async (req, res) => {
  const { amount, currency, walletAddress, walletType } = req.body;
  res.json({ success: true, message: `Withdrawal of ${amount} ${currency} to ${walletAddress} (${walletType}) processed.` });
});

module.exports = router;


// Aggiungi questo al file server/routes/withdraw.js
router.post('/liquidate', authenticateToken, async (req, res) => {
  try {
    const { requestId, status } = req.body;
    // Aggiorna lo stato della richiesta nel database
    const result = await pool.query(
      'UPDATE withdrawals SET status = $1, liquidation_date = NOW() WHERE id = $2 RETURNING *',
      [status, requestId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }
    res.json({ success: true, withdrawal: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella liquidazione' });
  }
});
