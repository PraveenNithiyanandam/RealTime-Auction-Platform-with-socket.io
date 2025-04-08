// src/components/Auction/AuctionList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuctions } from '../../api/auctions';
import AuctionCard from './AuctionCard';

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const data = await getAuctions();
                setAuctions(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load auctions. Please try again later.');
                setLoading(false);
            }
        };
        
        fetchAuctions();
    }, []);
    
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex items-center space-x-3">
                <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-slate-700 font-medium text-xl">Loading auctions...</span>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
            <div className="text-center p-8 bg-white shadow-lg rounded-xl border border-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-600 text-xl font-semibold mb-2">Auction Loading Error</p>
                <p className="text-slate-600">{error}</p>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10 border-b pb-4 border-slate-200">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Auctions
                        <span className="ml-3 text-base text-slate-500 font-normal">({auctions.length} available)</span>
                    </h1>
                    <Link 
                        to="/create-auction" 
                        className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        Create Auction
                    </Link>
                </div>
                
                {auctions.length === 0 ? (
                    <div className="text-center py-16 bg-white shadow-lg rounded-xl border border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xl text-slate-600 font-medium">No auctions available right now.</p>
                        <p className="text-slate-500 mt-2">Check back later or create a new auction.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {auctions.map(auction => (
                            <div key={auction.id} className="transform transition duration-300 hover:scale-105 hover:shadow-xl">
                                <AuctionCard auction={auction} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuctionList;