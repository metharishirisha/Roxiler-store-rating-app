import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardRoute = () => {
    if (!user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'store_owner':
        return '/owner';
      default:
        return '/dashboard';
    }
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated && user
            ? <Navigate to={getDashboardRoute()} replace />
            : <Login />
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated && user
            ? <Navigate to={getDashboardRoute()} replace />
            : <Register />
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['normal']}>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/owner" 
        element={
          <ProtectedRoute allowedRoles={['store_owner']}>
            <StoreOwnerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;