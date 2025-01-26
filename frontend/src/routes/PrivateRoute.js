import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // np. spinner
    return <p>Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
}
