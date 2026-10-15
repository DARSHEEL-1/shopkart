import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await axios.get('http://localhost:5000/orders', {
        withCredentials: true,
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading your orders...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4 font-semibold">Unable to load your orders.</p>
        <button onClick={fetchOrders} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Try Again
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">You have not placed any orders yet.</h2>
        <p className="text-gray-500 mb-6">Explore our catalog and start shopping!</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-md hover:bg-indigo-700 transition font-medium"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => {
          const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b pb-3">
                <div>
                  <h3 className="font-bold text-gray-800">Order #{order._id}</h3>
                  <p className="text-xs text-gray-500">{formattedDate}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                  {order.status}
                </span>
              </div>

              <div className="space-y-1">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="text-sm text-gray-600 flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-bold text-gray-900">Total: ₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                <button
                  onClick={() => navigate(`/order-success/${order._id}`)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition"
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrdersPage;