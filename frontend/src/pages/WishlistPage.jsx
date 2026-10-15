import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/wishlist', {
        withCredentials: true,
      });
      setWishlist(response.data.wishlist);
    } catch (err) {
      setError('Unable to load wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/wishlist/${productId}`, {
        withCredentials: true,
      });
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      alert('Failed to remove product from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 font-medium">Loading your wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-semibold mb-4">Unable to load wishlist.</p>
        <button
          onClick={fetchWishlist}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your wishlist is empty ❤️
        </h2>
        <p className="text-gray-500 mb-6">Start saving products you love.</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 transition font-medium"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between p-4"
          >
            <div>
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-md mb-3"
              />
              <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
              <p className="text-gray-600 font-bold mt-1">₹{product.price}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                {product.category}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => navigate(`/products/${product._id}`)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md font-medium text-sm transition"
              >
                View Details
              </button>
              <button
                onClick={() => handleRemove(product._id)}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 rounded-md font-medium text-sm transition"
              >
                Remove from Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;