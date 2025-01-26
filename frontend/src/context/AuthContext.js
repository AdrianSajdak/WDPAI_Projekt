import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { jwtDecode } from 'jwt-decode';  // <-- default import, bez klamerek
import '../styles/Home.css';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pobiera aktualnego usera z /me/
  const fetchCurrentUser = async () => {
    try {
      const res = await axiosClient.get('/me/');
      setUser(res.data);
    } catch (err) {
      console.error('fetchCurrentUser error:', err);
      // w razie błędu, user = null
      setUser(null);
    }
  };

  // Pierwszy effect: sprawdzamy sessionStorage, dekodujemy token
  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      // brak tokena => nie logujemy
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      // Sprawdzamy czy token wygasł
      if (decoded.exp * 1000 < Date.now()) {
        // exp jest w sekundach, Date.now() w ms
        logout();
        setLoading(false);
      } else {
        // token ważny => setAccessToken i fetchUser
        setAccessToken(token);
        fetchCurrentUser().finally(() => setLoading(false));
      }
    } catch (err) {
      console.error('decode error:', err);
      logout();
      setLoading(false);
    }
  }, []);

  // Logowanie z backendu (np. /api/token/) – zapis tokenów
  const login = async (username, password) => {
    try {
      setError('');
      const response = await axiosClient.post('/token/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('refresh_token', refresh);
      setAccessToken(access);

      await fetchCurrentUser();
      return true;
    } catch (err) {
      console.error('login error:', err);
      setError('Incorrect login credentials.');
      return false;
    }
  };

  // Wylogowanie
  const logout = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    setAccessToken(null);
    setUser(null);
    setError('');
  };

  // Google login
  const googleLogin = async (googleToken) => {
    try {
      setError('');
      const response = await axiosClient.post('/google-login/', {
        token: googleToken,
      });
      // Jeśli backend zwraca { access, refresh }
      const { access, refresh } = response.data;
      sessionStorage.setItem('access_token', access);
      sessionStorage.setItem('refresh_token', refresh);
      setAccessToken(access);

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
