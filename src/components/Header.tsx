import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mountain, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Mountain className="h-8 w-8" />
            <span className="text-xl font-bold">NatureTrails</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-green-200 transition-colors font-medium">
              Home
            </Link>
            <Link to="/packages" className="hover:text-green-200 transition-colors font-medium">
              Packages
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 hover:text-green-200 transition-colors">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-full text-sm font-medium transition-colors">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 hover:text-green-200 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-white text-green-700 hover:bg-green-50 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-green-600 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 px-4 hover:bg-green-600 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              to="/packages"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 px-4 hover:bg-green-600 rounded-lg transition-colors"
            >
              Packages
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 py-2 px-4 hover:bg-green-600 rounded-lg transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 w-full text-left py-2 px-4 hover:bg-green-600 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 px-4 bg-white text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;