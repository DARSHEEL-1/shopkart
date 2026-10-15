const Customer = require('../models/customer.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const crypto = require('crypto');

exports.createPaymentOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const user = await Customer.findById(userId).populate('cart.product');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of user.cart) {
      const productDoc = item.product;
      if (!productDoc) {
        return res.status(404).json({ success: false, message: 'Product no longer exists' });
      }

      if (item.quantity > productDoc.stock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${productDoc.name}`,
        });
      }

      calculatedTotal += productDoc.price * item.quantity;
      orderItems.push({
        product: productDoc._id,
        name: productDoc.name,
        price: productDoc.price,
        quantity: item.quantity,
        image: productDoc.image || '',
      });
    }

    const newOrder = new Order({
      user: userId,
      orderItems,
      shippingAddress: {
        address: shippingAddress.address || shippingAddress.addressLine1,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.pincode || shippingAddress.postalCode,
        country: shippingAddress.country || 'India',
      },
      totalAmount: calculatedTotal,
      status: 'Pending',
    });

    await newOrder.save();

    const amountInPaise = Math.round(calculatedTotal * 100);
    const mockRazorpayOrderId = `order_${crypto.randomBytes(12).toString('hex')}`;

    return res.status(200).json({
      success: true,
      razorpayOrderId: mockRazorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error('Error creating payment order:', err);
    return res.status(500).json({ success: false, message: 'Server error while creating payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = 'PLACED';
    await order.save();

    const user = await Customer.findById(userId);
    if (user) {
      user.cart = [];
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and cart cleared',
      order,
    });
  } catch (err) {
    console.error('Error verifying payment:', err);
    return res.status(500).json({ success: false, message: 'Server error during payment verification' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ success: false, message: 'Server error while fetching orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden access to order' });
    }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error('Error fetching order details:', err);
    return res.status(500).json({ success: false, message: 'Server error while fetching order details' });
  }
};