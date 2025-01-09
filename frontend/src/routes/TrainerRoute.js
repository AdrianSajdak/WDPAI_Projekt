import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function TrainerRoute({ children }) {
  const { user } = useAuth();
  if (!user || (!user.is_trainer && !user.is_superuser)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
