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
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const wasLoggedOut = localStorage.getItem('wasLoggedOut') === 'true';
      
      if (wasLoggedOut) {
        setLoading(false);
        return;
      }

      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);

      // Verify token is still valid
      const response = await api.get('/users/current-user', { withCredentials: true });
      
      if (response.data.success) {
        const freshUserData = response.data.data;
        setUser(freshUserData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(freshUserData));
        localStorage.removeItem('wasLoggedOut');
      } else {
        throw new Error('Token invalid');
      }
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem('user');
      localStorage.removeItem('wasLoggedOut');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    const actualUser = userData.user || userData;
    setUser(actualUser);
    setIsAuthenticated(true);
    setShowRegister(false);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('wasLoggedOut');
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowRegister(false);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.removeItem('wasLoggedOut'); 
  };

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.setItem('wasLoggedOut', 'true');
      localStorage.removeItem('user');
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