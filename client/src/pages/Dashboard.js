import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Star, Store, Users, TrendingUp, ShoppingBag, Settings, Activity, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';


const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    totalStores: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping dashboard data fetch');
        return;
      }
      
      const response = await axios.get('/api/users/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Don't show error toast as this component redirects anyway
    } finally {
      setLoading(false);
    }
  };

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case 'system_admin':
        return {
          title: 'Admin Dashboard',
          subtitle: 'System overview and management',
          quickActions: [
            { label: 'Manage Users', icon: Users, link: '/admin/users', color: 'bg-blue-500' },
            { label: 'Manage Stores', icon: Store, link: '/admin/stores', color: 'bg-green-500' },
            { label: 'System Settings', icon: Settings, link: '/admin', color: 'bg-purple-500' }
          ]
        };
      case 'store_owner':
        return {
          title: 'Store Owner Dashboard',
          subtitle: 'Monitor your store performance',
          quickActions: [
            { label: 'Store Analytics', icon: TrendingUp, link: '/store-owner', color: 'bg-blue-500' },
            { label: 'Customer Ratings', icon: Star, link: '/store-owner', color: 'bg-yellow-500' },
            { label: 'Store Settings', icon: Settings, link: '/profile', color: 'bg-purple-500' }
          ]
        };
      default:
        return {
          title: 'Welcome to Store Ratings',
          subtitle: 'Discover and rate amazing stores',
          quickActions: [
            { label: 'Browse Stores', icon: ShoppingBag, link: '/stores', color: 'bg-blue-500' },
            { label: 'My Ratings', icon: Star, link: '/profile', color: 'bg-yellow-500' },
            { label: 'Profile Settings', icon: Settings, link: '/profile', color: 'bg-purple-500' }
          ]
        };
    }
  };

  const getRoleBadge = () => {
    const roleConfig = {
      system_admin: { color: 'bg-red-100 text-red-800', label: 'System Administrator' },
      store_owner: { color: 'bg-blue-100 text-blue-800', label: 'Store Owner' },
      normal_user: { color: 'bg-green-100 text-green-800', label: 'Customer' }
    };

    const config = roleConfig[user?.role] || roleConfig.normal_user;
    return (
      <span className={`badge ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const content = getRoleSpecificContent();

  // Role-based redirection
  if (!loading && user) {
    switch (user.role) {
      case 'system_admin':
        return <Navigate to="/admin" replace />;
      case 'store_owner':
        return <Navigate to="/store-owner" replace />;
      case 'normal_user':
        return <Navigate to="/user-dashboard" replace />;
      default:
        break;
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-dark-400 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">
                {content.title}
              </h1>
              <p className="text-dark-300 text-lg">
                {content.subtitle}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-dark-300">Welcome back,</p>
              <p className="text-lg font-semibold text-dark-400">{user?.name}</p>
              {getRoleBadge()}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <div className="stat-card">
            <div className="flex items-center justify-center mb-4">
              <div className="icon-container">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-dark-400 mb-1">
              {stats.totalRatings || 0}
            </h3>
            <p className="text-dark-300">Total Ratings</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-center mb-4">
              <div className="icon-container">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-dark-400 mb-1">
                                {(parseFloat(stats.averageRating) || 0).toFixed(1)}
            </h3>
            <p className="text-dark-300">Average Rating</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-center mb-4">
              <div className="icon-container">
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-dark-400 mb-1">
              {stats.totalStores || 0}
            </h3>
            <p className="text-dark-300">Total Stores</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-center mb-4">
              <div className="icon-container">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-dark-400 mb-1">
              {stats.recentActivity?.length || 0}
            </h3>
            <p className="text-dark-300">Recent Activities</p>
          </div>
        </div>

        {/* Pallet Chips - Quick Access */}
        <div className="mb-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-dark-400 mb-4">Quick Access</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'View Stores', icon: '🏪', color: 'bg-blue-100 text-blue-800 border-blue-200', link: '/stores' },
              { label: 'My Ratings', icon: '⭐', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', link: '/ratings' },
              { label: 'Add Store', icon: '➕', color: 'bg-green-100 text-green-800 border-green-200', link: '/admin/stores' },
              { label: 'User Management', icon: '👥', color: 'bg-purple-100 text-purple-800 border-purple-200', link: '/admin/users' },
              { label: 'Analytics', icon: '📊', color: 'bg-orange-100 text-orange-800 border-orange-200', link: '/admin/dashboard' }
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  item.color
                } hover:shadow-md`}
              >
                <span className="text-sm">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-dark-400 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card-hover p-6 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-dark-400 group-hover:text-primary-600 transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-dark-300 text-sm">Click to access</p>
                  </div>
                  <div className="text-primary-600 group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8 animate-slide-up">
          <div className="card">
            <div className="p-6 border-b border-primary-100">
              <h2 className="text-2xl font-bold text-dark-400">Recent Activity</h2>
              <p className="text-dark-300">Latest updates and activities</p>
            </div>
            
            <div className="p-6">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 py-3 border-b border-primary-100 last:border-b-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Activity className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-dark-400">{activity.description}</p>
                        <p className="text-xs text-dark-300">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-dark-400 mb-2">No recent activity</h3>
                  <p className="text-dark-300">Activity will appear here as you use the system</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Welcome Message for New Users */}
        {user?.role === 'normal_user' && (
          <div className="card p-6 animate-slide-up">
            <div className="text-center">
              <div className="icon-container mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-dark-400 mb-2">
                Ready to Start Rating?
              </h3>
              <p className="text-dark-300 mb-4">
                Discover amazing stores in your area and share your experiences with others.
              </p>
              <Link to="/stores" className="btn-primary inline-flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Browse Stores
              </Link>
            </div>
          </div>
        )}

        {/* Admin Quick Stats */}
        {user?.role === 'system_admin' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-dark-400 mb-4">System Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Total Users</span>
                  <span className="font-semibold text-dark-400">{stats.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Total Stores</span>
                  <span className="font-semibold text-dark-400">{stats.totalStores || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-300">Total Ratings</span>
                  <span className="font-semibold text-dark-400">{stats.totalRatings || 0}</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-dark-400 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/admin/users" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors">
                  <Plus className="w-5 h-5 text-primary-600" />
                  <span className="text-dark-400">Add New User</span>
                </Link>
                <Link to="/admin/stores" className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors">
                  <Plus className="w-5 h-5 text-primary-600" />
                  <span className="text-dark-400">Add New Store</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
