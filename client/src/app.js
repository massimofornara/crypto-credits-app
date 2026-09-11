import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Configura l'URL del backend
const API_URL = process.env.REACT_APP_API_URL || 'https://cashout-commerce-b2e6eed56345.herokuapp.com/api';

// Funzione per registrarsi
const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Errore nella registrazione:", error.response?.data || error.message);
    throw error;
  }
};

// Funzione per fare il login
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Errore nel login:", error.response?.data || error.message);
    throw error;
  }
};

// Funzione per prelevare crediti
const withdraw = async (token, amount, currency, walletAddress, walletType) => {
  try {
    const response = await axios.post(`${API_URL}/withdraw`, {
      amount,
      currency,
      walletAddress,
      walletType
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Errore nel prelievo:", error.response?.data || error.message);
    throw error;
  }
};

// Componente per la registrazione
const Register = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await register(email, password);
      localStorage.setItem('token', token);
      onLogin(token);
    } catch (err) {
      setError('Registrazione fallita. Riprova.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Registrati</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrati</button>
      </form>
      <p>
        Hai già un account? <Link to="/login">Accedi</Link>
      </p>
    </div>
  );
};

// Componente per il login
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);
      localStorage.setItem('token', token);
      onLogin(token);
    } catch (err) {
      setError('Login fallito. Credenziali errate.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Accedi</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Accedi</button>
      </form>
      <p>
        Non hai un account? <Link to="/register">Registrati</Link>
      </p>
    </div>
  );
};

// Componente per il prelievo
const Withdraw = ({ token }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDT');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletType, setWalletType] = useState('metamask');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await withdraw(token, amount, currency, walletAddress, walletType);
      setMessage(`Prelievo di ${amount} ${currency} avviato con successo!`);
      setError('');
    } catch (err) {
      setError('Prelievo fallito. Riprova.');
      setMessage('');
    }
  };

  return (
    <div className="withdraw-container">
      <h2>Preleva Crediti</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Importo"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <option value="USDT">USDT</option>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
        </select>
        <input
          type="text"
          placeholder="Indirizzo Wallet"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          required
        />
        <select value={walletType} onChange={(e) => setWalletType(e.target.value)}>
          <option value="metamask">MetaMask</option>
          <option value="kraken">Kraken</option>
        </select>
        <button type="submit">Preleva</button>
      </form>
    </div>
  );
};

// Componente principale
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se l'utente è già loggato
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  if (loading) {
    return <div>Caricamento...</div>;
  }

  return (
    <Router>
      <div className="app">
        <header>
          <h1>Crypto Credits App</h1>
          {token && (
            <nav>
              <Link to="/withdraw">Preleva</Link>
              <button onClick={handleLogout}>Esci</button>
            </nav>
          )}
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={token ? <Navigate to="/withdraw" /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={<Login onLogin={setToken} />}
            />
            <Route
              path="/register"
              element={<Register onLogin={setToken} />}
            />
            <Route
              path="/withdraw"
              element={token ? <Withdraw token={token} /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
