// src/components/Layout/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import '../../styles/App.css';
import '../../styles/Home.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className='navbar'>
      <ul>
        <li><Link to="/">Strona główna</Link></li>
        {user ? (
          <>
            <li><Link to="/dashboard">Panel użytkownika</Link></li>
            {user.is_superuser && (
              <li><Link to="/admin-panel">Panel admina</Link></li>
            )}
            {(user.is_trainer || user.is_superuser) && (
              <li><Link to="/trainer-panel">Panel trenera</Link></li>
            )}
            <li><button onClick={logout}>Wyloguj</button></li>
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
