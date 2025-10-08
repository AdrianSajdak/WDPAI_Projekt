import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
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

const GOOGLE_CLIENT_ID = '666492394731-iq3kv2qhapqrcl1sd9cn3tier6rggmcd.apps.googleusercontent.com';

function App() {
  return (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

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

          <Route
            path="/admin-panel"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

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
      </main>
      <Footer />
    </div>
  </GoogleOAuthProvider>
  );
}

export default App;
