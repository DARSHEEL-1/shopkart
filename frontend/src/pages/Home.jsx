import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to ShopKart 🛒
      </h1>
      <p className="text-gray-600 text-lg mb-8">
        Discover our catalog, manage your wishlist, and shop your favorite items seamlessly.
      </p>
      
      <div className="flex justify-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          Browse Products
        </button>
        <button
          onClick={() => navigate('/wishlist')}
          className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          View Wishlist ❤️
        </button>
      </div>
    </div>
  );
};

export default Home;