const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const authenticateToken = require('../middleware/auth');

// Endpoint per creare una richiesta di prelievo
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, currency, walletAddress, walletType } = req.body;
    const userId = req.user.id;

    // Inserisci la richiesta di prelievo nel database
    const result = await pool.query(
      'INSERT INTO withdrawals (user_id, amount, currency, wallet_address, wallet_type, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, amount, currency, walletAddress, walletType, 'pending']
    );

    res.json({ success: true, withdrawal: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella creazione della richiesta di prelievo' });
  }
});

// Endpoint per liquidare una richiesta di prelievo (temporaneamente senza autenticazione)
router.post('/liquidate', async (req, res) => {
  try {
    const { requestId } = req.body;

    // Aggiorna lo stato della richiesta a "completed"
    const result = await pool.query(
      'UPDATE withdrawals SET status = $1, liquidation_date = NOW() WHERE id = $2 RETURNING *',
      ['completed', requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Richiesta non trovata' });
    }

    res.json({ success: true, withdrawal: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nella liquidazione della richiesta' });
  }
});

// Endpoint per ottenere le richieste di prelievo (temporaneamente senza autenticazione)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM withdrawals ORDER BY created_at DESC'
    );
    res.json({ success: true, withdrawals: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero delle richieste di prelievo' });
  }
});

module.exports = router;
