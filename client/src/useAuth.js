import { createContext, useContext, useState } from 'react';
import { login, register } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const loginUser = async (email, password) => {
    const { token } = await login(email, password);
    localStorage.setItem('token', token);
    setToken(token);
  };

  const registerUser = async (email, password) => {
    const { token } = await register(email, password);
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);