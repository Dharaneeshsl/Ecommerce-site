const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// In-memory cart storage (in production, use Redis or database)
const carts = new Map();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    const userCart = carts.get(req.user.id) || [];
    
    res.json({
      success: true,
      cart: userCart,
      totalItems: userCart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: userCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, [
  body('productId').isMongoId().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { productId, quantity } = req.body;

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Get user's current cart
    const userCart = carts.get(req.user.id) || [];

    // Check if product already in cart
    const existingItemIndex = userCart.findIndex(item => item.productId === productId);

    if (existingItemIndex > -1) {
      // Update quantity if product already exists
      const newQuantity = userCart[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock for requested quantity'
        });
      }
      
      userCart[existingItemIndex].quantity = newQuantity;
      userCart[existingItemIndex].totalPrice = product.price * newQuantity;
    } else {
      // Add new item to cart
      userCart.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || 'https://via.placeholder.com/150',
        quantity,
        totalPrice: product.price * quantity,
        stock: product.stock
      });
    }

    // Update cart in memory
    carts.set(req.user.id, userCart);

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      cart: userCart,
      totalItems: userCart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: userCart.reduce((sum, item) => sum + item.totalPrice, 0)
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
router.put('/:productId', protect, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Get user's current cart
    const userCart = carts.get(req.user.id) || [];
    const itemIndex = userCart.findIndex(item => item.productId === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Update quantity
    userCart[itemIndex].quantity = quantity;
    userCart[itemIndex].totalPrice = product.price * quantity;

    // Update cart in memory
    carts.set(req.user.id, userCart);

    res.json({
      success: true,
      message: 'Cart updated successfully',
      cart: userCart,
      totalItems: userCart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: userCart.reduce((sum, item) => sum + item.totalPrice, 0)
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    // Get user's current cart
    const userCart = carts.get(req.user.id) || [];
    const filteredCart = userCart.filter(item => item.productId !== productId);

    // Update cart in memory
    carts.set(req.user.id, filteredCart);

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      cart: filteredCart,
      totalItems: filteredCart.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: filteredCart.reduce((sum, item) => sum + item.totalPrice, 0)
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, (req, res) => {
  try {
    // Clear user's cart
    carts.delete(req.user.id);

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      cart: [],
      totalItems: 0,
      totalPrice: 0
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 