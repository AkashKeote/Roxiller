import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import StoreDetail from './pages/StoreDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import UserDashboard from './pages/UserDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-dark-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Public Route Component (redirects if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="spinner w-16 h-16 mx-auto mb-4"></div>
          <p className="text-dark-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Main App Component
const AppContent = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen gradient-bg">
      {user && <Navbar />}
      <main className="pt-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/stores" element={
            <ProtectedRoute>
              <Stores />
            </ProtectedRoute>
          } />
          
          <Route path="/stores/:id" element={
            <ProtectedRoute>
              <StoreDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['system_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['system_admin']}>
              <AdminUsers />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/stores" element={
            <ProtectedRoute allowedRoles={['system_admin']}>
              <AdminStores />
            </ProtectedRoute>
          } />
          
          {/* Store Owner Routes */}
          <Route path="/store-owner" element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <StoreOwnerDashboard />
            </ProtectedRoute>
          } />
          
          {/* User Dashboard Routes */}
          <Route path="/user-dashboard" element={
            <ProtectedRoute allowedRoles={['normal_user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#22223B',
            borderRadius: '12px',
            border: '1px solid #B5C7F7',
            boxShadow: '0 4px 20px rgba(181, 199, 247, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#75C375',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

// Root App Component
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
