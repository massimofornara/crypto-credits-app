import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { withdrawFunds } from '../utils/api';

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BTC');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletType, setWalletType] = useState('Kraken');
  const [message, setMessage] = useState('');

  const handleWithdraw = async () => {
    if (!walletAddress || !amount) {
      setMessage('Please enter a valid wallet address and amount.');
      return;
    }

    try {
      const result = await withdrawFunds({ amount, currency, walletAddress, walletType });
      setMessage(`Withdrawal successful! TX Hash: ${result.txHash || result.result}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Withdraw Funds</h1>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Amount</label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="block mb-2">Currency</label>
          <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">US Dollar (USD)</option>
          </Select>
        </div>
        <div>
          <label className="block mb-2">Wallet Type</label>
          <Select value={walletType} onChange={(e) => setWalletType(e.target.value)}>
            <option value="Kraken">Kraken</option>
            <option value="MetaMask">MetaMask</option>
            <option value="TrustWallet">TrustWallet</option>
          </Select>
        </div>
        <div>
          <label className="block mb-2">Wallet Address</label>
          <Input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
        </div>
        <Button onClick={handleWithdraw}>Withdraw</Button>
        {message && <p className="mt-4 text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Withdraw;