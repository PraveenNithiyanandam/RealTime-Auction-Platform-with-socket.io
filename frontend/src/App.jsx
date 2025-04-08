// src/App.jsx
import React, { useEffect, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { connectSocket, disconnectSocket } from './utils/socket';
import { AuthContext } from './context/AuthContext';
import Header from './components/Layout/Header';
import ProtectedRoute from './components/Layout/ProtectedRoute';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import AuctionList from './components/Auction/AuctionList';
import AuctionDetail from './components/Auction/AuctionDetail';
import AuctionForm from './components/Auction/AuctionForm';
import WinnersList from './components/Auction/WinnersList';
import MyWins from './components/Auction/MyWins';
import ManageAuctions from './components/Auction/ManageAuctions';

const App = () => {
    const { loading } = useContext(AuthContext);
    
    useEffect(() => {
        connectSocket();
        
        return () => {
            disconnectSocket();
        };
    }, []);
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading application...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="pt-6 pb-12">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<AuctionList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auctions/:id" element={<AuctionDetail />} />
                    <Route path="/winners" element={<WinnersList />} />

                    {/* Protected routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/create-auction" element={<AuctionForm />} />
                        <Route path="/my-wins" element={<MyWins />} /> 
                        <Route path="/manage-auctions" element={<ManageAuctions />} /> 
                    </Route>
                    
                    {/* Redirect for unknown routes */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;