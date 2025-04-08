// src/components/Auction/BidHistory.jsx
import React from 'react';

const BidHistory = ({ 
  bids, 
  bidsLoading, 
  user 
}) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 pb-12 p-6 bg-white shadow-lg rounded-xl border border-slate-200 hover:shadow-xl transition-all duration-300 ease-in-out">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4 border-slate-200 tracking-tight">Bid History</h2>

      {bidsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2 text-indigo-600">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-slate-700 font-medium">Loading bid history...</span>
          </div>
        </div>
      ) : bids.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="font-medium">No bids placed yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {bids.map((bid) => (
            <div
              key={bid.id || `bid-${bid.amount}-${bid.timestamp}`}
              className="py-4 hover:bg-slate-50 transition duration-200 px-2 rounded-md group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold 
                    ${user && bid.bidderId === user.id 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'bg-slate-100 text-slate-600'}`
                  }>
                    {user && bid.bidderId === user.id 
                      ? 'You' 
                      : bid.bidderName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 group-hover:text-indigo-700 transition duration-200">
                      {user && bid.bidderId === user.id
                        ? "Your Bid"
                        : bid.bidderName || "User Bid"}
                    </p>
                    <p className="text-slate-600 text-sm font-medium">₹{bid.amount.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-slate-500 text-sm">
                  {new Date(bid.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidHistory;