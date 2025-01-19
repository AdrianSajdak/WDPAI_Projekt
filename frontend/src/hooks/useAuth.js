import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useAuth() {
  const {
    user,
    accessToken,
    login,
    logout,
    googleLogin,
    loading,
    error,
  } = useContext(AuthContext);

  // Convenient boolean getters
  const isAuthenticated = !!user;
  const isAdmin = !!(user && user.is_superuser);
  const isTrainer = !!(user && user.is_trainer);

  return {
    user,
    accessToken,
    login,
    logout,
    googleLogin,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isTrainer,
  };
}
