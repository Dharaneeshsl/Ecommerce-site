import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaCreditCard, FaPaypal, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import PaymentForm from '../payment/PaymentForm';
import OrderService from '../../services/orderService';
import { clearCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';

const CheckoutForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    items: [],
    shippingAddress: {},
    paymentMethod: 'stripe',
    totalAmount: 0
  });

  const { items, totalPrice } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const subtotal = totalPrice;
    const tax = subtotal * 0.1;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    setOrderData(prev => ({
      ...prev,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: total
    }));
  }, [items, totalPrice, navigate]);

  const handleShippingSubmit = (shippingData) => {
    setOrderData(prev => ({
      ...prev,
      shippingAddress: shippingData
    }));
    setCurrentStep(2);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      setLoading(true);
      
      // Create the order
      const order = await OrderService.createOrder({
        ...orderData,
        paymentResult
      });

      // Clear the cart
      dispatch(clearCart());

      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation
      navigate(`/orders/${order._id}`);
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    toast.error('Payment failed. Please try again.');
  };

  const steps = [
    { id: 1, title: 'Shipping Information', icon: FaMapMarkerAlt },
    { id: 2, title: 'Payment Method', icon: FaCreditCard },
    { id: 3, title: 'Review & Place Order', icon: FaLock }
  ];

  const subtotal = totalPrice;
  const tax = subtotal * 0.1;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step.id <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {currentStep === 1 && (
              <ShippingForm 
                user={user}
                onSubmit={handleShippingSubmit}
              />
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <PaymentForm
                orderData={orderData}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                loading={loading}
                setLoading={setLoading}
              />
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <OrderReview 
                orderData={orderData}
                onConfirm={handlePaymentSuccess}
                loading={loading}
              />
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <FaLock className="text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Secure Checkout</p>
                    <p className="text-xs text-gray-600">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shipping Form Component
const ShippingForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    
    required.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-blue-600" />
        Shipping Information
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="form-label">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label">Address</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`form-input ${errors.address ? 'border-red-500' : ''}`}
            placeholder="123 Main St"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className={`form-input ${errors.city ? 'border-red-500' : ''}`}
              placeholder="New York"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label className="form-label">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className={`form-input ${errors.state ? 'border-red-500' : ''}`}
              placeholder="NY"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
          <div>
            <label className="form-label">ZIP Code</label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className={`form-input ${errors.zipCode ? 'border-red-500' : ''}`}
              placeholder="10001"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>
        </div>

        <div>
          <label className="form-label">Country</label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="form-input"
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
};

// Order Review Component
const OrderReview = ({ orderData, onConfirm, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
      
      <div className="space-y-6">
        {/* Shipping Information Review */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Shipping Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900">
              {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
            </p>
            <p className="text-gray-600">{orderData.shippingAddress.email}</p>
            <p className="text-gray-600">{orderData.shippingAddress.phone}</p>
            <p className="text-gray-600">
              {orderData.shippingAddress.address}, {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
            </p>
            <p className="text-gray-600">{orderData.shippingAddress.country}</p>
          </div>
        </div>

        {/* Payment Method Review */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              {orderData.paymentMethod === 'stripe' ? (
                <>
                  <FaCreditCard className="text-blue-600 mr-2" />
                  <span>Credit Card</span>
                </>
              ) : (
                <>
                  <FaPaypal className="text-blue-600 mr-2" />
                  <span>PayPal</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Order Items Review */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
          <div className="space-y-3">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded mr-3"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Product {item.productId}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn btn-primary btn-lg flex items-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <FaLock className="mr-2" />
              Place Order
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutForm; 