import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2 text-xl font-bold">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Argo</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/home" className="hover:text-blue-400 transition">
              Home
            </Link>
            
            {user ? (
              <>
                <Link to="/my-bookings" className="hover:text-blue-400 transition">
                  My Bookings
                </Link>
                <Link to="/profile" className="hover:text-blue-400 transition">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-blue-400 transition">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-sm">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm hover:text-blue-400 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-400 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
                >
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
