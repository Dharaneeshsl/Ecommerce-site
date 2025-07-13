import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          {/* 404 Icon */}
          <div className="text-6xl mb-4">😕</div>
          
          {/* Error Code */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          {/* Error Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="w-full btn btn-primary btn-lg flex items-center justify-center"
            >
              <FaHome className="mr-2" />
              Go to Homepage
            </Link>
            
            <Link
              to="/products"
              className="w-full btn btn-outline btn-lg flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Browse Products
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="w-full btn btn-secondary btn-lg flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/products?category=Electronics"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Electronics
              </Link>
              <Link
                to="/products?category=Clothing"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Clothing
              </Link>
              <Link
                to="/products?category=Books"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Books
              </Link>
              <Link
                to="/products?category=Home & Garden"
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Home & Garden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 