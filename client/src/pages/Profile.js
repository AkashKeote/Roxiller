import React, { useState, useEffect } from 'react';
import { User, MapPin, Mail, Eye, EyeOff, CheckCircle, XCircle, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    address: user?.address || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Initialize form data when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileForm.name || !profileForm.address) {
      toast.error('Please fill in all fields');
      return;
    }

    if (profileForm.name.length < 20 || profileForm.name.length > 60) {
      toast.error('Name must be between 20-60 characters');
      return;
    }

    if (profileForm.address.length > 400) {
      toast.error('Address must not exceed 400 characters');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(profileForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // Don't show error toast here as updateProfile already shows it
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (!validatePassword(passwordForm.newPassword)) {
      toast.error('Password does not meet requirements');
      return;
    }

    setPasswordLoading(true);
    try {
      await updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setPasswordLoading(false);
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const maxLength = password.length <= 16;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    return minLength && maxLength && hasUppercase && hasSpecialChar;
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, color: 'bg-gray-200', text: 'Very Weak' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    const strengthMap = {
      0: { color: 'bg-red-500', text: 'Very Weak' },
      1: { color: 'bg-red-400', text: 'Weak' },
      2: { color: 'bg-orange-400', text: 'Fair' },
      3: { color: 'bg-yellow-400', text: 'Good' },
      4: { color: 'bg-blue-400', text: 'Strong' },
      5: { color: 'bg-green-400', text: 'Very Strong' },
      6: { color: 'bg-green-500', text: 'Excellent' }
    };

    return strengthMap[Math.min(score, 6)];
  };

  const getValidationIcon = (isValid) => {
    return isValid ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const passwordRequirements = [
    { label: '8-16 characters', valid: passwordForm.newPassword.length >= 8 && passwordForm.newPassword.length <= 16 },
    { label: '1 uppercase letter', valid: /[A-Z]/.test(passwordForm.newPassword) },
    { label: '1 special character (!@#$%^&*)', valid: /[!@#$%^&*]/.test(passwordForm.newPassword) }
  ];

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <div className="text-center mb-8">
            <div className="icon-container mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Your Profile</h1>
            <p className="text-dark-300 text-lg">
              Manage your personal information and account settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="animate-slide-up">
            <div className="card">
              <div className="p-6 border-b border-primary-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-dark-400">Profile Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-outline inline-flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-dark-400 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="input-field"
                        placeholder="Enter your full name"
                        minLength={20}
                        maxLength={60}
                        required
                      />
                      <p className="text-xs text-dark-300 mt-1">
                        {profileForm.name.length}/60 characters (minimum 20)
                      </p>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-dark-400 mb-2">
                        Address
                      </label>
                      <textarea
                        id="address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                        className="input-field resize-none"
                        rows={3}
                        placeholder="Enter your address"
                        maxLength={400}
                        required
                      />
                      <p className="text-xs text-dark-300 mt-1">
                        {profileForm.address.length}/400 characters
                      </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="spinner w-4 h-4"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setProfileForm({
                            name: user?.name || '',
                            address: user?.address || ''
                          });
                        }}
                        className="btn-outline"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-dark-300">Full Name</p>
                        <p className="text-dark-400 font-medium">{user?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-dark-300">Email Address</p>
                        <p className="text-dark-400 font-medium">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-dark-300">Address</p>
                        <p className="text-dark-400 font-medium">{user?.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Password Management */}
          <div className="animate-slide-up">
            <div className="card">
              <div className="p-6 border-b border-primary-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-dark-400">Password Management</h2>
                  {!showPasswordForm && (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="btn-outline inline-flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Change Password
                    </button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {showPasswordForm ? (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-dark-400 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          id="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="input-field pr-12"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-300 hover:text-primary-600 transition-colors"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-dark-400 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          id="newPassword"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="input-field pr-12"
                          placeholder="Enter your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-300 hover:text-primary-600 transition-colors"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {passwordForm.newPassword && (
                        <div className="mt-2">
                          <div className="flex gap-1 mb-1">
                            {[1, 2, 3, 4, 5, 6].map((level) => {
                              const strength = getPasswordStrength(passwordForm.newPassword);
                              return (
                                <div
                                  key={level}
                                  className={`h-2 flex-1 rounded ${
                                    level <= strength.score ? strength.color : 'bg-gray-200'
                                  }`}
                                />
                              );
                            })}
                          </div>
                          <p className="text-xs text-dark-400">{getPasswordStrength(passwordForm.newPassword).text}</p>
                        </div>
                      )}

                      {/* Password Requirements */}
                      <div className="mt-2 space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {getValidationIcon(req.valid)}
                            <span className={req.valid ? 'text-green-600' : 'text-red-600'}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-400 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          id="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="input-field pr-12"
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-300 hover:text-primary-600 transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      {passwordForm.confirmPassword && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          {passwordForm.newPassword === passwordForm.confirmPassword ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-green-600">Passwords match</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-500" />
                              <span className="text-red-600">Passwords do not match</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {passwordLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="spinner w-4 h-4"></div>
                            Updating...
                          </div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Update Password
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }}
                        className="btn-outline"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-dark-400 mb-2">Secure Your Account</h3>
                    <p className="text-dark-300 mb-4">
                      Keep your account safe by regularly updating your password
                    </p>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 animate-slide-up">
          <div className="card">
            <div className="p-6 border-b border-primary-100">
              <h2 className="text-2xl font-bold text-dark-400">Account Information</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-xl">
                  <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-dark-400 mb-1">Account Type</h3>
                  <p className="text-primary-600 capitalize">
                    {user?.role?.replace('_', ' ') || 'User'}
                  </p>
                </div>
                
                <div className="text-center p-4 bg-secondary-50 rounded-xl">
                  <div className="w-12 h-12 bg-secondary-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-dark-400 mb-1">Email Verified</h3>
                  <p className="text-secondary-600">Active</p>
                </div>
                
                <div className="text-center p-4 bg-accent-50 rounded-xl">
                  <div className="w-12 h-12 bg-accent-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-dark-400 mb-1">Location</h3>
                  <p className="text-accent-600">
                    {user?.address?.split(',')[0] || 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
