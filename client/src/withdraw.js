const express = require('express');
const { kraken } = require('../app');
const { ethers } = require('ethers');
const authenticateToken = require('../middlewares/auth');
const router = express.Router();

// Withdraw to Kraken or external wallet
router.post('/', authenticateToken, async (req, res) => {
  const { amount, currency, walletAddress, walletType } = req.body;

  try {
    if (walletType === 'Kraken') {
      // Withdraw to Kraken
      const result = await kraken.api('Withdraw', {
        asset: currency,
        key: walletAddress,
        amount: amount,
      });
      res.json({ success: true, result });
    } else {
      // Withdraw to external wallet (MetaMask, TrustWallet)
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

module.exports = router;