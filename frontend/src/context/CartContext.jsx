import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('http://localhost:5000/cart', {
        withCredentials: true,
      });
      setCartItems(res.data.cart || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/cart/${productId}`,
        {},
        { withCredentials: true }
      );
      setCartItems(res.data.cart);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add item to cart';
      return { success: false, message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      setCartItems(res.data.cart);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update quantity';
      return { success: false, message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/cart/${productId}`, {
        withCredentials: true,
      });
      setCartItems(res.data.cart);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to remove item';
      return { success: false, message };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);