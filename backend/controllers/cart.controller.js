const mongoose = require('mongoose');
const Customer = require('../models/customer.model');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await Customer.findById(userId).populate('cart.product');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    console.error('Error fetching cart:', err);
    return res.status(500).json({ message: 'Server error while fetching cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const user = await Customer.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    await user.populate('cart.product');

    return res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    console.error('Error adding to cart:', err);
    return res.status(500).json({ message: 'Server error while adding to cart' });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    const user = await Customer.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cartItem = user.cart.find((item) => item.product.toString() === productId);
    if (!cartItem) return res.status(404).json({ message: 'Product not in cart' });

    cartItem.quantity = quantity;
    await user.save();
    await user.populate('cart.product');

    return res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    return res.status(500).json({ message: 'Server error while updating quantity' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const user = await Customer.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Product not in cart' });
    }

    user.cart.splice(cartItemIndex, 1);
    await user.save();
    await user.populate('cart.product');

    return res.status(200).json({ success: true, cart: user.cart });
  } catch (err) {
    console.error('Error removing product from cart:', err);
    return res.status(500).json({ message: 'Server error while removing product' });
  }
};