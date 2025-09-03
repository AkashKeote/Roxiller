import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter, ShoppingBag, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

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

        {/* Stores Grid */}
        {stores.length === 0 ? (
          <div className="card text-center py-16 animate-slide-up">
            <MapPin className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-dark-400 mb-3">No stores found</h3>
            <p className="text-dark-300 text-lg mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'No stores have been added yet'}
            </p>
            {!searchTerm && user?.role === 'system_admin' && (
              <Link to="/admin/stores" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add First Store
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 animate-slide-up">
            {stores.map((store) => (
              <div key={store.id} className="card-hover group">
                <div className="p-6">
                  {/* Store Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-dark-400 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {store.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      {getRatingStars(store.average_rating || 0)}
                      <span className="text-sm text-dark-300 ml-1">
                        ({store.total_ratings || 0})
                      </span>
                    </div>
                  </div>
                  
                  {/* Store Address */}
                  <div className="flex items-start text-dark-300 mb-4">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm line-clamp-2">{store.address}</span>
                  </div>
                  
                  {/* Store Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="text-dark-300">Rating: </span>
                      <span className={`font-semibold ${getRatingColor(store.average_rating || 0)}`}>
                        {(parseFloat(store.average_rating) || 0).toFixed(1)}
                      </span>
                      <span className="text-dark-300"> / 5</span>
                    </div>
                    
                    <div className="text-sm text-dark-300">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      {store.total_ratings || 0} ratings
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Link
                    to={`/stores/${store.id}`}
                    className="btn-primary w-full text-center group-hover:scale-105 transition-transform duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
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
