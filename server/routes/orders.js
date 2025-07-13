const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, [
  body('orderItems').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('shippingInfo').isObject().withMessage('Shipping information is required'),
  body('paymentInfo').isObject().withMessage('Payment information is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { orderItems, shippingInfo, paymentInfo } = req.body;

    // Calculate prices
    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxPrice = itemsPrice * 0.1; // 10% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      orderItems,
      user: req.user.id,
      paymentInfo,
      paidAt: Date.now(),
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingInfo
    });

    // Update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.updateStock(item.quantity);
      }
    }

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'name images');

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 