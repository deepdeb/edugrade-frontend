import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { Eye, EyeOff } from 'lucide-react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/auth/register', { email, password });
      
      // Auto-login after register
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      const loginRes = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      await login(loginRes.data.access_token); // THE CRITICAL FIX
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Branding (Dark Theme) */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 text-white flex-col justify-center px-16">
        <Logo />
        <div className="mt-8">
          <h5 className="text-sm tracking-widest text-yellow-500 font-medium mb-4">JOIN EDUGRADE</h5>
          <h2 className="text-4xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-gray-400 leading-relaxed max-w-md">
            Create a free account to unlock AI-driven courses and join a community of lifelong learners.
          </p>
        </div>
      </div>

      {/* Right Side - Form (Light Theme) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile only Logo */}
          <div className="lg:hidden mb-8 inline-block bg-gray-900 px-4 py-2 rounded-lg">
            <Logo />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h3>
          <p className="text-gray-500 mb-8">Fill in the details to get started</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition bg-white"
                placeholder="you@example.com" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  minLength="8" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition bg-white pr-12"
                  placeholder="Min. 8 characters" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              title={loading ? 'Creating Account...' : 'Create Account'} 
              disabled={loading} 
              className="w-full" 
            />
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-600 hover:text-yellow-700 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;