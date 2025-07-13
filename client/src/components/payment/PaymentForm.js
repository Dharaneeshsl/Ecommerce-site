import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaPaypal, FaLock, FaShieldAlt } from 'react-icons/fa';
import PaymentService from '../../services/paymentService';
import { toast } from 'react-toastify';

const PaymentForm = ({ orderData, onPaymentSuccess, onPaymentError, loading, setLoading }) => {
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [stripeCard, setStripeCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [paypalEmail, setPaypalEmail] = useState('');
  const [errors, setErrors] = useState({});

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setErrors({});
  };

  const validateStripeForm = () => {
    const newErrors = {};
    
    if (!stripeCard.number.replace(/\s/g, '').match(/^\d{16}$/)) {
      newErrors.number = 'Please enter a valid 16-digit card number';
    }
    
    if (!stripeCard.expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiry = 'Please enter expiry date in MM/YY format';
    }
    
    if (!stripeCard.cvc.match(/^\d{3,4}$/)) {
      newErrors.cvc = 'Please enter a valid CVC';
    }
    
    if (!stripeCard.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayPalForm = () => {
    const newErrors = {};
    
    if (!paypalEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStripePayment = async () => {
    if (!validateStripeForm()) return;
    
    try {
      setLoading(true);
      
      // Create payment intent
      const paymentIntent = await PaymentService.createStripePaymentIntent({
        amount: Math.round(orderData.totalAmount * 100), // Convert to cents
        currency: 'usd'
      });
      
      // In a real app, you would use Stripe Elements or Stripe.js
      // For demo purposes, we'll simulate a successful payment
      const paymentResult = {
        id: paymentIntent.id,
        status: 'succeeded',
        method: 'stripe',
        amount: orderData.totalAmount
      };
      
      onPaymentSuccess(paymentResult);
    } catch (error) {
      console.error('Stripe payment error:', error);
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalPayment = async () => {
    if (!validatePayPalForm()) return;
    
    try {
      setLoading(true);
      
      // Create PayPal order
      const paypalOrder = await PaymentService.createPayPalOrder({
        amount: orderData.totalAmount,
        currency: 'USD'
      });
      
      // In a real app, you would redirect to PayPal
      // For demo purposes, we'll simulate a successful payment
      const paymentResult = {
        id: paypalOrder.id,
        status: 'completed',
        method: 'paypal',
        amount: orderData.totalAmount
      };
      
      onPaymentSuccess(paymentResult);
    } catch (error) {
      console.error('PayPal payment error:', error);
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'stripe') {
      handleStripePayment();
    } else {
      handlePayPalPayment();
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <FaCreditCard className="mr-2 text-blue-600" />
        Payment Method
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose Payment Method
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('stripe')}
              className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-3 transition-colors ${
                paymentMethod === 'stripe'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FaCreditCard className={`text-xl ${
                paymentMethod === 'stripe' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className={`font-medium ${
                paymentMethod === 'stripe' ? 'text-blue-600' : 'text-gray-700'
              }`}>
                Credit Card
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => handlePaymentMethodChange('paypal')}
              className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-3 transition-colors ${
                paymentMethod === 'paypal'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FaPaypal className={`text-xl ${
                paymentMethod === 'paypal' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className={`font-medium ${
                paymentMethod === 'paypal' ? 'text-blue-600' : 'text-gray-700'
              }`}>
                PayPal
              </span>
            </button>
          </div>
        </div>

        {/* Stripe Payment Form */}
        {paymentMethod === 'stripe' && (
          <div className="space-y-4">
            <div>
              <label className="form-label">Card Number</label>
              <input
                type="text"
                value={stripeCard.number}
                onChange={(e) => setStripeCard(prev => ({
                  ...prev,
                  number: formatCardNumber(e.target.value)
                }))}
                className={`form-input ${errors.number ? 'border-red-500' : ''}`}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">{errors.number}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Expiry Date</label>
                <input
                  type="text"
                  value={stripeCard.expiry}
                  onChange={(e) => setStripeCard(prev => ({
                    ...prev,
                    expiry: formatExpiry(e.target.value)
                  }))}
                  className={`form-input ${errors.expiry ? 'border-red-500' : ''}`}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiry && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                )}
              </div>
              
              <div>
                <label className="form-label">CVC</label>
                <input
                  type="text"
                  value={stripeCard.cvc}
                  onChange={(e) => setStripeCard(prev => ({
                    ...prev,
                    cvc: e.target.value.replace(/\D/g, '')
                  }))}
                  className={`form-input ${errors.cvc ? 'border-red-500' : ''}`}
                  placeholder="123"
                  maxLength="4"
                />
                {errors.cvc && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvc}</p>
                )}
              </div>
              
              <div>
                <label className="form-label">Cardholder Name</label>
                <input
                  type="text"
                  value={stripeCard.name}
                  onChange={(e) => setStripeCard(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  className={`form-input ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PayPal Payment Form */}
        {paymentMethod === 'paypal' && (
          <div>
            <label className="form-label">PayPal Email</label>
            <input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="your-email@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              You will be redirected to PayPal to complete your payment
            </p>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <FaShieldAlt className="text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Secure Payment</p>
              <p className="text-xs text-gray-600 mt-1">
                Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">
              ${orderData.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <FaLock className="mr-2" />
                Pay ${orderData.totalAmount.toFixed(2)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm; 