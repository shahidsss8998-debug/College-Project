import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-primary">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // If user is logged in but role doesn't match, redirect based on their actual role
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />;
  }

  return children;
};

export default ProtectedRoute;
