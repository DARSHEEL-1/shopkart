import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, loading, error, updateQuantity, removeFromCart, refreshCart } = useCart();
  const navigate = useNavigate();

  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleIncrement = (item) => {
    const nextQty = item.quantity + 1;
    if (item.product?.stock && nextQty > item.product.stock) {
      alert('Cannot exceed available stock');
      return;
    }
    updateQuantity(item.product._id, nextQty);
  };

  const handleDecrement = (item) => {
    if (item.quantity <= 1) return;
    updateQuantity(item.product._id, item.quantity - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-600 font-medium text-lg">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <p className="text-red-500 font-semibold mb-4 text-lg">Unable to load your cart.</p>
        <button
          onClick={refreshCart}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty 🛒</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const product = item.product || {};
            const itemTotal = (product.price || 0) * item.quantity;

            return (
              <div
                key={product._id || item._id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 font-medium">₹{product.price?.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 w-full sm:w-auto justify-between">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      onClick={() => handleDecrement(item)}
                      disabled={item.quantity <= 1}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 transition"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => handleIncrement(item)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-bold text-gray-900 text-lg">
                    ₹{itemTotal.toLocaleString('en-IN')}
                  </p>

                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Items:</span>
              <span className="font-semibold text-gray-900">{totalItemsCount}</span>
            </div>
            <div className="flex justify-between text-gray-800 text-lg font-bold">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;