import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import Logo from './Logo';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Gives us the current URL path
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper function to apply active class
  const isActive = (path) => location.pathname === path ? 'text-yellow-400' : '';

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="px-6 lg:px-16 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="block">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              /* --- Logged In State --- */
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className={`hover:text-yellow-400 transition-colors font-medium ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
                <Link to="/courses" className={`hover:text-yellow-400 transition-colors font-medium ${isActive('/courses')}`}>
                  My Courses
                </Link>
                {user?.roles?.includes('admin') && (
                  <Link to="/studio" className={`hover:text-yellow-400 transition-colors font-medium ${isActive('/studio')}`}>
                    Studio
                  </Link>
                )}

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
              <>
                {/* Hide links completely if we are on the Landing Page */}
                {location.pathname !== '/' && (
                  <div className="flex items-center gap-6">
                    <Link
                      to="/login"
                      className={`font-medium hover:text-yellow-400 transition-colors ${isActive('/login')}`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`font-medium hover:text-yellow-400 transition-colors ${isActive('/register')}`}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
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
                <Link to="/dashboard" className={`block transition ${isActive('/dashboard')}`} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <Link to="/courses" className={`block transition ${isActive('/courses')}`} onClick={() => setMobileMenuOpen(false)}>My Courses</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              /* Hide mobile links on Landing Page too */
              location.pathname !== '/' && (
                <>
                  <Link to="/login" className={`block transition ${isActive('/login')}`} onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className={`block transition ${isActive('/register')}`} onClick={() => setMobileMenuOpen(false)}>Register</Link>
                </>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopBar;