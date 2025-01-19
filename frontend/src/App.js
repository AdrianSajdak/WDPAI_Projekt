import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Route guards
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';
import TrainerRoute from './routes/TrainerRoute';

// Pages & panels
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import TrainerPanel from './components/TrainerPanel';
import AllClasses from './components/Classes/AllClasses';  
import MyClasses from './components/Classes/MyClasses';    
import MembershipPlans from './components/Memberships/MembershipPlans';

function App() {
  return (
    <div id="root">
      <Navbar />
      {/* main-content ensures the footer is pushed down */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-classes"
            element={
              <PrivateRoute>
                <MyClasses />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-classes"
            element={
              <PrivateRoute>
                <AllClasses />
              </PrivateRoute>
            }
          />

          {/* Admin route */}
          <Route
            path="/admin-panel"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* Trainer route */}
          <Route
            path="/trainer-panel"
            element={
              <TrainerRoute>
                <TrainerPanel />
              </TrainerRoute>
            }
          />


          <Route
            path="/membership-plans"
            element={
              <PrivateRoute>
                <MembershipPlans />
              </PrivateRoute>
            }
          />

        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
