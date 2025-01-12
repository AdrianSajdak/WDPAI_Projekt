// src/components/Dashboard.js

import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/App.css';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Panel użytkownika</h2>
      {user ? (
        <>
          <p>Witaj, {user.username || user.email}!</p>
          <ul>
            <li><Link to="/memberships/my">Moje członkostwa</Link></li>
            <li><Link to="/classes">Zajęcia grupowe</Link></li>
          </ul>
        </>
      ) : (
        <p>Nie jesteś zalogowany.</p>
      )}
    </div>
  );
}

export default Dashboard;
