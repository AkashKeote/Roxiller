import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, Star, TrendingUp, 
  Plus, BarChart3, 
  ShoppingCart, Leaf, LogOut, Home, DollarSign
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const StoreOwnerDashboard = () => {
  const { user, logout } = useAuth();
  const [stats] = useState({
    totalProducts: 247,
    ordersToday: 18,
    revenue: 12500,
    storeRating: 4.8
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getQuickActionCards = () => [
    {
      title: 'Add Product',
      description: 'Add new products to your store',
      icon: Plus,
      color: '#F9E79F',
      action: () => toast.success('Add Product feature coming soon!')
    },
    {
      title: 'Manage Stock',
      description: 'Manage your product inventory',
      icon: Store,
      color: '#B5C7F7',
      action: () => toast.success('Manage Stock feature coming soon!')
    },
    {
      title: 'View Orders',
      description: 'Check and manage customer orders',
      icon: ShoppingCart,
      color: '#D6EAF8',
      action: () => toast.success('View Orders feature coming soon!')
    },
    {
      title: 'Add Store',
      description: 'Create a new store location',
      icon: Plus,
      color: '#B5C7F7',
      action: () => toast.success('Add Store feature coming soon!')
    },
    {
      title: 'View Stores',
      description: 'Manage your store locations',
      icon: Store,
      color: '#E8D5C4',
      action: () => toast.success('View Stores feature coming soon!')
    },
    {
      title: 'Store Analytics',
      description: 'View detailed store performance',
      icon: BarChart3,
      color: '#F9E79F',
      action: () => toast.success('Store Analytics feature coming soon!')
    },
    {
      title: 'Product Management',
      description: 'Manage your store products',
      icon: Leaf,
      color: '#E8D5C4',
      action: () => toast.success('Product Management feature coming soon!')
    },
    {
      title: 'Impact Report',
      description: 'View sustainability impact',
      icon: BarChart3,
      color: '#D6EAF8',
      action: () => toast.success('Impact Report feature coming soon!')
    },
    {
      title: 'Improve Score',
      description: 'Tips to improve store rating',
      icon: TrendingUp,
      color: '#F9E79F',
      action: () => toast.success('Improve Score feature coming soon!')
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-15 h-15 bg-[#B5C7F7] rounded-2xl shadow-lg shadow-[#B5C7F7]/30 flex items-center justify-center">
                <Store className="w-8 h-8 text-[#22223B]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#22223B] mb-2">
                  My Store Dashboard
                </h1>
                <p className="text-[#22223B]/70 text-lg">
                  Hello, {user?.name || 'Shopkeeper'}! Here's your store overview.
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

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#B5C7F7] rounded-2xl shadow-lg shadow-[#B5C7F7]/30 flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.totalProducts}
            </h3>
            <p className="text-[#22223B]/70">Total Products</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#F9E79F] rounded-2xl shadow-lg shadow-[#F9E79F]/30 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.ordersToday}
            </h3>
            <p className="text-[#22223B]/70">Orders Today</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#D6EAF8] rounded-2xl shadow-lg shadow-[#D6EAF8]/30 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              ₹{(stats.revenue / 1000).toFixed(1)}K
            </h3>
            <p className="text-[#22223B]/70">Revenue</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#E8D5C4] rounded-2xl shadow-lg shadow-[#E8D5C4]/30 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.storeRating}★
            </h3>
            <p className="text-[#22223B]/70">Store Rating</p>
          </div>
        </div>

        {/* Store Management */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-[#22223B] mb-6">Store Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getQuickActionCards().slice(0, 6).map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: action.color }}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#22223B] mb-2">
                    {action.title}
                  </h3>
                  <p className="text-[#22223B]/70 text-sm">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Store Performance */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-[#22223B] mb-6">Store Performance</h2>
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6">
            <h3 className="text-xl font-semibold text-[#22223B] mb-4">
              This Month's Performance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#B5C7F7] font-medium">Sales Growth: +24%</span>
                <div className="w-24 h-2 bg-[#F7F6F2] rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-[#B5C7F7] rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#22223B] font-medium">Customer Rating: 4.8/5</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= 4 ? 'text-[#F9E79F] fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Section */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-[#22223B] mb-6">Sustainability Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getQuickActionCards().slice(6).map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: action.color }}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#22223B] mb-2">
                    {action.title}
                  </h3>
                  <p className="text-[#22223B]/70 text-sm">
                    {action.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => toast.success('Add Product feature coming soon!')}
            className="w-16 h-16 bg-[#B5C7F7] hover:bg-[#9BB3F5] text-[#22223B] rounded-full shadow-lg shadow-[#B5C7F7]/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          >
            <Plus className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
