const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Customer = require('../models/customer.model');

// 1. Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyExists = user.wishlist.some(
      (id) => id.toString() === productId
    );
    if (alreadyExists) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
    });
  } catch (err) {
    console.error('Error adding product to wishlist:', err);
    return res.status(500).json({ message: 'Server error while updating wishlist' });
  }
};

// 2. Get current user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await Customer.findById(userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    return res.status(500).json({ message: 'Server error while fetching wishlist' });
  }
};

// 3. Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const user = await Customer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.wishlist.findIndex(
      (id) => id.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({ message: 'Product not in wishlist' });
    }

    user.wishlist.splice(index, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
    });
  } catch (err) {
    console.error('Error removing product from wishlist:', err);
    return res.status(500).json({ message: 'Server error while removing from wishlist' });
  }
};