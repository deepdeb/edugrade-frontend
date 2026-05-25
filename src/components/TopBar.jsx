import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import Logo from './Logo';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="px-6 lg:px-16 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              /* --- Logged In State --- */
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="hover:text-yellow-400 transition-colors font-medium">Dashboard</Link>
                <Link to="/courses" className="hover:text-yellow-400 transition-colors font-medium">My Courses</Link>
                
                {/* User Profile & Logout */}
                <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
                  <span className="text-sm text-gray-400">{user.email}</span>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              /* --- Logged Out State --- */
              <div className="flex items-center gap-4">
                <Link to="/login" className="font-medium hover:text-yellow-400 transition-colors">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4 space-y-3">
            {user ? (
              <>
                <Link to="/dashboard" className="block hover:text-yellow-400 transition" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-yellow-400 transition" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block hover:text-yellow-400 transition" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopBar;