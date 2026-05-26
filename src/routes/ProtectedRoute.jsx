import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthSpinner } from '../components/AuthSpinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return <AuthSpinner label="Verifying your session..." />;
  }

  if (!isConfigured) {
    return (
      <div className="auth-loading-screen">
        <p>Firebase is not configured. Add your keys to <code>.env</code> and restart the dev server.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
