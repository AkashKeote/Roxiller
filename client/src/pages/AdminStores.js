import React, { useState, useEffect } from 'react';
import { 
  Store, Plus, Search, Filter, Edit3, Trash2, 
  Eye, MoreHorizontal, Star, MapPin, User,
  ArrowUpDown, ArrowUp, ArrowDown, X, Phone, Mail
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminStores = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [showStoreDetails, setShowStoreDetails] = useState(null);

  const [storeForm, setStoreForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    owner_id: ''
  });

  useEffect(() => {
    fetchStores();
    fetchUsers();
  }, [searchTerm, sortBy, sortOrder, currentPage]);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await axios.get(`/api/admin/stores?${params}`);
      setStores(response.data.stores);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users?limit=1000');
      setUsers(response.data.users.filter(u => u.role === 'store_owner'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!storeForm.name || !storeForm.address || !storeForm.owner_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (storeForm.name.length < 3 || storeForm.name.length > 100) {
      toast.error('Store name must be between 3-100 characters');
      return;
    }

    if (storeForm.address.length > 400) {
      toast.error('Address must not exceed 400 characters');
      return;
    }

    try {
      if (editingStore) {
        await axios.put(`/api/admin/stores/${editingStore.id}`, storeForm);
        toast.success('Store updated successfully!');
      } else {
        await axios.post('/api/admin/stores', storeForm);
        toast.success('Store created successfully!');
      }
      
      setShowAddForm(false);
      setEditingStore(null);
      setStoreForm({ name: '', address: '', phone: '', email: '', owner_id: '' });
      fetchStores();
    } catch (error) {
      console.error('Error saving store:', error);
      toast.error('Failed to save store');
    }
  };

  const handleDelete = async (storeId) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    
    try {
      await axios.delete(`/api/admin/stores/${storeId}`);
      toast.success('Store deleted successfully!');
      fetchStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error('Failed to delete store');
    }
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setStoreForm({
      name: store.name,
      address: store.address,
      phone: store.phone || '',
      email: store.email || '',
      owner_id: store.owner_id || ''
    });
    setShowAddForm(true);
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

  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
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

  const getOwnerName = (ownerId) => {
    const owner = users.find(u => u.id === ownerId);
    return owner ? owner.name : 'Unassigned';
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">Store Management</h1>
              <p className="text-dark-300 text-lg">
                Manage store listings, owners, and information
              </p>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
                              <Store className="w-5 h-5" />
              Add New Store
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="card p-6 mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stores by name, address, or owner..."
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
                <option value="owner_id">Owner</option>
                <option value="created_at">Date Created</option>
              </select>
              
              <button
                onClick={() => handleSort(sortBy)}
                className="btn-outline px-4 py-3 min-w-[60px]"
              >
                {getSortIcon(sortBy)}
              </button>
            </div>
          </div>
        </div>

        {/* Stores Table */}
        <div className="card animate-slide-up">
          <div className="p-6 border-b border-primary-100">
            <h2 className="text-2xl font-bold text-dark-400">Stores ({stores.length})</h2>
            <p className="text-dark-300">Manage all registered stores in the system</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Store
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {stores && stores.length > 0 ? stores.map((store) => (
                  <tr key={store.id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Store className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-dark-400">{store.name}</div>
                          <div className="text-sm text-dark-300">ID: {store.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-dark-400 max-w-xs truncate">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3" />
                          {store.address}
                        </div>
                        {store.phone && (
                          <div className="flex items-center gap-1 mb-1">
                            <Phone className="w-3 h-3" />
                            {store.phone}
                          </div>
                        )}
                        {store.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {store.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm text-dark-400">
                          {getOwnerName(store.owner_id)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {getRatingStars(store.average_rating && typeof store.average_rating === 'number' ? store.average_rating : 0)}
                        </div>
                        <span className="text-sm text-dark-400">
                          {store.average_rating && typeof store.average_rating === 'number' ? store.average_rating.toFixed(1) : 'N/A'}
                        </span>
                        <span className="text-xs text-dark-300">
                          ({store.total_ratings || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowStoreDetails(store)}
                          className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(store)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Store"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(store.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Store"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-center">
                        <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-dark-400 mb-2">No stores found</h3>
                        <p className="text-dark-300">Create your first store to get started</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-primary-100">
              <div className="flex justify-center">
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
            </div>
          )}
        </div>

        {/* Add/Edit Store Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-md animate-slide-up">
              <div className="p-6 border-b border-primary-100">
                <h3 className="text-xl font-semibold text-dark-400">
                  {editingStore ? 'Edit Store' : 'Add New Store'}
                </h3>
                <p className="text-dark-300 text-sm">
                  {editingStore ? 'Update store information' : 'Create a new store listing'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark-400 mb-2">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={storeForm.name}
                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter store name (3-100 characters)"
                    minLength={3}
                    maxLength={100}
                    required
                  />
                  <p className="text-xs text-dark-300 mt-1">
                    {storeForm.name.length}/100 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-dark-400 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    value={storeForm.address}
                    onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Enter store address (max 400 characters)"
                    maxLength={400}
                    required
                  />
                  <p className="text-xs text-dark-300 mt-1">
                    {storeForm.address.length}/400 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-dark-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="input-field"
                    placeholder="Enter phone number (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={storeForm.email}
                    onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                    className="input-field"
                    placeholder="Enter email address (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="owner_id" className="block text-sm font-medium text-dark-400 mb-2">
                    Store Owner *
                  </label>
                  <select
                    id="owner_id"
                    value={storeForm.owner_id}
                    onChange={(e) => setStoreForm({ ...storeForm, owner_id: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select a store owner</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {users.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      No store owners available. Please create store owner accounts first.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={users.length === 0}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingStore ? 'Update Store' : 'Create Store'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingStore(null);
                      setStoreForm({ name: '', address: '', phone: '', email: '', owner_id: '' });
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Store Details Modal */}
        {showStoreDetails && showStoreDetails.id && typeof showStoreDetails.id === 'number' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-md animate-slide-up">
              <div className="p-6 border-b border-primary-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-dark-400">Store Details</h3>
                  <button
                    onClick={() => setShowStoreDetails(null)}
                    className="text-dark-300 hover:text-dark-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Store className="w-10 h-10 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-dark-400">{showStoreDetails.name}</h4>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {getRatingStars(showStoreDetails.average_rating && typeof showStoreDetails.average_rating === 'number' ? showStoreDetails.average_rating : 0)}
                    <span className="text-sm text-dark-400 ml-1">
                      {showStoreDetails.average_rating && typeof showStoreDetails.average_rating === 'number' ? showStoreDetails.average_rating.toFixed(1) : 'N/A'} / 5
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-dark-300">Store ID</p>
                    <p className="text-dark-400 font-medium">{showStoreDetails.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-dark-300">Address</p>
                    <p className="text-dark-400 font-medium">{showStoreDetails.address}</p>
                  </div>
                  
                  {showStoreDetails.phone && (
                    <div>
                      <p className="text-sm text-dark-300">Phone</p>
                      <p className="text-dark-400 font-medium">{showStoreDetails.phone}</p>
                    </div>
                  )}
                  
                  {showStoreDetails.email && (
                    <div>
                      <p className="text-sm text-dark-300">Email</p>
                      <p className="text-dark-400 font-medium">{showStoreDetails.email}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-dark-300">Owner</p>
                    <p className="text-dark-400 font-medium">
                      {getOwnerName(showStoreDetails.owner_id)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-dark-300">Total Ratings</p>
                    <p className="text-dark-400 font-medium">{showStoreDetails.total_ratings || 0}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-dark-300">Created On</p>
                    <p className="text-dark-400 font-medium">
                      {new Date(showStoreDetails.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowStoreDetails(null);
                      handleEdit(showStoreDetails);
                    }}
                    className="btn-primary flex-1"
                  >
                    Edit Store
                  </button>
                  
                  <button
                    onClick={() => setShowStoreDetails(null)}
                    className="btn-outline flex-1"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStores;
