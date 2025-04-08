// src/components/Bid/BidForm/jsx
import React, { useState } from 'react';
import { placeBid } from '../../api/bids';
import { getSocketInstance } from '../../utils/socket';

const BidForm = ({ auctionId, currentPrice, token, bidderId, isHighestBidder }) => {
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const minBid = parseFloat(currentPrice) + 0.01;
    
    const handleChange = (e) => {
        setBidAmount(e.target.value);
        
        setError('');
        setSuccess('');
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        
        if (parseFloat(bidAmount) <= parseFloat(currentPrice)) {
            setError(`Bid must be greater than the current price of ₹${currentPrice}`);
            setLoading(false);
            return;
        }
        
        try {
            const socket = getSocketInstance();
            socket.emit('placeBid', {
                auctionId,
                bidderId,
                amount: parseFloat(bidAmount)
            });
            
            await placeBid({ auctionId, amount: parseFloat(bidAmount) }, token);
            
            setSuccess(`Bid of ₹${bidAmount} placed successfully!`);
            setBidAmount('');
        } catch (error) {
            setError(error.message || 'Failed to place bid. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    if (isHighestBidder) {
        return (
            <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-700">
                    You are currently the highest bidder. No need to bid again unless someone outbids you.
                </p>
            </div>
        );
    }
    
    return (
        <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Place Your Bid</h3>
            
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-gray-600">Minimum bid</p>
                        <p className="text-xl font-bold">₹{minBid.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-600">Current price</p>
                        <p className="text-xl font-bold text-blue-600">₹{currentPrice}</p>
                    </div>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="font-medium mb-2">Your bid amount (₹)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500">₹</span>
                        </div>
                        <input
                            type="number"
                            value={bidAmount}
                            onChange={handleChange}
                            min={minBid.toFixed(2)}
                            step="0.01"
                            required
                            disabled={loading}
                            placeholder={`${minBid.toFixed(2)} or higher`}
                            className="w-full p-3 pl-8 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg transition duration-200 disabled:bg-blue-300"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Placing Bid...
                        </span>
                    ) : (
                        'Place Bid'
                    )}
                </button>
            </form>
        </div>
    );
};

export default BidForm;