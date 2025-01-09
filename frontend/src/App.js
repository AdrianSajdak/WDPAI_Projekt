// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Importy do route guards
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import TrainerRoute from './routes/TrainerRoute';

// Importy paneli
import AdminPanel from './components/AdminPanel';
import TrainerPanel from './components/TrainerPanel';

// Inne importy (Home, Login, Register, Dashboard, itp.)
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Dostęp publiczny do logowania/rejestracji */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Tylko zalogowani */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Panel admina */}
        <Route
          path="/admin-panel"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />

        {/* Panel trenera */}
        <Route
          path="/trainer-panel"
          element={
            <TrainerRoute>
              <TrainerPanel />
            </TrainerRoute>
          }
        />

      </Routes>
      <Footer />
    </div>
  );
}

export default App;
