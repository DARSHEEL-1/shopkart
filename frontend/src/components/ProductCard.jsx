import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext'; // Import global cart state

const ProductCard = ({ product }) => {
  // Wishlist state
  const [wishlistStatus, setWishlistStatus] = useState('idle'); // 'idle' | 'saving' | 'success'
  const [wishlistError, setWishlistError] = useState('');

  // Cart state from Context
  const { cartItems, addToCart } = useCart();
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState('');

  // Check if product is already in the cart
  const isInCart = cartItems.some((item) => {
    const itemProductId = item.product?._id || item.product;
    return itemProductId === product._id;
  });

  const handleAddToWishlist = async () => {
    if (wishlistStatus === 'saving' || wishlistStatus === 'success') return;

    setWishlistStatus('saving');
    setWishlistError('');

    try {
      await axios.post(
        `http://localhost:5000/wishlist/${product._id}`,
        {},
        { withCredentials: true }
      );
      setWishlistStatus('success');
    } catch (err) {
      setWishlistStatus('idle');
      const message = err.response?.data?.message || 'Failed to add to wishlist';
      setWishlistError(message);
    }
  };

  const handleAddToCart = async () => {
    setCartLoading(true);
    setCartError('');

    const result = await addToCart(product._id);
    setCartLoading(false);

    if (!result.success) {
      setCartError(result.message);
    }
  };

  return (
    <div className="product-card border rounded-lg p-4 shadow-md bg-white flex flex-col justify-between">
      <div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="h-48 w-full object-cover rounded-md mb-3" 
        />
        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
        <p className="text-gray-600 font-semibold mt-1">₹{product.price}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{product.category}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {/* Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={cartLoading}
          className={`w-full py-2 px-4 rounded-md font-medium transition-all ${
            cartLoading
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : isInCart
              ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {cartLoading
            ? '⏳ Adding...'
            : isInCart
            ? '🛒 Add Another'
            : '🛒 Add to Cart'}
        </button>

        {cartError && (
          <p className="text-red-500 text-xs text-center">{cartError}</p>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleAddToWishlist}
          disabled={wishlistStatus === 'saving' || wishlistStatus === 'success'}
          className={`w-full py-2 px-4 rounded-md font-medium text-white transition-all ${
            wishlistStatus === 'success'
              ? 'bg-rose-500 hover:bg-rose-600'
              : wishlistStatus === 'saving'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gray-800 hover:bg-gray-900'
          }`}
        >
          {wishlistStatus === 'idle' && '♡ Add to Wishlist'}
          {wishlistStatus === 'saving' && '⏳ Saving...'}
          {wishlistStatus === 'success' && '♥ Added to Wishlist'}
        </button>

        {wishlistError && (
          <p className="text-red-500 text-xs text-center">{wishlistError}</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;