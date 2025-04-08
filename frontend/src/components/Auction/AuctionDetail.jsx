// src/components/Auction/AuctionDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { getAuctionById } from "../../api/auctions";
import { getUserById } from "../../api/users";
import { getBidsByAuctionId } from "../../api/bids"; 
import { AuthContext } from "../../context/AuthContext";
import BidForm from "../Bid/BidForm";
import BidHistory from "./BidHistory"; 
import { getSocketInstance, joinAuctionRoom } from "../../utils/socket";

const AuctionDetail = () => {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bids, setBids] = useState([]);
  const [timeLeft, setTimeLeft] = useState("");
  const [animateBid, setAnimateBid] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnerLoading, setWinnerLoading] = useState(false);
  const [bidsLoading, setBidsLoading] = useState(false); 

  const isOwner = user && auction && user.id === auction.sellerId;
  const isActive = auction && auction.status === "active";
  const isEnded = auction && auction.status === "ended";
  const isHighestBidder =
    user && auction && user.id === auction.highestBidderId;

  const loadBidHistory = async () => {
    try {
      setBidsLoading(true);
      const bidHistory = await getBidsByAuctionId(id);
      setBids(bidHistory);
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setBidsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAuctionDetails = async () => {
      try {
        const data = await getAuctionById(id);
        setAuction(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching auction:", error);
        setError("Failed to load auction details. Please try again later.");
        setLoading(false);
      }
    };

    fetchAuctionDetails();
  }, [id]);

  useEffect(() => {
    if (!auction) return; 
    loadBidHistory();
  }, [id, auction]);

  useEffect(() => {
    const socket = getSocketInstance();

    joinAuctionRoom(id);

    socket.on("joinedAuction", (data) => {
      console.log("Joined auction:", data);
    });

    socket.on("newBid", (data) => {
      console.log("New bid received:", data);

      setAuction((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentPrice: data.amount,
          highestBidderId: data.bidderId,
          highestBidderName: data.bidderName,
        };
      });

      setBids((prev) => [
        {
          id: Date.now(), 
          auctionId: data.auctionId,
          bidderId: data.bidderId,
          bidderName: data.bidderName,
          amount: data.amount,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);

      setAnimateBid(true);
      setTimeout(() => setAnimateBid(false), 2000);
      
      setTimeout(() => {
        loadBidHistory();
      }, 1000);
    });

    socket.on("auctionEnded", (data) => {
      console.log("Auction ended:", data);
      setAuction((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: "ended",
          winnerId: data.winnerId,
          finalPrice: data.finalPrice,
        };
      });
      
      loadBidHistory();
    });

    return () => {
      socket.off("joinedAuction");
      socket.off("newBid");
      socket.off("auctionEnded");
    };
  }, [id]); 

  useEffect(() => {
    if (bids.length > 0) {
      setAnimateBid(true);
      const timer = setTimeout(() => setAnimateBid(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [bids.length]);

  useEffect(() => {
    if (!auction || auction.status !== "active") return;

    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("Ended");
        getAuctionById(id)
          .then((data) => {
            setAuction(data);
            return getBidsByAuctionId(id);
          })
          .then((bidHistory) => {
            setBids(bidHistory);
          })
          .catch((err) => {
            console.error("Error refreshing auction data:", err);
          });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${days > 0 ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [auction, id]);

  useEffect(() => {
    if (isEnded && auction?.winnerId) {
      if (user && auction.winnerId === user.id) {
        setWinner({
          id: user.id,
          name: user.name || user.email?.split("@")[0],
          isCurrentUser: true,
        });
        return;
      }

      setWinnerLoading(true);
      getUserById(auction.winnerId)
        .then((userData) => {
          setWinner({
            id: userData.id,
            name: userData.name || userData.email?.split("@")[0],
            isCurrentUser: false,
          });
        })
        .catch((err) => {
          console.error("Error fetching winner data:", err);
          setWinner({
            id: auction.winnerId,
            name: auction.highestBidderName || "Winner", 
            isCurrentUser: false,
          });
        })
        .finally(() => {
          setWinnerLoading(false);
        });
    }
  }, [isEnded, auction?.winnerId, user, auction?.highestBidderName]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading auction details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 text-xl font-semibold mb-2">Auction Load Error</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );

  if (!auction)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 text-xl">Auction not found</p>
        </div>
      </div>
    );

  const getWinnerDisplayName = () => {
    if (winner?.isCurrentUser) {
      return "You won this auction! 🎉";
    }
    
    if (winner?.name) {
      return winner.name;
    }
    
    if (auction.highestBidderName) {
      return auction.highestBidderName;
    }
    
    return "Winner";
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">{auction.title}</h1>
            <div>
              {auction.status === "pending" && (
                <span className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full font-semibold">
                  Pending
                </span>
              )}
              {auction.status === "active" && (
                <span className="px-4 py-2 bg-green-400 text-green-900 rounded-full font-semibold">
                  Active
                </span>
              )}
              {auction.status === "ended" && (
                <span className="px-4 py-2 bg-gray-400 text-gray-900 rounded-full font-semibold">
                  Ended
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <div className="space-y-6">
            {isActive && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">
                      Auction in Progress
                    </h3>
                    <p className="text-blue-600">Place your bid before time runs out</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-800">{timeLeft}</div>
                    <p className="text-sm text-blue-600">remaining</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-100 rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 mb-1">Current Bid</p>
                  <p className={`text-3xl font-bold text-indigo-600 ${animateBid ? 'animate-pulse' : ''}`}>
                    ₹{auction.currentPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Starting Price: ₹{auction.startingPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600 mb-1">Total Bids</p>
                  <p className="text-3xl font-bold text-indigo-600">{bids.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {auction.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {isEnded && auction.winnerId && (
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <h3 className="text-2xl font-bold text-green-800 mb-4">
                  Auction Concluded
                </h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-green-700 font-medium">Winner</p>
                    {winnerLoading ? (
                      <p className="text-xl font-bold text-green-800">
                        Loading winner...
                      </p>
                    ) : (
                      <p className="text-xl font-bold text-green-800">
                        {getWinnerDisplayName()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-green-700 font-medium">Final Price</p>
                    <p className="text-2xl font-bold text-green-800">
                      ₹{(auction.finalPrice || auction.currentPrice).toLocaleString()}
                    </p>
                  </div>
                </div>

                {winner?.isCurrentUser && (
                  <div className="mt-4 bg-white p-4 rounded-lg shadow-inner">
                    <p className="font-semibold text-green-900">
                      Congratulations on winning this auction!
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      The seller will contact you soon with payment and delivery details.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Auction Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-600">Start Time</p>
                  <p className="text-gray-800">{formatDate(auction.startTime)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">End Time</p>
                  <p className="text-gray-800">{formatDate(auction.endTime)}</p>
                </div>
                {isHighestBidder && (
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="text-green-800 font-semibold">
                      You are currently the highest bidder!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-100 border-t">
          {isActive && user && !isOwner && (
            <BidForm
              auctionId={auction.id}
              currentPrice={auction.currentPrice}
              token={token}
              bidderId={user.id}
              isHighestBidder={isHighestBidder}
            />
          )}

          {isOwner && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <p className="text-yellow-800">
                You created this auction. You cannot place bids on your own auction.
              </p>
            </div>
          )}

          {!user && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-800">
                Please log in to place bids on this auction.
              </p>
            </div>
          )}

          {isEnded && (
            <div className="bg-gray-200 border-l-4 border-gray-500 p-4 rounded-r-lg">
              <p className="text-gray-800">
                This auction has ended and is no longer accepting bids.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 pb-12">
          <BidHistory 
            bids={bids} 
            bidsLoading={bidsLoading} 
            user={user} 
          />
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;

