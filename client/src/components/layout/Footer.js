import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold">ShopEase</span>
            </div>
            <p className="text-gray-300 mb-4">
              Your one-stop destination for all your shopping needs. We offer a wide range of products with competitive prices and excellent customer service.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-white"><FaFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin /></a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/products" className="hover:underline">Products</Link></li>
              <li><Link to="/cart" className="hover:underline">Cart</Link></li>
              <li><Link to="/profile" className="hover:underline">Profile</Link></li>
            </ul>
          </div>
          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>Electronics</li>
              <li>Clothing</li>
              <li>Books</li>
              <li>Home &amp; Garden</li>
              <li>Sports</li>
              <li>Beauty</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 