// AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  // if user is not loaded yet => optionally show spinner
  if (!user) {
    // or check "loading" from useAuth
    return <p>Loading user...</p>;
  }

  // must be is_superuser to see admin panel
  if (!user.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
