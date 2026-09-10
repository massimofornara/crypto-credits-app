import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const withdrawFunds = async ({ amount, currency, walletAddress, walletType }) => {
  const response = await axios.post(`${API_BASE_URL}/withdraw`, {
    amount,
    currency,
    walletAddress,
    walletType,
  }, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
  return response.data;
};

export const register = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, { email, password });
  return response.data;
};