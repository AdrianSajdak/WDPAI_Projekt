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
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/dashboard">User Panel</Link>
            </li>
            {user.is_superuser && (
              <li>
                <Link to="/admin-panel">Admin Panel</Link>
              </li>
            )}
            {(user.is_trainer || user.is_superuser) && (
              <li>
                <Link to="/trainer-panel">Trainer Panel</Link>
              </li>
            )}
            {user && !user.is_trainer && !user.is_superuser && (
              <li>
                <Link to="/membership-plans">Memberships</Link>
              </li>
            )}

            <li>
              <button onClick={handleLogout}>Log out</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Log in</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
