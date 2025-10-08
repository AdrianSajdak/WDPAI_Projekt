import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import logo from '../../images/logo.png';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? 'navbar__link active' : 'navbar__link';

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" aria-label="GymManagement home">
          <img src={logo} alt="GymManagement" />
          <span>GymManagement</span>
        </Link>

        <div className="navbar__menu" role="navigation" aria-label="Primary">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          {user && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
          {user && !user.is_trainer && !user.is_superuser && (
            <NavLink to="/membership-plans" className={navLinkClass}>
              Memberships
            </NavLink>
          )}
          {(user?.is_trainer || user?.is_superuser) && (
            <NavLink to="/trainer-panel" className={navLinkClass}>
              Trainer Panel
            </NavLink>
          )}
          {user?.is_superuser && (
            <NavLink to="/admin-panel" className={navLinkClass}>
              Admin Panel
            </NavLink>
          )}
        </div>

        <div className="navbar__actions">
          {user ? (
            <button type="button" className="btn-surface" onClick={handleLogout}>
              Log out
            </button>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost">
                Log in
              </NavLink>
              <NavLink to="/register" className="btn-primary">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
