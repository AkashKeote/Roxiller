import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Store, Star, User, LogOut, Home, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    const baseLinks = [
      { to: '/stores', label: 'Stores', icon: ShoppingBag },
      { to: '/profile', label: 'Profile', icon: User },
    ];

    if (user?.role === 'system_admin') {
      baseLinks.unshift({ to: '/admin', label: 'Dashboard', icon: Home });
      baseLinks.push(
        { to: '/admin/users', label: 'Users', icon: User },
        { to: '/admin/stores', label: 'Manage Stores', icon: Store }
      );
    } else if (user?.role === 'store_owner') {
      baseLinks.unshift({ to: '/store-owner', label: 'Dashboard', icon: Home });
    } else if (user?.role === 'normal_user') {
      baseLinks.unshift({ to: '/user-dashboard', label: 'Dashboard', icon: Home });
    } else {
      // For unauthenticated users or fallback
      baseLinks.unshift({ to: '/dashboard', label: 'Dashboard', icon: Home });
    }

    return baseLinks;
  };

  const isActiveLink = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const getRoleBadge = () => {
    const roleConfig = {
      system_admin: { color: 'bg-red-100 text-red-800', label: 'Admin' },
      store_owner: { color: 'bg-blue-100 text-blue-800', label: 'Store Owner' },
      normal_user: { color: 'bg-green-100 text-green-800', label: 'User' }
    };

    const config = roleConfig[user?.role] || roleConfig.normal_user;
    return (
      <span className={`badge ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-white/50 shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user?.role === 'system_admin' ? '/admin' : user?.role === 'store_owner' ? '/store-owner' : user?.role === 'normal_user' ? '/user-dashboard' : '/dashboard'} className="flex items-center space-x-3 group">
            <div className="icon-container group-hover:scale-110 transition-transform duration-300">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">Store Ratings</h1>
              <p className="text-xs text-dark-300">Rate & Discover Stores</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {getNavLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${isActiveLink(link.to) ? 'nav-link-active' : ''}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-dark-400">{user?.name}</p>
              {getRoleBadge()}
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-dark-400 hover:text-primary-600 focus:outline-none focus:text-primary-600 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/50 shadow-medium">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* User Info */}
            <div className="px-3 py-2 border-b border-primary-100 mb-3">
              <p className="text-sm font-medium text-dark-400">{user?.name}</p>
              <p className="text-xs text-dark-300">{user?.email}</p>
              <div className="mt-2">{getRoleBadge()}</div>
            </div>

            {/* Navigation Links */}
            {getNavLinks().map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center px-3 py-2 rounded-lg text-base font-medium transition-colors duration-300 ${
                    isActiveLink(link.to)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-dark-400 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}

            {/* Logout Button */}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-300"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
