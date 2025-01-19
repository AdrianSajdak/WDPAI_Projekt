import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('access_token') || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch current user from /me/ endpoint
  const fetchCurrentUser = async () => {
    try {
      const response = await axiosClient.get('/me/');
      // e.g. { id, username, email, is_trainer, is_superuser, ... }
      setUser(response.data);
    } catch (err) {
      console.error('fetchCurrentUser error:', err);
      setUser(null);
    }
  };

  // If we have a token, try to decode and fetch user info
  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            // Valid token -> fetch user
            await fetchCurrentUser();
          }
        } catch (error) {
          console.error('initAuth decode error:', error);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [accessToken]);

  // Login: obtain token from backend (/token/) then fetch user
  const login = async (username, password) => {
    try {
      setError('');
      const response = await axiosClient.post('/token/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access);

      // fetch user info
      await fetchCurrentUser();
      return true;
    } catch (err) {
      console.error('login error:', err);
      setError('Incorrect login credentials.');
      return false;
    }
  };

  // Logout: remove tokens from local storage and clear state
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setUser(null);
    setError('');
  };

  // Google login flow
  const googleLogin = async (googleToken) => {
    try {
      setError('');
      const response = await axiosClient.post('/google-login/', {
        token: googleToken,
      });
      // Suppose the backend also returns { access, refresh }:
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access);

      // fetch user info
      await fetchCurrentUser();
      return true;
    } catch (err) {
      console.error('googleLogin error:', err);
      setError('Google login error.');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        googleLogin,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
