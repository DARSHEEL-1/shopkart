const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { protect } = require('../middlewares/auth.middleware');

// Safely reference functions from the imported controller object
router.get('/', protect, wishlistController.getWishlist);
router.post('/:productId', protect, wishlistController.addToWishlist);
router.delete('/:productId', protect, wishlistController.removeFromWishlist);

module.exports = router;