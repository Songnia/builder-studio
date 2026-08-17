import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/authService';

const RequireSuperAdmin: React.FC = () => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const user = authService.getCurrentUser();
    
    // Check if user has the superadmin role
    if (user?.role !== 'superadmin') {
        // Redirect regular users to their dashboard
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

export default RequireSuperAdmin;
