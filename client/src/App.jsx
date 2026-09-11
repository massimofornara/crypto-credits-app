import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } // Hook rimosso temporaneamente;
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/withdraw" element={<Withdraw />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;