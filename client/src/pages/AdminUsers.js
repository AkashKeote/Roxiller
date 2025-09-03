import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Edit3, Trash2, 
  Eye, UserPlus, Shield, Store, User,
  ArrowUpDown, ArrowUp, ArrowDown, X, Star
} from 'lucide-react';

import axios from 'axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [USERs, setUSERs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUSER, setEditingUSER] = useState(null);
  const [showUSERDetails, setShowUSERDetails] = useState(null);

  const [USERForm, setUSERForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    ROLE_id: ''
  });

  const fetchUSERs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await axios.get(`/api/admin/USERs?${params}`); console.log("API Response:", response.data); console.log("USERs:", response.data.USERs);
      setUSERs(response.data.USERs);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error('Error fetching USERs:', error);
      toast.error('Failed to fetch USERs');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, sortOrder, searchTerm]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/users?limit=1000');
      setUsers(response.data.users.filter(u => u.role === 'USER_ROLE'));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  useEffect(() => {
    fetchUSERs();
    fetchUsers();
  }, [fetchUSERs, fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!USERForm.name || !USERForm.address || !USERForm.ROLE_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (USERForm.name.length < 3 || USERForm.name.length > 100) {
      toast.error('USER name must be between 3-100 characters');
      return;
    }

    if (USERForm.address.length > 400) {
      toast.error('Address must not exceed 400 characters');
      return;
    }

    try {
      if (editingUSER) {
        await axios.put(`/api/admin/USERs/${editingUSER.id}`, USERForm);
        toast.success('USER updated successfully!');
      } else {
        await axios.post('/api/admin/USERs', USERForm);
        toast.success('USER created successfully!');
      }
      
      setShowAddForm(false);
      setEditingUSER(null);
      setUSERForm({ name: '', address: '', phone: '', email: '', ROLE_id: '' });
      fetchUSERs();
    } catch (error) {
      console.error('Error saving USER:', error);
      toast.error('Failed to save USER');
    }
  };

  const handleDelete = async (USERId) => {
    if (!window.confirm('Are you sure you want to delete this USER?')) return;
    
    try {
      await axios.delete(`/api/admin/USERs/${USERId}`);
      toast.success('USER deleted successfully!');
      fetchUSERs();
    } catch (error) {
      console.error('Error deleting USER:', error);
      toast.error('Failed to delete USER');
    }
  };

  const handleEdit = (USER) => {
    setEditingUSER(USER);
    setUSERForm({
      name: USER.name,
      address: USER.address,
      phone: USER.phone || '',
      email: USER.email || '',
      ROLE_id: USER.ROLE_id || ''
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

  const getSTATUSStars = (STATUS) => { console.log("getSTATUSStars called with STATUS:", STATUS, "type:", typeof STATUS);
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= STATUS ? 'star-filled' : 'star-empty'
          }`}
        />
      );
    }
    return stars;
  };

  const getROLEName = (ROLEId) => {
    const ROLE = users.find(u => u.id === ROLEId);
    return ROLE ? ROLE.name : 'Unassigned';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-dark-400 font-medium">Loading USERs...</p>
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
              <h1 className="text-4xl font-bold text-gradient mb-2">USER Management</h1>
              <p className="text-dark-300 text-lg">
                Manage USER listings, ROLEs, and information
              </p>
            </div>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
                              <USER className="w-5 h-5" />
              Add New USER
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
                placeholder="Search USERs by name, address, or ROLE..."
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
                <option value="STATUS">STATUS</option>
                <option value="ROLE_id">ROLE</option>
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

        {/* USERs Table */}
        <div className="card animate-slide-up">
          <div className="p-6 border-b border-primary-100">
            <h2 className="text-2xl font-bold text-dark-400">Users ({users.length})</h2>
            <p className="text-dark-300">Manage all registered users in the system.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    USER
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    CONTACT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    ROLE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {USERs && users.length > 0 ? USERs.map((USER) => (
                  <tr key={USER.id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <USER className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-dark-400">{USER.name}</div>
                          <div className="text-sm text-dark-300">ID: {USER.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-dark-400 max-w-xs truncate">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3" />
                          {USER.address}
                        </div>
                        {USER.phone && (
                          <div className="flex items-center gap-1 mb-1">
                            <Phone className="w-3 h-3" />
                            {USER.phone}
                          </div>
                        )}
                        {USER.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {USER.email}
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
                          {getROLEName(USER.ROLE_id)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {getSTATUSStars(parseFloat(USER.average_STATUS) || 0)}
                        </div>
                        <span className="text-sm text-dark-400">
                          {(parseFloat(USER.average_STATUS) || 0).toFixed(1)}
                        </span>
                        <span className="text-xs text-dark-300">
                          ({USER.total_STATUSs || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowUSERDetails(USER)}
                          className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(USER)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit USER"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(USER.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete USER"
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
                        <USER className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-dark-400 mb-2">No USERs found</h3>
                        <p className="text-dark-300">Create your first USER to get started</p>
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

        {/* Add/Edit USER Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-md animate-slide-up">
              <div className="p-6 border-b border-primary-100">
                <h3 className="text-xl font-semibold text-dark-400">
                  {editingUSER ? 'Edit USER' : 'Add New USER'}
                </h3>
                <p className="text-dark-300 text-sm">
                  {editingUSER ? 'Update USER information' : 'Create a new USER listing'}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark-400 mb-2">
                    USER Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={USERForm.name}
                    onChange={(e) => setUSERForm({ ...USERForm, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter USER name (3-100 characters)"
                    minLength={3}
                    maxLength={100}
                    required
                  />
                  <p className="text-xs text-dark-300 mt-1">
                    {USERForm.name.length}/100 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-dark-400 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    value={USERForm.address}
                    onChange={(e) => setUSERForm({ ...USERForm, address: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Enter USER address (max 400 characters)"
                    maxLength={400}
                    required
                  />
                  <p className="text-xs text-dark-300 mt-1">
                    {USERForm.address.length}/400 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-dark-400 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={USERForm.phone}
                    onChange={(e) => setUSERForm({ ...USERForm, phone: e.target.value })}
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
                    value={USERForm.email}
                    onChange={(e) => setUSERForm({ ...USERForm, email: e.target.value })}
                    className="input-field"
                    placeholder="Enter email address (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="ROLE_id" className="block text-sm font-medium text-dark-400 mb-2">
                    USER ROLE *
                  </label>
                  <select
                    id="ROLE_id"
                    value={USERForm.ROLE_id}
                    onChange={(e) => setUSERForm({ ...USERForm, ROLE_id: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select a USER ROLE</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {users.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      No USER ROLEs available. Please create USER ROLE accounts first.
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={users.length === 0}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingUSER ? 'Update USER' : 'Create USER'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingUSER(null);
                      setUSERForm({ name: '', address: '', phone: '', email: '', ROLE_id: '' });
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

        {/* USER Details Modal */}
        {showUSERDetails && showUSERDetails.id && typeof showUSERDetails.id === 'number' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-md animate-slide-up">
              <div className="p-6 border-b border-primary-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-dark-400">USER Details</h3>
                  <button
                    onClick={() => setShowUSERDetails(null)}
                    className="text-dark-300 hover:text-dark-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <USER className="w-10 h-10 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-dark-400">{showUSERDetails.name}</h4>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {getSTATUSStars(parseFloat(showUSERDetails.average_STATUS) || 0)}
                    <span className="text-sm text-dark-400 ml-1">
                      {(parseFloat(showUSERDetails.average_STATUS) || 0).toFixed(1)} / 5
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-dark-300">USER ID</p>
                    <p className="text-dark-400 font-medium">{showUSERDetails.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-dark-300">Address</p>
                    <p className="text-dark-400 font-medium">{showUSERDetails.address}</p>
                  </div>
                  
                  {showUSERDetails.phone && (
                    <div>
                      <p className="text-sm text-dark-300">Phone</p>
                      <p className="text-dark-400 font-medium">{showUSERDetails.phone}</p>
                    </div>
                  )}
                  
                  {showUSERDetails.email && (
                    <div>
                      <p className="text-sm text-dark-300">Email</p>
                      <p className="text-dark-400 font-medium">{showUSERDetails.email}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-dark-300">ROLE</p>
                    <p className="text-dark-400 font-medium">
                      {getROLEName(showUSERDetails.ROLE_id)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-dark-300">Total STATUSs</p>
                    <p className="text-dark-400 font-medium">{showUSERDetails.total_STATUSs || 0}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-dark-300">Created On</p>
                    <p className="text-dark-400 font-medium">
                      {new Date(showUSERDetails.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUSERDetails(null);
                      handleEdit(showUSERDetails);
                    }}
                    className="btn-primary flex-1"
                  >
                    Edit USER
                  </button>
                  
                  <button
                    onClick={() => setShowUSERDetails(null)}
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

export default AdminUsers;
