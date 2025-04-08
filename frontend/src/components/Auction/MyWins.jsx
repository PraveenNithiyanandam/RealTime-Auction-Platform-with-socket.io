//src/components/Auction/MyWins.jsx
import React, { useState, useEffect, useContext } from 'react';
import { getUserWins } from '../../api/auctions';
import { AuthContext } from '../../context/AuthContext';
import Card from '../UI/Card';
import { Link } from 'react-router-dom';

const MyWins = () => {
    const [wins, setWins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, token } = useContext(AuthContext);  

    const fetchMyWins = async () => {
        if (!token) {
            console.error("🚨 No token available! User might not be authenticated.");
            setError('User not authenticated.');
            setLoading(false);
            return;
        }

        try {
            const data = await getUserWins(token);
            setWins(data);
            setLoading(false);
        } catch (error) {
            console.error("❌ Error fetching wins:", error);
            setError('Failed to load your wins. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMyWins();
        } else {
            setError('User not authenticated.');
            setLoading(false);
        }
    }, [token]); 

    if (loading) return (
        <div className="max-w-4xl mx-auto mt-8 pb-12 p-6 bg-white shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-all duration-300 ease-in-out">
            <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2 text-indigo-600">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-slate-700 font-medium">Loading your auction wins...</span>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="max-w-4xl mx-auto mt-8 pb-12 p-6 bg-white shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-all duration-300 ease-in-out text-center text-red-600">
            {error}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto mt-8 pb-12 p-6 bg-white shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4 border-slate-200 tracking-tight">My Auction Wins</h2>

            {wins.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium mb-4">You haven't won any auctions yet.</p>
                    <Link 
                        to="/auctions" 
                        className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
                    >
                        Browse Active Auctions
                    </Link>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {wins.map(win => (
                        <div 
                            key={win.id} 
                            className="py-4 hover:bg-slate-50 transition duration-200 px-2 rounded-md group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 pr-4">
                                    <h3 className="text-slate-800 font-semibold text-lg group-hover:text-indigo-700 transition duration-200">
                                        {win.auctionTitle}
                                    </h3>
                                    <p className="text-slate-600 text-sm mt-1 mb-2">
                                        {win.description?.substring(0, 100)}
                                        {win.description?.length > 100 ? '...' : ''}
                                    </p>
                                    <p className="text-slate-500 text-sm">
                                        Seller: {win.sellerName}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-600 font-bold text-lg">
                                        ₹{parseFloat(win.finalAmount).toLocaleString()}
                                    </p>
                                    <p className="text-slate-500 text-sm">
                                        Won on: {new Date(win.endTime).toLocaleDateString()} 
                                        {' '}at{' '}
                                        {new Date(win.endTime).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyWins;