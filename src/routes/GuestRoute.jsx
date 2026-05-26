import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthSpinner } from '../components/AuthSpinner';

export const GuestRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <AuthSpinner label="Loading..." />;

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
