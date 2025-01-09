// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Witaj w GymManagement!</h1>
      <p>Platforma do zarządzania siłownią i zajęciami grupowymi.</p>
      <Link to="/classes">Sprawdź zajęcia</Link> | <Link to="/memberships">Zobacz plany członkostw</Link>
    </div>
  );
}

export default Home;
