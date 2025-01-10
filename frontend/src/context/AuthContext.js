import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // Będzie przechowywać obiekt usera (z is_superuser, is_trainer, etc.)
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('access_token') || null
  );
  const [loading, setLoading] = useState(true);   // flaga, by poczekać na pobranie /me/
  const [error, setError] = useState('');

  // ---------------------------
  // 1. Funkcja do pobrania danych usera z /api/me/
  // ---------------------------
  const fetchCurrentUser = async () => {
    try {
      const response = await axiosClient.get('/me/');
      // przykładowy JSON: { id, username, email, is_trainer, is_superuser, ... }
      setUser(response.data);
    } catch (err) {
      console.error('fetchCurrentUser error:', err);
      setUser(null);
    }
  };

  // ---------------------------
  // 2. useEffect - jeśli mamy token w localStorage, to spróbuj pobrać usera
  // ---------------------------
  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);
          // Sprawdź, czy token nie jest przeterminowany
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            // Mamy ważny token -> pobierz dane usera z backu
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

  // ---------------------------
  // 3. Logowanie - pobierz token, zapisz w localStorage, pobierz usera
  // ---------------------------
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

      // Po ustawieniu tokenu -> pobierz usera
      await fetchCurrentUser();
      return true;
    } catch (err) {
      console.error('login error:', err);
      setError('Błędne dane logowania.');
      return false;
    }
  };

  // ---------------------------
  // 4. Wylogowanie
  // ---------------------------
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setUser(null);
    setError('');
  };

  // ---------------------------
  // 5. googleLogin (opcjonalne)
  // ---------------------------
  const googleLogin = async (googleToken) => {
    try {
      setError('');
      const response = await axiosClient.post('/google-login/', {
        token: googleToken,
      });
      // Załóżmy, że backend zwraca access/refresh
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access);

      // pobierz dane usera
      await fetchCurrentUser();

      return true;
    } catch (err) {
      console.error('googleLogin error:', err);
      setError('Błąd logowania Google');
      return false;
    }
  };

  // ---------------------------
  // 6. Kontekst
  // ---------------------------
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
