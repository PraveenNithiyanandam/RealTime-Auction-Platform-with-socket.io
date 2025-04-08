// src/Layout/Header/jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md border-b border-slate-100">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition duration-300 ease-in-out tracking-tight"
          >
            RealBid
          </Link>

          {/* Navigation Menu */}
          <nav className="flex items-center space-x-6">
            {/* Common Navigation Links */}
            <Link
              to="/"
              className="text-slate-700 hover:text-indigo-600 transition duration-200 font-medium"
            >
              Home
            </Link>

            {user ? (
              <>
                {/* Authenticated User Links */}
                <Link
                  to="/create-auction"
                  className="text-slate-700 hover:text-indigo-600 transition duration-200 font-medium"
                >
                  Create Auction
                </Link>
                <Link
                  to="/manage-auctions"
                  className="text-slate-700 hover:text-indigo-600 transition duration-200 font-medium"
                >
                  Manage Auctions
                </Link>
                <Link
                  to="/my-wins"
                  className="text-slate-700 hover:text-indigo-600 transition duration-200 font-medium"
                >
                  My Wins
                </Link>
                <Link
                  to="/winners"
                  className="text-slate-700 hover:text-indigo-600 transition duration-200 font-medium"
                >
                  Winners
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-slate-700 hover:text-indigo-600 transition duration-200">
                    {/* User Initial Avatar */}
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>

                    {/* Username */}
                    <span className="font-medium">
                      {user.email.split("@")[0]}
                    </span>

                    {/* Dropdown Chevron */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 z-20 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 hidden group-hover:block origin-top-right transform transition duration-200 ease-out">
                    <div className="py-2">
                      {/* User Details */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-slate-800">
                          {user.email.split("@")[0]}
                        </p>
                        <p className="text-sm text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Guest User Links */}
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-indigo-600 transition duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out font-medium shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
