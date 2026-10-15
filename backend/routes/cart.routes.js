const express = require('express');
const router = express.Router();
const { 
  addToCart, 
  getCart, 
  updateCartQuantity,
  removeFromCart 
} = require('../controllers/cart.controller');
const { protect: authMiddleware } = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, getCart);
router.post('/:productId', authMiddleware, addToCart);
router.patch('/:productId', authMiddleware, updateCartQuantity);
router.delete('/:productId', authMiddleware, removeFromCart);

module.exports = router;