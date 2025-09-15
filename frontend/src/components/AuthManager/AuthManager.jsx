import React, { useState, useEffect } from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';
import DashboardLayout from '../Dashboard/Dashboard';
import api from '../../utils/api';

const AuthManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/users/current-user', { withCredentials: true });
      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
  };

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-[#04445E]">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return showRegister ? (
      <Register
        onRegister={handleRegister}
        onNavigateToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={handleLogin}
        onNavigateToRegister={() => setShowRegister(true)}
      />
    );
  }

  return <DashboardLayout user={user} onLogout={handleLogout} />;
};

export default AuthManager;