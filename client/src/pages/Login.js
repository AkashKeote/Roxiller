import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Leaf, Store, User, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'normal_user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const roleOptions = [
    {
      value: 'normal_user',
      label: 'Customer',
      icon: User,
      description: 'Rate and discover stores',
      color: '#F9E79F'
    },
    {
      value: 'store_owner',
      label: 'Shopkeeper',
      icon: Store,
      description: 'Manage your store ratings',
      color: '#B5C7F7'
    },
    {
      value: 'system_admin',
      label: 'Admin',
      icon: Shield,
      description: 'System management',
      color: '#E8D5C4'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email: formData.email, role: formData.role });
      const result = await login(formData.email, formData.password, formData.role);
      console.log('Login result:', result);
      if (result.success) {
        // Navigation will be handled by the router
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F6F2] via-[#B5C7F7] to-[#F9E79F] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-20 h-20 bg-[#B5C7F7] rounded-3xl shadow-lg shadow-[#B5C7F7]/30 mx-auto mb-6 flex items-center justify-center">
            <Leaf className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-[#22223B] mb-2 leading-tight">
            Store Rating<br />System
          </h1>
          <p className="text-[#22223B]/70 text-base">
            Rate stores and manage your business
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-lg font-semibold text-[#22223B] mb-4">
            Choose Your Role
          </h2>
          
          <div className="grid grid-cols-3 gap-3">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
                  formData.role === role.value
                    ? 'border-[#B5C7F7] bg-[#B5C7F7] shadow-lg shadow-[#B5C7F7]/30'
                    : 'border-white/30 bg-white/80 hover:border-white/50 hover:bg-white/90'
                }`}
              >
                <div className={`w-6 h-6 rounded-2xl flex items-center justify-center mx-auto mb-2 ${
                  formData.role === role.value ? 'bg-white' : 'bg-[#22223B]/60'
                }`}>
                  <role.icon className={`w-3 h-3 ${
                    formData.role === role.value ? 'text-[#22223B]' : 'text-white'
                  }`} />
                </div>
                <p className={`text-xs font-medium ${
                  formData.role === role.value ? 'text-[#22223B]' : 'text-[#22223B]/70'
                }`}>
                  {role.label}
                </p>
                <p className={`text-xs mt-1 leading-tight ${
                  formData.role === role.value ? 'text-[#22223B]/80' : 'text-[#22223B]/60'
                }`}>
                  {role.description}
                </p>
                
                {formData.role === role.value && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#B5C7F7] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 animate-slide-up">
          <h2 className="text-xl font-semibold text-[#22223B] mb-6 text-center">
            Sign In
          </h2>
          


          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-5 py-5 border-2 border-gray-200 rounded-2xl focus:border-[#B5C7F7] focus:ring-4 focus:ring-[#B5C7F7]/20 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Enter your email"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-[#B5C7F7] rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-14 py-5 border-2 border-gray-200 rounded-2xl focus:border-[#B5C7F7] focus:ring-4 focus:ring-[#B5C7F7]/20 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-[#B5C7F7] rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#B5C7F7] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#B5C7F7] hover:bg-[#9BB3F5] text-[#22223B] font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-[#B5C7F7]/30 hover:shadow-xl hover:shadow-[#B5C7F7]/40 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner w-6 h-6 mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Account Info */}
          <div className="mt-6 p-4 bg-[#F9E79F]/20 rounded-2xl border border-[#F9E79F]/30">
            <h3 className="text-sm font-semibold text-[#22223B] mb-2">Demo Account</h3>
            <div className="text-xs text-[#22223B]/80 space-y-1">
              <p><strong>Admin:</strong> admin@system.com / Admin@123</p>
              <p><strong>Store Owner:</strong> store@example.com / Store@123</p>
              <p><strong>User:</strong> user@example.com / User@123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in">
          <p className="text-[#22223B]/70 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-[#22223B] font-semibold underline decoration-2 underline-offset-2 hover:text-[#B5C7F7] transition-colors duration-300"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
