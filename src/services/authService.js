import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const authService = {
  // Google OAuth
  async googleAuth(credential) {
    try {
      console.log('Attempting Google auth with credential:', credential);
      const response = await axios.post(`${API_URL}/auth/google`, { token: credential });
      console.log('Google auth response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data.user;
      }
      throw new Error('No token received from server');
    } catch (error) {
      console.error('Google auth error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  },

  // Email/password login
  async login(email, password) {
    try {
      console.log('Attempting login with:', { email });
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      console.log('Login response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data.user;
      }
      throw new Error('No token received from server');
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  },

  // Email/password registration
  async register(userData) {
    try {
      console.log('Attempting registration with:', { ...userData, password: '[REDACTED]' });
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('Registration response:', response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data.user;
      }
      throw new Error('No token received from server');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      console.log('Getting current user with token:', token ? 'present' : 'missing');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Get current user response:', response.data);
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Authentication failed';
      console.error('Server error:', message);
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response
      console.error('Network error:', error.request);
      return new Error('Network error. Please check your connection and try again.');
    } else {
      // Other errors
      console.error('Unexpected error:', error);
      return new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export default authService;