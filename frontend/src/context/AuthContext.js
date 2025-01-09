// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem('access_token') || null
  );

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 < Date.now()) {
          // Token wygasł
          logout();
        } else {
          //Ewentualnie const meResponse = await axiosClient.get('/me/'); 
          //który zwróci {username, is_superuser, is_trainer, ...}
          //setUser(meResponse.data);
          setUser(decoded); 
        }
      } catch (err) {
        console.error(err);
        logout();
      }
    }
  }, [accessToken]);

  const login = async (username, password) => {
    try {
      const response = await axiosClient.post('/token/', {
        username,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setAccessToken(access);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const googleLogin = async (googleToken) => {
    try {
      // Uderzamy do /api/google-login/
      const response = await axiosClient.post('/google-login/', {
        token: googleToken,
      });
      // Tu moglibyśmy dostać JWT lub user data w response
      console.log(response.data);
      // ewentualnie localStorage.setItem('access_token', ...)
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
