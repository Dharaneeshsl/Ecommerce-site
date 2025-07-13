const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('phone').optional().trim().isMobilePhone().withMessage('Please enter a valid phone number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, phone, addresses } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, addresses },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        addresses: user.addresses,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
router.post('/addresses', protect, [
  body('street').trim().notEmpty().withMessage('Street address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('country').trim().notEmpty().withMessage('Country is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { street, city, state, zipCode, country, isDefault } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // If this is the first address or isDefault is true, set all others to false
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: isDefault || user.addresses.length === 0
    });
    
    await user.save();

    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
router.put('/addresses/:addressId', protect, [
  body('street').optional().trim().notEmpty().withMessage('Street address is required'),
  body('city').optional().trim().notEmpty().withMessage('City is required'),
  body('state').optional().trim().notEmpty().withMessage('State is required'),
  body('zipCode').optional().trim().notEmpty().withMessage('Zip code is required'),
  body('country').optional().trim().notEmpty().withMessage('Country is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { addressId } = req.params;
    const updateData = req.body;
    
    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    // If setting as default, unset all others
    if (updateData.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    // Update the address
    Object.assign(user.addresses[addressIndex], updateData);
    await user.save();

    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
router.delete('/addresses/:addressId', protect, async (req, res) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user.id);
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    
    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    
    user.addresses.splice(addressIndex, 1);
    await user.save();

    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 