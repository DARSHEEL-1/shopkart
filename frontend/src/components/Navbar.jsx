import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Navbar = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    try {
      // Adjust endpoint if your backend route differs (e.g., /customers/logout or /auth/logout)
      await axios.post('http://localhost:5000/customers/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Fallback redirect even if request fails
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link to="/home" className="text-xl font-bold text-indigo-600">
          ShopKart
        </Link>
        <Link to="/products" className="text-gray-600 hover:text-indigo-600 font-medium">
          Products
        </Link>
        <Link to="/wishlist" className="text-gray-600 hover:text-indigo-600 font-medium">
          Wishlist
        </Link>
        <Link to="/cart" className="text-gray-600 hover:text-indigo-600 font-medium relative">
          Cart
          {totalCartItems > 0 && (
            <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </Link>
        <Link to="/orders" className="text-gray-600 hover:text-indigo-600 font-medium">
          My Orders
        </Link>
      </div>

      <div>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-rose-600 font-medium transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;