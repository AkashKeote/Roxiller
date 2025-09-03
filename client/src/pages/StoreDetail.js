import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Phone, Mail, ArrowLeft, Edit3, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const StoreDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchStoreDetails();
  }, [id, fetchStoreDetails]);

  const fetchStoreDetails = useCallback(async () => {
    try {
      setLoading(true);
      const [storeResponse, ratingsResponse] = await Promise.all([
        axios.get(`/api/stores/${id}`),
        axios.get(`/api/stores/${id}/ratings`)
      ]);

      setStore(storeResponse.data.store);
      setRatings(ratingsResponse.data.ratings);
      
      // Check if user has already rated this store
      if (user) {
        const userRatingResponse = await axios.get(`/api/ratings/user/${id}`);
        setUserRating(userRatingResponse.data.rating);
      }
    } catch (error) {
      console.error('Error fetching store details:', error);
      toast.error('Failed to fetch store details');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    
    if (!ratingForm.rating) {
      toast.error('Please select a rating');
      return;
    }

    setRatingLoading(true);
    try {
      if (userRating) {
        // Update existing rating
        await axios.put(`/api/ratings/${userRating.id}`, ratingForm);
        toast.success('Rating updated successfully!');
      } else {
        // Create new rating
        await axios.post(`/api/ratings/${id}`, {
          rating: ratingForm.rating,
          comment: ratingForm.comment
        });
        toast.success('Rating submitted successfully!');
      }
      
      // Refresh data
      await fetchStoreDetails();
      setShowRatingForm(false);
      setRatingForm({ rating: 5, comment: '' });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!userRating) return;
    
    try {
      await axios.delete(`/api/ratings/${userRating.id}`);
      toast.success('Rating deleted successfully!');
      setUserRating(null);
      await fetchStoreDetails();
    } catch (error) {
      console.error('Error deleting rating:', error);
      toast.error('Failed to delete rating');
    }
  };

  const getRatingStars = (rating, size = 'w-5 h-5') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`${size} ${
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

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Average';
    if (rating >= 1.5) return 'Below Average';
    return 'Poor';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-dark-400 font-medium">Loading store details...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-dark-400 mb-4">Store not found</h2>
          <Link to="/stores" className="btn-primary">
            Back to Stores
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in">
          <Link
            to="/stores"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Stores
          </Link>
        </div>

        {/* Store Header */}
        <div className="card p-8 mb-8 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Store Info */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-dark-400 mb-4">{store.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  {getRatingStars(parseFloat(store.average_rating) || 0, 'w-6 h-6')}
                  <span className={`text-2xl font-bold ${getRatingColor(parseFloat(store.average_rating) || 0)}`}>
                    {(parseFloat(store.average_rating) || 0).toFixed(1)}
                  </span>
                  <span className="text-dark-300">({store.total_ratings || 0} ratings)</span>
                </div>
                
                <span className={`badge ${getRatingColor(parseFloat(store.average_rating) || 0).replace('text-', 'bg-').replace('-600', '-100')} ${getRatingColor(parseFloat(store.average_rating) || 0)}`}>
                  {getRatingText(parseFloat(store.average_rating) || 0)}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <span className="text-dark-400">{store.address}</span>
                </div>
                
                {store.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span className="text-dark-400">{store.phone}</span>
                  </div>
                )}
                
                {store.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <span className="text-dark-400">{store.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 bg-primary-50 border-primary-200">
                <h3 className="text-lg font-semibold text-dark-400 mb-4">Rating Summary</h3>
                
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratings.filter(r => r.rating === star).length;
                    const percentage = store.total_ratings > 0 ? (count / store.total_ratings) * 100 : 0;
                    
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm text-dark-400">{star}</span>
                          <Star className="w-4 h-4 star-filled" />
                        </div>
                        <div className="flex-1 bg-white rounded-full h-2">
                          <div
                            className="bg-primary-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-dark-400 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        {user && (
          <div className="card p-6 mb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-dark-400">
                {userRating ? 'Update Your Rating' : 'Rate This Store'}
              </h2>
              
              {!showRatingForm && (
                <button
                  onClick={() => setShowRatingForm(true)}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {userRating ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {userRating ? 'Edit Rating' : 'Add Rating'}
                </button>
              )}
            </div>

            {showRatingForm ? (
              <form onSubmit={handleRatingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-400 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= ratingForm.rating ? 'star-filled' : 'star-empty'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-dark-400 mb-2">
                    Comment (Optional)
                  </label>
                  <textarea
                    id="comment"
                    value={ratingForm.comment}
                    onChange={(e) => setRatingForm({ ...ratingForm, comment: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Share your experience with this store..."
                    maxLength={500}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={ratingLoading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {ratingLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="spinner w-5 h-5"></div>
                        {userRating ? 'Updating...' : 'Submitting...'}
                      </div>
                    ) : (
                      userRating ? 'Update Rating' : 'Submit Rating'
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowRatingForm(false);
                      setRatingForm({ rating: 5, comment: '' });
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  
                  {userRating && (
                    <button
                      type="button"
                      onClick={handleDeleteRating}
                      className="btn-outline text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Rating
                    </button>
                  )}
                </div>
              </form>
            ) : userRating ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getRatingStars(userRating.rating)}
                      <span className="text-lg font-semibold text-dark-400">
                        Your rating: {userRating.rating}/5
                      </span>
                    </div>
                    {userRating.comment && (
                      <p className="text-dark-400 text-sm ml-4">
                        "{userRating.comment}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-dark-300 text-center py-8">
                Be the first to rate this store and share your experience!
              </p>
            )}
          </div>
        )}

        {/* Recent Ratings */}
        <div className="card animate-slide-up">
          <div className="p-6 border-b border-primary-100">
            <h2 className="text-2xl font-bold text-dark-400">Recent Ratings</h2>
            <p className="text-dark-300">What others are saying about this store</p>
          </div>
          
          <div className="p-6">
            {ratings.length > 0 ? (
              <div className="space-y-6">
                {ratings.map((rating) => (
                  <div key={rating.id} className="border-b border-primary-100 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600">
                            {rating.user_name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-dark-400">{rating.user_name || 'Anonymous'}</p>
                          <p className="text-sm text-dark-300">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {getRatingStars(rating.rating)}
                        <span className="text-sm text-dark-400 ml-1">{rating.rating}/5</span>
                      </div>
                    </div>
                    
                    {rating.comment && (
                      <p className="text-dark-400 ml-13">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-dark-400 mb-2">No ratings yet</h3>
                <p className="text-dark-300">Be the first to rate this store!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;
