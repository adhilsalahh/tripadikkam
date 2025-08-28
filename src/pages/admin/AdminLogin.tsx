import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, Mail, Lock, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../contexts/AdminContext';

const AdminLogin: React.FC = () => {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);

  const { login, signup, checkFirstTimeSetup, admin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    checkSetupStatus();
  }, []);

  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  const checkSetupStatus = async () => {
    try {
      const isFirstTime = await checkFirstTimeSetup();
      setIsSignupMode(isFirstTime);
    } catch (error) {
      console.error('Setup check error:', error);
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignupMode) {
        const result = await signup(email, password, whatsapp);
        if (result.success) {
          navigate('/admin/dashboard');
        } else {
          setError(result.error || 'Signup failed');
        }
      } else {
        const result = await login(email, password);
        if (result.success) {
          navigate('/admin/dashboard');
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="flex justify-center">
              <Mountain className="h-12 w-12 text-emerald-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isSignupMode ? 'Setup Admin Account' : 'Admin Login'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignupMode 
                ? 'Create the first admin account for Kerala Treks'
                : 'Access the admin dashboard'
              }
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Password"
                  />
                </div>
              </div>

              {isSignupMode && (
                <div>
                  <label htmlFor="whatsapp" className="sr-only">
                    WhatsApp Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserPlus className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="WhatsApp Number (Optional)"
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    {isSignupMode ? (
                      <>
                        <UserPlus className="h-5 w-5 mr-2" />
                        Create Admin Account
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;