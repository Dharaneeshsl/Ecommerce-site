import api from './api';

class PaymentService {
  // Create Stripe payment intent
  async createStripePaymentIntent(paymentData) {
    try {
      const response = await api.post('/payments/stripe/create-payment-intent', paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Confirm Stripe payment
  async confirmStripePayment(paymentIntentId, paymentMethodId) {
    try {
      const response = await api.post('/payments/stripe/confirm-payment', {
        paymentIntentId,
        paymentMethodId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create PayPal order
  async createPayPalOrder(orderData) {
    try {
      const response = await api.post('/payments/paypal/create-order', orderData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Capture PayPal payment
  async capturePayPalPayment(orderId) {
    try {
      const response = await api.post('/payments/paypal/capture-payment', { orderId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get payment methods for user
  async getPaymentMethods() {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Save payment method
  async savePaymentMethod(paymentMethodData) {
    try {
      const response = await api.post('/payments/methods', paymentMethodData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete payment method
  async deletePaymentMethod(methodId) {
    try {
      const response = await api.delete(`/payments/methods/${methodId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get payment history
  async getPaymentHistory() {
    try {
      const response = await api.get('/payments/history');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Request refund
  async requestRefund(paymentId, refundData) {
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, refundData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Validate payment data
  validatePaymentData(paymentData, method) {
    const errors = {};

    if (method === 'stripe') {
      // Validate card number
      const cardNumber = paymentData.cardNumber.replace(/\s/g, '');
      if (!cardNumber.match(/^\d{16}$/)) {
        errors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      // Validate cardholder name
      if (!paymentData.cardName.trim()) {
        errors.cardName = 'Cardholder name is required';
      }

      // Validate expiry date
      if (!paymentData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        errors.expiryDate = 'Please enter expiry date in MM/YY format';
      }

      // Validate CVV
      if (!paymentData.cvv.match(/^\d{3,4}$/)) {
        errors.cvv = 'Please enter a valid CVV';
      }
    } else if (method === 'paypal') {
      // Validate PayPal email
      if (!paymentData.email || !paymentData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = 'Please enter a valid email address';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Format card number with spaces
  formatCardNumber(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleaned;
    }
  }

  // Get card type from number
  getCardType(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    
    // Visa
    if (/^4/.test(cleaned)) {
      return 'visa';
    }
    // Mastercard
    if (/^5[1-5]/.test(cleaned)) {
      return 'mastercard';
    }
    // American Express
    if (/^3[47]/.test(cleaned)) {
      return 'amex';
    }
    // Discover
    if (/^6(?:011|5)/.test(cleaned)) {
      return 'discover';
    }
    
    return 'unknown';
  }

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Payment processing failed';
      return new Error(message);
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error('An unexpected error occurred during payment processing.');
    }
  }

  // Check if payment method is supported
  isPaymentMethodSupported(method) {
    const supportedMethods = ['stripe', 'paypal'];
    return supportedMethods.includes(method);
  }

  // Get payment method display name
  getPaymentMethodDisplayName(method) {
    const displayNames = {
      'stripe': 'Credit Card',
      'paypal': 'PayPal',
      'apple_pay': 'Apple Pay',
      'google_pay': 'Google Pay'
    };
    return displayNames[method] || method;
  }

  // Get payment method icon
  getPaymentMethodIcon(method) {
    const icons = {
      'stripe': 'credit-card',
      'paypal': 'paypal',
      'apple_pay': 'apple',
      'google_pay': 'google'
    };
    return icons[method] || 'credit-card';
  }

  // Validate amount
  validateAmount(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new Error('Invalid amount');
    }
    return true;
  }

  // Calculate fees
  calculateFees(amount, method) {
    const fees = {
      'stripe': {
        percentage: 0.029,
        fixed: 0.30
      },
      'paypal': {
        percentage: 0.029,
        fixed: 0.30
      }
    };

    const fee = fees[method];
    if (!fee) {
      return 0;
    }

    return (amount * fee.percentage) + fee.fixed;
  }

  // Get payment status color
  getPaymentStatusColor(status) {
    const colors = {
      'pending': 'yellow',
      'processing': 'blue',
      'succeeded': 'green',
      'failed': 'red',
      'cancelled': 'gray',
      'refunded': 'purple'
    };
    return colors[status] || 'gray';
  }

  // Get payment status text
  getPaymentStatusText(status) {
    const statusTexts = {
      'pending': 'Pending',
      'processing': 'Processing',
      'succeeded': 'Successful',
      'failed': 'Failed',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded'
    };
    return statusTexts[status] || status;
  }
}

export default new PaymentService(); 