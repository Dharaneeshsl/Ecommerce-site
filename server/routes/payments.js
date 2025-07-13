const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_key');
const paypal = require('paypal-rest-sdk');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID || 'your_paypal_client_id',
  client_secret: process.env.PAYPAL_CLIENT_SECRET || 'your_paypal_client_secret'
});

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-payment-intent
// @access  Private
router.post('/stripe/create-payment-intent', protect, async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment intent creation failed'
    });
  }
});

// @desc    Create PayPal payment
// @route   POST /api/payments/paypal/create-payment
// @access  Private
router.post('/paypal/create-payment', protect, async (req, res) => {
  try {
    const { amount, currency = 'USD' } = req.body;

    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/success`,
        cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/cancel`
      },
      transactions: [{
        item_list: {
          items: [{
            name: 'E-commerce Purchase',
            sku: 'item',
            price: amount,
            currency: currency,
            quantity: 1
          }]
        },
        amount: {
          currency: currency,
          total: amount
        },
        description: 'E-commerce purchase'
      }]
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error('PayPal payment creation error:', error);
        return res.status(500).json({
          success: false,
          message: 'PayPal payment creation failed'
        });
      }

      // Find approval URL
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url');

      res.json({
        success: true,
        paymentId: payment.id,
        approvalUrl: approvalUrl.href
      });
    });
  } catch (error) {
    console.error('PayPal payment error:', error);
    res.status(500).json({
      success: false,
      message: 'PayPal payment creation failed'
    });
  }
});

// @desc    Execute PayPal payment
// @route   POST /api/payments/paypal/execute-payment
// @access  Private
router.post('/paypal/execute-payment', protect, async (req, res) => {
  try {
    const { paymentId, payerId } = req.body;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [{
        amount: {
          currency: 'USD',
          total: '0.00' // This should be the actual amount from the order
        }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
      if (error) {
        console.error('PayPal payment execution error:', error);
        return res.status(500).json({
          success: false,
          message: 'PayPal payment execution failed'
        });
      }

      res.json({
        success: true,
        payment
      });
    });
  } catch (error) {
    console.error('PayPal execution error:', error);
    res.status(500).json({
      success: false,
      message: 'PayPal payment execution failed'
    });
  }
});

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
router.get('/methods', protect, (req, res) => {
  res.json({
    success: true,
    methods: [
      {
        id: 'stripe',
        name: 'Credit/Debit Card',
        description: 'Pay with Visa, MasterCard, American Express',
        icon: '💳'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        icon: '🅿️'
      }
    ]
  });
});

module.exports = router; 