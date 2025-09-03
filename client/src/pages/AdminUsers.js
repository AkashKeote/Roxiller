import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, Search, Edit3, Trash2, 
  Eye, Star, MapPin, Mail, Phone,
  ArrowUpDown, ArrowUp, ArrowDown, X, Shield, Store
} from 'lucide-react';

import axios from 'axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(null);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm })
      });

      const response = await axios.get(`/api/admin/users?${params}`);
      console.log("API Response:", response.data);
      console.log("Users:", response.data.users);
      setUsers(response.data.users || []);
      setTotalPages(Math.ceil((response.data.total || users.length) / 10));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, sortOrder, searchTerm, users.length]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userForm.name || !userForm.email || !userForm.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await axios.put(`/api/admin/users/${editingUser.id}`, userForm);
      toast.success('User updated successfully!');
      
      setShowEditForm(false);
      setEditingUser(null);
      setUserForm({ name: '', email: '', address: '', role: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      address: user.address || '',
      role: user.role
    });
    setShowEditForm(true);
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

  const getRoleIcon = (role) => {
    switch (role) {
      case 'system_admin':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'store_owner':
        return <Store className="w-4 h-4 text-blue-600" />;
      case 'normal_user':
        return <User className="w-4 h-4 text-green-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'system_admin':
        return 'Admin';
      case 'store_owner':
        return 'Store Owner';
      case 'normal_user':
        return 'Customer';
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'system_admin':
        return 'bg-red-100 text-red-800';
      case 'store_owner':
        return 'bg-blue-100 text-blue-800';
      case 'normal_user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-dark-400 font-medium">Loading users...</p>
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
              <h1 className="text-4xl font-bold text-gradient mb-2">User Management</h1>
              <p className="text-dark-300 text-lg">
                Manage all registered users in the system
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="card p-6 mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
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
                <option value="email">Email</option>
                <option value="role">Role</option>
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

        {/* Users Table */}
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
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {users && users.length > 0 ? users.map((user) => (
                  <tr key={user.id} className="hover:bg-primary-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-dark-400">{user.name}</div>
                          <div className="text-sm text-dark-300">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-dark-400 max-w-xs truncate">
                        <div className="flex items-center gap-1 mb-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        {user.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.address}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-dark-400">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowUserDetails(user)}
                          className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-center">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-dark-400 mb-2">No users found</h3>
                        <p className="text-dark-300">No users are currently registered in the system</p>
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

        {/* Edit User Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-md animate-slide-up">
              <div className="p-6 border-b border-primary-100">
                <h3 className="text-xl font-semibold text-dark-400">
                  Edit User
                </h3>
                <p className="text-dark-300 text-sm">
                  Update user information
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-dark-400 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter user name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-400 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="input-field"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-dark-400 mb-2">
                    Address
                  </label>
                  <textarea
                    id="address"
                    value={userForm.address}
                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Enter address (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-dark-400 mb-2">
                    Role *
                  </label>
                  <select
                    id="role"
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="normal_user">Customer</option>
                    <option value="store_owner">Store Owner</option>
                    <option value="system_admin">System Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Update User
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingUser(null);
                      setUserForm({ name: '', email: '', address: '', role: '' });
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

        {/* User Details Modal */}
        {showUserDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-md animate-slide-up">
              <div className="p-6 border-b border-primary-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-dark-400">User Details</h3>
                  <button
                    onClick={() => setShowUserDetails(null)}
                    className="text-dark-300 hover:text-dark-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-primary-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-dark-400">{showUserDetails.name}</h4>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    {getRoleIcon(showUserDetails.role)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(showUserDetails.role)}`}>
                      {getRoleLabel(showUserDetails.role)}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-dark-300">User ID</p>
                    <p className="text-dark-400 font-medium">{showUserDetails.id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-dark-300">Email</p>
                    <p className="text-dark-400 font-medium">{showUserDetails.email}</p>
                  </div>
                  
                  {showUserDetails.address && (
                    <div>
                      <p className="text-sm text-dark-300">Address</p>
                      <p className="text-dark-400 font-medium">{showUserDetails.address}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-dark-300">Role</p>
                    <p className="text-dark-400 font-medium">{getRoleLabel(showUserDetails.role)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-dark-300">Status</p>
                    <p className="text-dark-400 font-medium">Active</p>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowUserDetails(null);
                      handleEdit(showUserDetails);
                    }}
                    className="btn-primary flex-1"
                  >
                    Edit User
                  </button>
                  
                  <button
                    onClick={() => setShowUserDetails(null)}
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
