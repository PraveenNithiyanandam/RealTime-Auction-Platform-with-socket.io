//src/components/Auction/WinnersList/jsx
import React, { useState, useEffect } from 'react';
import { getAuctionWinners } from '../../api/auctions';
import Card from '../UI/Card';

const WinnersList = () => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchWinners = async () => {
            try {
                const data = await getAuctionWinners();
                setWinners(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load winners. Please try again later.');
                setLoading(false);
            }
        };
        
        fetchWinners();
    }, []);
    
    if (loading) return (
        <div className="max-w-4xl mx-auto mt-8 pb-12 p-6 bg-white shadow-lg rounded-xl border border-slate-200">
            <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2 text-indigo-600">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-slate-700 font-medium">Loading auction winners...</span>
                </div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="max-w-4xl mx-auto mt-8 pb-12 p-6 bg-white shadow-lg rounded-xl border border-slate-200 text-center">
            <div className="text-red-500 py-8">{error}</div>
        </div>
    );
    
    return (
        <div className="max-w-4xl mx-auto mt-8 pb-12 p-6 bg-white shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-all duration-300 ease-in-out">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4 border-slate-200 tracking-tight">Auction Winners</h1>
            
            {winners.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">No auction winners available yet.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {winners.map(winner => (
                        <div 
                            key={winner.id} 
                            className="py-4 hover:bg-slate-50 transition duration-200 px-2 rounded-md group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-grow pr-4">
                                    <h2 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-700 transition duration-200">
                                        {winner.auctionTitle}
                                    </h2>
                                    <p className="text-slate-600 text-sm font-medium mt-1">
                                        Won by: <span className="text-slate-800">{winner.winnerName}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-green-600">
                                        ₹{parseFloat(winner.finalAmount).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {new Date(winner.endTime).toLocaleDateString()} at {new Date(winner.endTime).toLocaleTimeString()}
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

export default WinnersList;