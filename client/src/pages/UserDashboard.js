import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, Users, Star, TrendingUp, 
  BarChart3, ArrowRight, 
  Leaf, LogOut, Home,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';


const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [stats] = useState({
    totalStores: 89,
    totalRatings: 156,
    ratingStreak: 7,
    ratingScore: 85
  });
  const [recentStores, setRecentStores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecentStores();
  }, [fetchRecentStores]);

  const fetchRecentStores = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stores?limit=6');
      setRecentStores(response.data.stores || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };




      reward: 'Explorer Badge',
      color: '#FF9800'
    }
  ];

  const getRecentActivity = () => [
    {
      type: 'rating',
      store: 'GreenMart',
      action: 'Rated 5 stars',
      time: '2 hours ago',
      icon: Star,
      color: '#F9E79F'
    },
    {
      type: 'visit',
      store: 'EcoShop',
      action: 'Visited store',
      time: '1 day ago',
      icon: Store,
      color: '#B5C7F7'
    },
    {
      type: 'challenge',
      store: 'Rating Challenge',
      action: 'Completed challenge',
      time: '3 days ago',
      icon: Leaf,
      color: '#4CAF50'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-15 h-15 bg-[#F9E79F] rounded-2xl shadow-lg shadow-[#F9E79F]/30 flex items-center justify-center">
                <Users className="w-8 h-8 text-[#22223B]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#22223B] mb-2">
                  Customer Dashboard
                </h1>
                <p className="text-[#22223B]/70 text-lg">
                  Hello, {user?.name || 'Customer'}! Here's your eco journey overview.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-12 h-12 bg-[#B5C7F7] rounded-2xl shadow-lg shadow-[#B5C7F7]/30 flex items-center justify-center hover:bg-[#9BB3F5] transition-all duration-300">
                <Bell className="w-6 h-6 text-[#22223B]" />
              </button>
              <button
                onClick={handleLogout}
                className="w-12 h-12 bg-[#F9E79F] rounded-2xl shadow-lg shadow-[#F9E79F]/30 flex items-center justify-center hover:bg-[#F5D17F] transition-all duration-300"
              >
                <LogOut className="w-6 h-6 text-[#22223B]" />
              </button>
              <Link
                to="/"
                className="w-12 h-12 bg-[#E8D5C4] rounded-2xl shadow-lg shadow-[#E8D5C4]/30 flex items-center justify-center hover:bg-[#D6C7B8] transition-all duration-300"
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
              {stats.totalStores}
            </h3>
            <p className="text-[#22223B]/70">Stores Visited</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#F9E79F] rounded-2xl shadow-lg shadow-[#F9E79F]/30 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.totalRatings}
            </h3>
            <p className="text-[#22223B]/70">Ratings Given</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#D6EAF8] rounded-2xl shadow-lg shadow-[#D6EAF8]/30 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.ratingStreak} days
            </h3>
            <p className="text-[#22223B]/70">Rating Streak</p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-[#E8D5C4] rounded-2xl shadow-lg shadow-[#E8D5C4]/30 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#22223B] mb-1">
              {stats.ratingScore}%
            </h3>
            <p className="text-[#22223B]/70">Rating Score</p>
          </div>
        </div>

        {/* Quick Actions - Pallet Chips */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-[#22223B] mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Rate Stores', icon: '⭐', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', link: '/stores' },
              { label: 'View Ratings', icon: '📊', color: 'bg-blue-100 text-blue-800 border-blue-200', link: '/ratings' },
              { label: 'Find Stores', icon: '🔍', color: 'bg-green-100 text-green-800 border-green-200', link: '/stores' },
              { label: 'My Profile', icon: '👤', color: 'bg-purple-100 text-purple-800 border-purple-200', link: '/profile' },
              { label: 'Store Map', icon: '🗺️', color: 'bg-orange-100 text-orange-800 border-orange-200', link: '/stores' },
              { label: 'Notifications', icon: '🔔', color: 'bg-pink-100 text-pink-800 border-pink-200', link: '/notifications' }
            ].map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-300 hover:scale-105 flex items-center gap-2 ${action.color} hover:shadow-md`}
              >
                <span className="text-sm">{action.icon}</span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Rating Challenges - Pallet Chips */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-2xl font-bold text-[#22223B] mb-6">Rating Challenges</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { 
                label: 'Rate 5 Stores', 
                progress: '3/5', 
                reward: 'Rating Warrior Badge',
                color: 'bg-green-100 text-green-800 border-green-200',
                progressColor: 'bg-green-500'
              },
              { 
                label: 'Rate 10 Stores', 
                progress: '7/10', 
                reward: 'Rating Expert Badge',
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                progressColor: 'bg-blue-500'
              },
              { 
                label: 'Visit 10 Stores', 
                progress: '7/10', 
                reward: 'Explorer Badge',
                color: 'bg-orange-100 text-orange-800 border-orange-200',
                progressColor: 'bg-orange-500'
              },
              { 
                label: 'Rate 20 Stores', 
                progress: '15/20', 
                reward: 'Rating Master Badge',
                color: 'bg-purple-100 text-purple-800 border-purple-200',
                progressColor: 'bg-purple-500'
              },
              { 
                label: 'Perfect Ratings', 
                progress: '8/10', 
                reward: 'Perfect Score Badge',
                color: 'bg-pink-100 text-pink-800 border-pink-200',
                progressColor: 'bg-pink-500'
              }
            ].map((challenge, index) => (
              <div
                key={index}
                className={`px-4 py-3 rounded-full border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${challenge.color} hover:shadow-md`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{challenge.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs opacity-75">{challenge.reward}</span>
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${challenge.progressColor}`}
                          style={{ 
                            width: `${(parseInt(challenge.progress.split('/')[0]) / parseInt(challenge.progress.split('/')[1])) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{challenge.progress}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Store Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-slide-up">
          {/* Recent Activity */}
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50">
            <div className="p-6 border-b border-[#B5C7F7]/20">
              <h3 className="text-xl font-semibold text-[#22223B]">Recent Activity</h3>
              <p className="text-[#22223B]/70 text-sm">Your latest rating actions</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {getRecentActivity().map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 py-3 border-b border-[#B5C7F7]/20 last:border-b-0">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: activity.color }}>
                      <activity.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#22223B] font-medium">{activity.store}</p>
                      <p className="text-xs text-[#22223B]/60">{activity.action}</p>
                    </div>
                    <span className="text-xs text-[#22223B]/50">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Store Recommendations */}
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50">
            <div className="p-6 border-b border-[#B5C7F7]/20">
              <h3 className="text-xl font-semibold text-[#22223B]">Recommended Stores</h3>
              <p className="text-[#22223B]/70 text-sm">Stores you might like</p>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="spinner w-8 h-8 mx-auto mb-4"></div>
                  <p className="text-[#22223B]/70">Loading recommendations...</p>
                </div>
              ) : recentStores.length > 0 ? (
                <div className="space-y-4">
                  {recentStores.slice(0, 3).map((store, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-[#F7F6F2] rounded-2xl">
                      <div className="w-12 h-12 bg-[#B5C7F7] rounded-2xl flex items-center justify-center">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-[#22223B]">{store.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const rating = typeof store.average_rating === 'number' ? store.average_rating : parseFloat(store.average_rating) || 0;
                              return (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= rating ? 'text-[#F9E79F] fill-current' : 'text-gray-300'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <span className="text-xs text-[#22223B]/60">
                            {(typeof store.average_rating === 'number' ? store.average_rating : parseFloat(store.average_rating) || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/stores/${store.id}`}
                        className="w-8 h-8 bg-[#F9E79F] rounded-full flex items-center justify-center hover:bg-[#F5D17F] transition-all duration-300"
                      >
                        <ArrowRight className="w-4 h-4 text-[#22223B]" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-[#22223B] mb-2">No stores found</h3>
                  <p className="text-[#22223B]/70">Start exploring stores!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="animate-slide-up">
          <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-8 text-center">
            <div className="w-16 h-16 bg-[#4CAF50] rounded-2xl shadow-lg shadow-[#4CAF50]/30 mx-auto mb-4 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-[#22223B] mb-3">
              Ready to Make a Difference?
            </h3>
            <p className="text-[#22223B]/70 text-lg mb-6">
              Rate stores and participate in challenges to earn badges and improve the platform!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/stores" className="bg-[#4CAF50] hover:bg-[#45A049] text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-[#4CAF50]/30 hover:shadow-xl inline-flex items-center gap-2">
                <Store className="w-5 h-5" />
                Explore Stores
              </Link>
              <Link to="/challenges" className="bg-[#F9E79F] hover:bg-[#F5D17F] text-[#22223B] font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-[#F9E79F]/30 hover:shadow-xl inline-flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                View Challenges
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
