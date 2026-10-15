import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, refreshCart } = useCart();
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingData({ ...shippingData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    const { fullName, phone, address, city, state, pincode } = shippingData;

    if (!fullName.trim()) errors.fullName = 'Full Name cannot be empty.';
    if (!phone.trim()) errors.phone = 'Phone Number cannot be empty.';
    if (!address.trim()) errors.address = 'Address Line cannot be empty.';
    if (!city.trim()) errors.city = 'City cannot be empty.';
    if (!state.trim()) errors.state = 'State cannot be empty.';
    if (!pincode.trim()) errors.pincode = 'Pincode cannot be empty.';

    const phoneRegex = /^\+?[0-9]{10,12}$/;
    if (phone.trim() && !phoneRegex.test(phone.trim().replace(/[\s-]/g, ''))) {
      errors.phone = 'Please enter a valid phone number.';
    }

    const pincodeRegex = /^\d{6}$/;
    if (pincode.trim() && !pincodeRegex.test(pincode.trim())) {
      errors.pincode = 'Pincode must contain 6 digits.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      // 1. Create backend pending order & payment session
      const res = await axios.post(
        'http://localhost:5000/orders/create-payment-order',
        {
          shippingAddress: {
            fullName: shippingData.fullName.trim(),
            phone: shippingData.phone.trim(),
            addressLine1: shippingData.address.trim(),
            city: shippingData.city.trim(),
            state: shippingData.state.trim(),
            pincode: shippingData.pincode.trim(),
          },
        },
        { withCredentials: true }
      );

      const { orderId } = res.data;

      // 2. Simulate or execute payment verification (Razorpay mock flow)
      const verifyRes = await axios.post(
        'http://localhost:5000/orders/verify-payment',
        { orderId },
        { withCredentials: true }
      );

      await refreshCart();
      navigate(`/order-success/${verifyRes.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="space-y-8" noValidate>
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
            Shipping Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={shippingData.fullName}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  fieldErrors.fullName ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={shippingData.phone}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  fieldErrors.phone ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {fieldErrors.phone && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
              <input
                type="text"
                name="address"
                value={shippingData.address}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  fieldErrors.address ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {fieldErrors.address && <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={shippingData.city}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  fieldErrors.city ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {fieldErrors.city && <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={shippingData.state}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  fieldErrors.state ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {fieldErrors.state && <p className="text-red-500 text-xs mt-1">{fieldErrors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                maxLength={6}
                value={shippingData.pincode}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  fieldErrors.pincode ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500'
                }`}
              />
              {fieldErrors.pincode && <p className="text-red-500 text-xs mt-1">{fieldErrors.pincode}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            {cartItems.map((item) => {
              const product = item.product || {};
              const itemTotal = (product.price || 0) * item.quantity;
              return (
                <div key={product._id} className="flex justify-between items-center text-gray-700">
                  <span>
                    {product.name} × {item.quantity}
                  </span>
                  <span className="font-semibold">₹{itemTotal.toLocaleString('en-IN')}</span>
                </div>
              );
            })}

            <div className="border-t pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || cartItems.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;