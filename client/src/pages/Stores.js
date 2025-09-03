import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, ShoppingBag, TrendingUp, Plus, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

// Debug import
console.log('Plus icon imported:', typeof Plus);

const Stores = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStores();
  }, [searchTerm, sortBy, sortOrder, currentPage]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await axios.get(`/api/stores?${params}`);
      setStores(response.data.stores);
      setTotalPages(Math.ceil(response.data.total / 12));
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? 'star-filled' : 'star-empty'
          }`}
        />
      );
    }
    return stars;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-dark-400 font-medium">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="icon-container mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Discover Amazing Stores</h1>
            <p className="text-dark-300 text-lg">
              Find and rate stores in your area. Share your experiences with the community.
            </p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="card p-6 mb-8 animate-slide-up">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search stores by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
              
              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="input-field w-auto min-w-[120px]"
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="created_at">Date Added</option>
                </select>
                
                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="btn-outline px-4 py-3 min-w-[60px]"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
                
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Pallet Chips - Store Categories */}
        <div className="mb-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-dark-400 mb-4">Store Categories</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'All Stores', color: 'bg-blue-100 text-blue-800 border-blue-200', active: true },
              { label: 'Grocery', color: 'bg-green-100 text-green-800 border-green-200', active: false },
              { label: 'Electronics', color: 'bg-purple-100 text-purple-800 border-purple-200', active: false },
              { label: 'Fashion', color: 'bg-pink-100 text-pink-800 border-pink-200', active: false },
              { label: 'Restaurants', color: 'bg-orange-100 text-orange-800 border-orange-200', active: false },
              { label: 'Healthcare', color: 'bg-red-100 text-red-800 border-red-200', active: false }
            ].map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-300 hover:scale-105 ${
                  category.active 
                    ? `${category.color} shadow-md` 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pallet Chips - Rating Filters */}
        <div className="mb-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-dark-400 mb-4">Rating Filters</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'All Ratings', stars: '⭐', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', active: true },
              { label: '5 Stars', stars: '⭐⭐⭐⭐⭐', color: 'bg-green-100 text-green-800 border-green-200', active: false },
              { label: '4+ Stars', stars: '⭐⭐⭐⭐', color: 'bg-blue-100 text-blue-800 border-blue-200', active: false },
              { label: '3+ Stars', stars: '⭐⭐⭐', color: 'bg-orange-100 text-orange-800 border-orange-200', active: false },
              { label: 'Top Rated', stars: '🏆', color: 'bg-purple-100 text-purple-800 border-purple-200', active: false }
            ].map((filter, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full border-2 transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  filter.active 
                    ? `${filter.color} shadow-md` 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm">{filter.stars}</span>
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stores as Pallet Chips */}
        {stores.length === 0 ? (
          <div className="card text-center py-16 animate-slide-up">
            <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-dark-400 mb-3">No stores found</h3>
            <p className="text-dark-300 text-lg mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No stores have been added yet'}
            </p>
            {!searchTerm && user?.role === 'system_admin' && (
              <Link to="/admin/stores" className="btn-primary inline-flex items-center gap-2">
                {Plus ? <Plus className="w-5 h-5" /> : <span>+</span>}
                Add First Store
              </Link>
            )}
          </div>
        ) : (
          <div className="mb-8 animate-slide-up">
            <h3 className="text-lg font-semibold text-dark-400 mb-4">Available Stores</h3>
            <div className="flex flex-wrap gap-3">
              {stores.map((store) => (
                <Link
                  key={store.id}
                  to={`/stores/${store.id}`}
                  className={`px-4 py-3 rounded-full border-2 transition-all duration-300 hover:scale-105 flex items-center gap-3 cursor-pointer group ${
                    (parseFloat(store.average_rating) || 0) >= 4.5 
                      ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200' 
                      : (parseFloat(store.average_rating) || 0) >= 3.5 
                      ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                      : (parseFloat(store.average_rating) || 0) >= 2.5
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                      : 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
                  }`}
                >
                  {/* Store Icon */}
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                    <Store className="w-4 h-4 text-current" />
                  </div>
                  
                  {/* Store Info */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{store.name}</span>
                    <div className="flex items-center gap-1">
                      {getRatingStars(store.average_rating || 0)}
                      <span className="text-xs opacity-75">({store.total_ratings || 0})</span>
                    </div>
                  </div>
                  
                  {/* Rating Badge */}
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    (parseFloat(store.average_rating) || 0) >= 4.5 
                      ? 'bg-green-200 text-green-900' 
                      : (parseFloat(store.average_rating) || 0) >= 3.5 
                      ? 'bg-blue-200 text-blue-900'
                      : (parseFloat(store.average_rating) || 0) >= 2.5
                      ? 'bg-yellow-200 text-yellow-900'
                      : 'bg-red-200 text-red-900'
                  }`}>
                    {(parseFloat(store.average_rating) || 0).toFixed(1)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center animate-slide-up">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-primary-400 text-white border-primary-400 shadow-medium'
                      : 'border-primary-200 text-dark-400 hover:border-primary-300 hover:bg-primary-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Call to Action */}
        {user?.role === 'normal_user' && stores.length > 0 && (
          <div className="card p-8 text-center mt-12 animate-slide-up">
            <div className="icon-container mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-dark-400 mb-3">
              Ready to Share Your Experience?
            </h3>
            <p className="text-dark-300 text-lg mb-6">
              Rate the stores you've visited and help others make informed decisions.
            </p>
            <Link to="/stores" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Start Rating Stores
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stores;

