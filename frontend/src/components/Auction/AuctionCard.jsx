// src/components/Auction/AuctionCard.jsx
import { useState } from "react"
import { Link } from "react-router-dom"

const AuctionCard = ({ auction }) => {
  const [showImagePreview, setShowImagePreview] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-medium flex items-center">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5"></span>
            Pending
          </span>
        )
      case "active":
        return (
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium flex items-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
            Active
          </span>
        )
      case "ended":
        return (
          <span className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-full text-xs font-medium flex items-center">
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mr-1.5"></span>
            Ended
          </span>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const calculateTimeLeft = (endDate) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end - now

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h ${Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))}m left`
  }

  const ImagePreviewModal = () => {
    if (!showImagePreview) return null

    return (
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setShowImagePreview(false)}
      >
        <div
          className="relative max-w-4xl max-h-[90vh] w-full overflow-hidden rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
            onClick={() => setShowImagePreview(false)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <img
            src={auction.productImage || "/placeholder.svg"}
            alt={auction.title}
            className="w-full h-full object-contain shadow-2xl"
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/70 group">
        {/* Product Image */}
        <div
          className="h-56 overflow-hidden relative cursor-pointer"
          onClick={() => auction.productImage && setShowImagePreview(true)}
        >
          {auction.productImage ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <svg
                    className="w-5 h-5 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
              <img
                src={auction.productImage || "/placeholder.svg"}
                alt={auction.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </>
          ) : (
            <div className="bg-slate-50 h-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-200">
              {auction.title}
            </h3>
            {getStatusBadge(auction.status)}
          </div>

          <p className="text-slate-600 mb-4 text-sm line-clamp-2 leading-relaxed">{auction.description}</p>

          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">Starting price</p>
              <p className="text-xl font-bold text-indigo-600">₹{auction.startingPrice.toLocaleString("en-IN")}</p>
            </div>

            {auction.status === "active" && (
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium">Time remaining</p>
                <p className="text-sm font-medium text-slate-800 bg-slate-50 px-2 py-1 rounded-md">
                  {calculateTimeLeft(auction.endTime)}
                </p>
              </div>
            )}
          </div>

          <Link
            to={`/auctions/${auction.id}`}
            className="block text-center w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            View Details
          </Link>
        </div>
      </div>

      <ImagePreviewModal />
    </>
  )
}

export default AuctionCard

