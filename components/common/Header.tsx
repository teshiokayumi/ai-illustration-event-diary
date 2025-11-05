
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-surface shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-on-surface hover:text-primary transition-colors">
          AI Event Diary
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="text-on-surface-secondary hover:text-on-surface transition-colors">
            All Events
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-on-surface-secondary hover:text-on-surface transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Login / Register
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
