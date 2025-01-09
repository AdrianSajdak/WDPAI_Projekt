// src/components/Layout/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ backgroundColor: '#eee', padding: '1rem' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', margin: 0 }}>
        <li><Link to="/">Strona główna</Link></li>
        <li><Link to="/classes">Zajęcia</Link></li>
        <li><Link to="/memberships">Członkostwa</Link></li>
        <li><Link to="/trainers">Trenerzy</Link></li>
        {user ? (
          <>
            <li><Link to="/dashboard">Panel użytkownika</Link></li>
            <li><button onClick={handleLogout}>Wyloguj</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Zaloguj</Link></li>
            <li><Link to="/register">Rejestracja</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
