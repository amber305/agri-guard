/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', { 
    user, 
    loading, 
    requireAdmin, 
    userRole: user?.role,
    isAdmin: user?.role === 'admin'
  });

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    console.log('User is not admin, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;