// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import logo from '../images/logo.png';
import '../styles/App.css';

function Home() {
  return (
    <div className="home-container">
      <div className="home-content">


        <h1 className="home-title">Witaj w GymManagement!</h1>
        <p className="home-subtitle">
          Platforma do zarządzania siłownią i zajęciami grupowymi
        </p>

        <div className="home-buttons">
          <Link to="/classes" className="btn-green">
            Sprawdź Zajęcia
          </Link>
          <div className="home-logo">
            <img src={logo} alt="logo" />

          </div>
          <Link to="/memberships" className="btn-green">
            Zobacz Plany Członkostw
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
