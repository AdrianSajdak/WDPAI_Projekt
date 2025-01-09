// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import ClassesList from './components/Classes/ClassesList';
import ClassDetails from './components/Classes/ClassDetails';
import MembershipPlans from './components/Memberships/MembershipPlans';
import MyMemberships from './components/Memberships/MyMemberships';
import TrainersList from './components/Trainers/TrainersList';

function App() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/classes" element={<ClassesList />} />
          <Route path="/classes/:id" element={<ClassDetails />} />

          <Route path="/memberships" element={<MembershipPlans />} />
          <Route path="/memberships/my" element={<MyMemberships />} />

          <Route path="/trainers" element={<TrainersList />} />

          {/* ...inne trasy */}
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
