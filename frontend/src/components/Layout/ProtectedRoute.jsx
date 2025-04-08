// src/Layout/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();
    
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;