import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('edugrade_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('edugrade_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Decode token to get roles instantly
      const decoded = jwtDecode(token);

      // Fetch full profile from backend
      const response = await apiClient.get('/auth/me');

      // Merge backend data with token roles
      setUser({
        ...response.data,
        roles: decoded.roles || []
      });
    } catch (error) {
      localStorage.removeItem('edugrade_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (token) => {
    localStorage.setItem('edugrade_token', token);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('edugrade_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};