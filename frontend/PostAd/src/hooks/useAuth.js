import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const { user } = useContext(AuthContext);
  return {
    isAdmin: user?.role === 'admin',
    isLoggedIn: Boolean(user),
    user,
  };
};
