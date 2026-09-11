import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://cashout-commerce-b2e6eed56345.herokuapp.com/api';

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      return { success: true };
    } catch (error) {
      console.error("Errore nel login:", error.response?.data || error.message);
      return { success: false, error: error.response?.data?.error || 'Login fallito' };
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      return { success: true };
    } catch (error) {
      console.error("Errore nella registrazione:", error.response?.data || error.message);
      return { success: false, error: error.response?.data?.error || 'Registrazione fallita' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return { token, login, register, logout, loading };
};
