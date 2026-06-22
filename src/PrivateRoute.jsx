import { Navigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="text-center p-8 text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  // If roles are specified, check them (e.g., roles={['admin', 'instructor']})
  if (roles && !roles.some(role => user.roles?.includes(role))) {
    return <Navigate to="/dashboard" />; // Kick non-admins back to dashboard
  }
  
  return children;
}

export default PrivateRoute;