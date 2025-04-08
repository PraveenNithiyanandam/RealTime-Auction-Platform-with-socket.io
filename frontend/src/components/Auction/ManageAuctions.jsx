// src/components/Auction/ManageAuctions.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getUserCreatedAuctions, deleteAuction } from '../../api/auctions';
import { Link } from 'react-router-dom';

const ManageAuctions = () => {
    const { token } = useContext(AuthContext);
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAuctionToDelete, setSelectedAuctionToDelete] = useState(null);

    useEffect(() => {
        const fetchUserAuctions = async () => {
            try {
                const fetchedAuctions = await getUserCreatedAuctions(token);
                setAuctions(fetchedAuctions);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserAuctions();
    }, [token]);

    const handleDeleteAuction = async (auctionId) => {
        try {
            await deleteAuction(auctionId, token);
            // Remove the deleted auction from the list
            setAuctions(prevAuctions => 
                prevAuctions.filter(auction => auction.id !== auctionId)
            );
            setSelectedAuctionToDelete(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10 flex justify-center items-center">
                <div className="flex items-center space-x-3 text-indigo-600">
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-slate-700 font-medium">Loading your auctions...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-10 text-center">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-700 font-semibold mb-2">Error Loading Auctions</p>
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Manage My Auctions</h1>
                    <Link 
                        to="/create-auction" 
                        className="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Auction</span>
                    </Link>
                </div>
                
                {auctions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-slate-500 font-medium mb-4">
                            You haven't created any auctions yet.
                        </p>
                        <Link 
                            to="/create-auction" 
                            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Create an Auction
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {auctions.map(auction => (
                            <div 
                                key={auction.id} 
                                className="bg-white rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-5 flex justify-between items-center">
                                    <div className="flex-1 mr-4">
                                        <h2 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-1">
                                            {auction.title}
                                        </h2>
                                        <div className="flex space-x-4 text-sm text-slate-600">
                                            <div className="flex items-center space-x-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Start: {new Date(auction.startTime).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>End: {new Date(auction.endTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Link 
                                            to={`/auctions/${auction.id}`}
                                            className="px-3.5 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors flex items-center space-x-1.5"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span>View</span>
                                        </Link>
                                        <button 
                                            onClick={() => setSelectedAuctionToDelete(auction.id)}
                                            className="px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center space-x-1.5"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {selectedAuctionToDelete && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Auction</h3>
                            <p className="text-slate-600 mb-6">Are you sure you want to delete this auction? This action cannot be undone.</p>
                            <div className="flex justify-center space-x-3">
                                <button 
                                    onClick={() => setSelectedAuctionToDelete(null)}
                                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleDeleteAuction(selectedAuctionToDelete)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAuctions;