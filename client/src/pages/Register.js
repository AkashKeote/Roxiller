import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, MapPin, User, CheckCircle, XCircle, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.address || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error('Password does not meet requirements');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        address: formData.address,
        password: formData.password,
        role: 'normal_user'
      });
      
      if (result.success) {
        // Navigation will be handled by the router
      }
    } catch (error) {
      console.error('Registration error:', error);
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

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const maxLength = password.length <= 16;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    return minLength && maxLength && hasUppercase && hasSpecialChar;
  };

  const getPasswordStrength = () => {
    const password = formData.password;
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
    { label: '8-16 characters', valid: formData.password.length >= 8 && formData.password.length <= 16 },
    { label: '1 uppercase letter', valid: /[A-Z]/.test(formData.password) },
    { label: '1 special character (!@#$%^&*)', valid: /[!@#$%^&*]/.test(formData.password) }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F6F2] via-[#F9E79F] to-[#B5C7F7] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6 animate-fade-in">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white/80 rounded-2xl shadow-lg shadow-gray-200/50 flex items-center justify-center hover:bg-white/90 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-[#22223B]" />
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-20 h-20 bg-[#F9E79F] rounded-3xl shadow-lg shadow-[#F9E79F]/30 mx-auto mb-6 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-[#22223B] mb-2 leading-tight">
            Join Store Rating<br />System
          </h1>
          <p className="text-[#22223B]/70 text-base">
            Create your account to start rating stores
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 p-6 animate-slide-up">
          <h2 className="text-xl font-semibold text-[#22223B] mb-6 text-center">
            Account Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-5 py-5 border-2 border-gray-200 rounded-2xl focus:border-[#F9E79F] focus:ring-4 focus:ring-[#F9E79F]/20 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Enter your full name (20-60 characters)"
                  minLength={20}
                  maxLength={60}
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-[#F9E79F] rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#22223B]/60 mt-2 ml-4">
                Must be between 20-60 characters
              </p>
            </div>

            {/* Email Field */}
            <div>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-5 py-5 border-2 border-gray-200 rounded-2xl focus:border-[#F9E79F] focus:ring-4 focus:ring-[#F9E79F]/20 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Enter your email address"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-[#F9E79F] rounded-full flex items-center justify-center">
                    <Mail className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Address Field */}
            <div>
              <div className="relative">
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-5 py-5 border-2 border-gray-200 rounded-2xl focus:border-[#F9E79F] focus:ring-4 focus:ring-[#F9E79F]/20 transition-all duration-300 bg-white shadow-sm resize-none"
                  rows={3}
                  placeholder="Enter your address (max 400 characters)"
                  maxLength={400}
                  required
                />
                <div className="absolute left-4 top-4">
                  <div className="w-6 h-6 bg-[#F9E79F] rounded-full flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#22223B]/60 mt-2 ml-4">
                Maximum 400 characters
              </p>
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
                  className="w-full pl-16 pr-14 py-5 border-2 border-gray-200 rounded-2xl focus:border-[#F9E79F] focus:ring-4 focus:ring-[#F9E79F]/20 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Create a password"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-[#F9E79F] rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#F9E79F] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 ml-4">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5, 6].map((level) => {
                      const strength = getPasswordStrength();
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
                  <p className="text-xs text-[#22223B]/70">{getPasswordStrength().text}</p>
                </div>
              )}

              {/* Password Requirements */}
              <div className="mt-3 ml-4 space-y-1">
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

            {/* Confirm Password Field */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-16 pr-14 py-5 border-2 border-gray-200 rounded-2xl focus:border-[#F9E79F] focus:ring-4 focus:ring-[#F9E79F]/20 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Confirm your password"
                  required
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-[#F9E79F] rounded-full flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#F9E79F] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {formData.confirmPassword && (
                <div className="mt-2 ml-4 flex items-center gap-2 text-xs">
                  {formData.password === formData.confirmPassword ? (
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#F9E79F] hover:bg-[#F5D17F] text-[#22223B] font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-[#F9E79F]/30 hover:shadow-xl hover:shadow-[#F9E79F]/40 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner w-6 h-6 mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in">
          <p className="text-[#22223B]/70 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#22223B] font-semibold underline decoration-2 underline-offset-2 hover:text-[#F9E79F] transition-colors duration-300"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
