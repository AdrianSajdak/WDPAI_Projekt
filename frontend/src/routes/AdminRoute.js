import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading user...</p>;
  }

  if (!user.is_superuser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
