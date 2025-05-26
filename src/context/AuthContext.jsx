/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { googleLogout } from '@react-oauth/google';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const storedUser = localStorage.getItem('user');
    console.log('Initializing user from localStorage:', storedUser);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('Loading user with token:', token);
        if (token) {
          const userData = await authService.getCurrentUser();
          console.log('Loaded user data:', userData);
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [token]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Google sign-in successful, credential:', credentialResponse);
      const userData = await authService.googleAuth(credentialResponse.credential);
      console.log('Google auth user data:', userData);
      const newToken = localStorage.getItem('token');
      if (!newToken) {
        throw new Error('Failed to get authentication token');
      }
      setToken(newToken);
      setUser(userData);
      navigate('/marketplace');
    } catch (err) {
      console.error('Google auth failed:', err);
      logout();
    }
  };

  const handleGoogleFailure = () => {
    console.error('Google Sign In was unsuccessful');
  };

  const loginWithEmail = async (email, password) => {
    try {
      console.log('Attempting email login for:', email);
      const userData = await authService.login(email, password);
      console.log('Email login successful, user data:', userData);
      const newToken = localStorage.getItem('token');
      if (!newToken) {
        throw new Error('Failed to get authentication token');
      }
      setToken(newToken);
      setUser(userData);
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration for:', userData.email);
      const newUser = await authService.register(userData);
      console.log('Registration successful, user data:', newUser);
      const newToken = localStorage.getItem('token');
      if (!newToken) {
        throw new Error('Failed to get authentication token');
      }
      setToken(newToken);
      setUser(newUser);
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    }
  };

  const logout = () => {
    console.log('Logging out user:', user);
    googleLogout();
    authService.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/auth/signin');
  };

  const isAuthenticated = () => {
    const authenticated = !!user && !!token;
    console.log('Checking authentication:', { user: !!user, token: !!token, authenticated });
    return authenticated;
  };

  const updateUser = (updatedData) => {
    console.log('Updating user data:', updatedData);
    setUser(prev => ({ ...prev, ...updatedData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        handleGoogleSuccess,
        handleGoogleFailure,
        loginWithEmail,
        register,
        logout,
        isAuthenticated,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};