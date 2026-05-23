import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="text-center p-8 text-gray-500">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
}

export default PrivateRoute