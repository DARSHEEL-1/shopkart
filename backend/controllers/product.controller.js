const Product = require('../models/product.model');
const mongoose = require('mongoose');

// @desc    Create a product
// @route   POST /products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Validation checks
    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required field' });
    }
    if (price <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid price. Must be greater than 0' });
    }
    if (stock < 0) {
      return res.status(400).json({ success: false, message: 'Invalid stock. Cannot be negative' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all products with search, category filtering, and sorting
// @route   GET /products
exports.getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    let query = {};

    // Search filter (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    let queryBuilder = Product.find(query);

    // Bonus: Sorting by price
    if (sort === 'price_asc') {
      queryBuilder = queryBuilder.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      queryBuilder = queryBuilder.sort({ price: -1 });
    }

    const products = await queryBuilder;

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};