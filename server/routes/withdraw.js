const { pool } = require('../db');
const express = require('express');
const router = express.Router(); // ✅ Crea un router Express
const { kraken } = require('../app');
const { ethers } = require('ethers');
const authenticateToken = require('../middleware/auth');

// Withdraw to Kraken or external wallet
router.post('/', authenticateToken, async (req, res) => {
  const { amount, currency, walletAddress, walletType } = req.body;

  try {
    if (walletType === 'Kraken') {
      const result = await kraken.api('Withdraw', {
        asset: currency,
        key: walletAddress,
        amount: amount,
      });
      res.json({ success: true, result });
    } else {
      const provider = new ethers.providers.JsonRpcProvider(
        `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
      );
      const wallet = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY, provider);
      const tx = await wallet.sendTransaction({
        to: walletAddress,
        value: ethers.utils.parseEther(amount.toString()),
      });
      res.json({ success: true, txHash: tx.hash });
    }
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

module.exports = router; // ✅ Esporta il router
