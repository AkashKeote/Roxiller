import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Store, Star, TrendingUp, Activity, 
  Plus, Settings, BarChart3, ArrowRight, 
  UserCheck, Shield, LogOut, Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    statistics: {
      totalUsers: 0,
      totalStores: 0,
      totalRatings: 0,
      userGrowth: 0,
      storeGrowth: 0
    },
    analytics: {
      ratingDistribution: [],
      topStores: [],
      systemHealth: { user_health: 'good', store_health: 'good', rating_health: 'good' }
    },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };



  const getQuickActionCards = () => [
    {
      title: 'Manage Users',
      description: 'Add, edit, and manage user accounts',
      icon: Users,
      link: '/admin/users',
      color: '#B5C7F7',
      count: stats.statistics?.totalUsers || 0
    },
    {
      title: 'Manage Stores',
      description: 'Add, edit, and manage store listings',
      icon: Store,
      link: '/admin/stores',
      color: '#F9E79F',
      count: stats.statistics?.totalStores || 0
    },
    {
      title: 'System Settings',
      description: 'Configure system parameters and preferences',
      icon: Settings,
      link: '/admin/settings',
      color: '#E8D5C4',
      count: null
    },
    {
      title: 'Analytics',
      description: 'View detailed system analytics and reports',
      icon: BarChart3,
      link: '/admin/analytics',
      color: '#D6EAF8',
      count: null
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-[#22223B] font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-15 h-15 bg-[#E8D5C4] rounded-2xl shadow-lg shadow-[#E8D5C4]/30 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#22223B]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#22223B] mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-[#22223B]/70 text-lg">
                  Hello, {user?.name || 'Admin'}! Here's your system overview.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="w-12 h-12 bg-[#B5C7F7] rounded-2xl shadow-lg shadow-[#B5C7F7]/30 flex items-center justify-center hover:bg-[#9BB3F5] transition-all duration-300"
              >
                <LogOut className="w-6 h-6 text-[#22223B]" />
              </button>
              <Link
                to="/"
                className="w-12 h-12 bg-[#F9E79F] rounded-2xl shadow-lg shadow-[#F9E79F]/30 flex items-center justify-center hover:bg-[#F5D17F] transition-all duration-300"
              >
                <Home className="w-6 h-6 text-[#22223B]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#B5C7F7] rounded-2xl shadow-lg shadow-[#B5C7F7]/30 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.statistics?.totalUsers?.toLocaleString() || '0'}
            </h3>
            <p className="text-[#22223B]/70">Total Users</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+{stats.statistics?.userGrowth || 0} this month</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#F9E79F] rounded-2xl shadow-lg shadow-[#F9E79F]/30 flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.statistics?.totalStores?.toLocaleString() || '0'}
            </h3>
            <p className="text-[#22223B]/70">Total Stores</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+{stats.statistics?.storeGrowth || 0} this month</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#D6EAF8] rounded-2xl shadow-lg shadow-[#D6EAF8]/30 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.statistics?.totalRatings?.toLocaleString() || '0'}
            </h3>
            <p className="text-[#22223B]/70">Total Ratings</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+15% this month</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#E8D5C4] rounded-2xl shadow-lg shadow-[#E8D5C4]/30 flex items-center justify-center">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.recentActivity?.length || 0}
            </h3>
            <p className="text-[#22223B]/70">Recent Activities</p>
            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
              <Activity className="w-3 h-3" />
              <span>Live updates</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-[#22223B] mb-6">Admin Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getQuickActionCards().map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: action.color }}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#22223B] group-hover:text-[#B5C7F7] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-[#22223B]/70 text-sm">{action.description}</p>
                    {action.count !== null && (
                      <p className="text-[#B5C7F7] font-semibold text-sm mt-1">
                        {action.count.toLocaleString()} total
                      </p>
                    )}
                  </div>
                  <div className="text-[#B5C7F7] group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-slide-up">
          {/* System Health */}
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50">
            <div className="p-6 border-b border-[#B5C7F7]/20">
              <h3 className="text-xl font-semibold text-[#22223B]">System Health</h3>
              <p className="text-[#22223B]/70 text-sm">Current system status and performance</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-green-600" />
                    <span className="text-[#22223B]">User Management</span>
                  </div>
                  <span className="badge bg-green-100 text-green-800">Operational</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <Store className="w-5 h-5 text-green-600" />
                    <span className="text-[#22223B]">Store Management</span>
                  </div>
                  <span className="badge bg-green-100 text-green-800">Operational</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-green-600" />
                    <span className="text-[#22223B]">Rating System</span>
                  </div>
                  <span className="badge bg-green-100 text-green-800">Operational</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span className="text-[#22223B]">Database</span>
                  </div>
                  <span className="badge bg-blue-100 text-blue-800">Healthy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent System Activity */}
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50">
            <div className="p-6 border-b border-[#B5C7F7]/20">
              <h3 className="text-xl font-semibold text-[#22223B]">Recent System Activity</h3>
              <p className="text-[#22223B]/70 text-sm">Latest system events and updates</p>
            </div>
            
            <div className="p-6">
              {stats.recentActivity && stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 py-3 border-b border-[#B5C7F7]/20 last:border-b-0">
                      <div className="w-10 h-10 bg-[#B5C7F7]/20 rounded-2xl flex items-center justify-center">
                        <Activity className="w-5 h-5 text-[#B5C7F7]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-[#22223B]">{activity.description}</p>
                        <p className="text-xs text-[#22223B]/60">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#22223B] mb-2">No recent activity</h3>
                  <p className="text-[#22223B]/70">System activity will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8 animate-slide-up">
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50">
            <div className="p-6 border-b border-[#B5C7F7]/20">
              <h3 className="text-xl font-semibold text-[#22223B]">Performance Metrics</h3>
              <p className="text-[#22223B]/70 text-sm">Key performance indicators and trends</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[#B5C7F7]/10 rounded-2xl">
                  <div className="w-12 h-12 bg-[#B5C7F7] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#22223B] mb-1">User Growth</h4>
                  <p className="text-2xl font-bold text-[#B5C7F7]">+{stats.statistics?.userGrowth || 0}</p>
                  <p className="text-xs text-[#22223B]/60">vs last month</p>
                </div>
                
                <div className="text-center p-4 bg-[#F9E79F]/10 rounded-2xl">
                  <div className="w-12 h-12 bg-[#F9E79F] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#22223B] mb-1">Store Growth</h4>
                  <p className="text-2xl font-bold text-[#F9E79F]">+{stats.statistics?.storeGrowth || 0}</p>
                  <p className="text-xs text-[#22223B]/60">vs last month</p>
                </div>
                
                <div className="text-center p-4 bg-[#E8D5C4]/10 rounded-2xl">
                  <div className="w-12 h-12 bg-[#E8D5C4] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-[#22223B] mb-1">Rating Growth</h4>
                  <p className="text-2xl font-bold text-[#E8D5C4]">+15%</p>
                  <p className="text-xs text-[#22223B]/60">vs last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Section */}
        <div className="animate-slide-up">
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-8 text-center">
            <div className="w-16 h-16 bg-[#B5C7F7] rounded-2xl shadow-lg shadow-[#B5C7F7]/30 mx-auto mb-4 flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-[#22223B] mb-3">
              Need to Add Something?
            </h3>
            <p className="text-[#22223B]/70 text-lg mb-6">
              Quickly add new users, stores, or manage existing ones from the admin panel.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/admin/users" className="bg-[#B5C7F7] hover:bg-[#9BB3F5] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-[#B5C7F7]/30 hover:shadow-xl inline-flex items-center gap-2">
                <Users className="w-5 h-5" />
                Add New User
              </Link>
              <Link to="/admin/stores" className="bg-[#F9E79F] hover:bg-[#F5D17F] text-[#22223B] font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-[#F9E79F]/30 hover:shadow-xl inline-flex items-center gap-2">
                <Store className="w-5 h-5" />
                Add New Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
