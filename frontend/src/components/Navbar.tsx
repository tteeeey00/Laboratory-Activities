import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PenSquare, LogOut, LogIn, UserPlus, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-white p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
              <PenSquare size={24} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">BlogPlatform</h1>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-white font-medium hidden sm:block">
                  Welcome, {user?.username}!
                </span>
                <Link
                  to="/create-post"
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <PenSquare size={18} className="mr-2" />
                  New Post
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <LogOut size={18} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <LogIn size={18} className="mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <UserPlus size={18} className="mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
