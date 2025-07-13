import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaArrowLeft, 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaDollarSign, 
  FaCreditCard, 
  FaPrint, 
  FaDownload,
  FaStar,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock order data
      const mockOrder = {
        _id: id,
        orderNumber: 'ORD-2024-001',
        items: [
          {
            product: {
              _id: '1',
              name: 'Wireless Bluetooth Headphones',
              image: 'https://via.placeholder.com/120x120',
              price: 99.99,
              sku: 'WH-001'
            },
            quantity: 1,
            price: 99.99
          },
          {
            product: {
              _id: '2',
              name: 'Smartphone Case',
              image: 'https://via.placeholder.com/120x120',
              price: 19.99,
              sku: 'SC-002'
            },
            quantity: 2,
            price: 39.98
          }
        ],
        totalAmount: 139.97,
        subtotal: 139.97,
        tax: 13.99,
        shipping: 0,
        status: 'delivered',
        paymentStatus: 'paid',
        paymentMethod: 'credit_card',
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          phone: '+1 (555) 123-4567'
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        trackingNumber: 'TRK123456789',
        createdAt: '2024-01-15T10:30:00Z',
        shippedAt: '2024-01-17T14:20:00Z',
        deliveredAt: '2024-01-18T14:20:00Z',
        estimatedDelivery: '2024-01-19T00:00:00Z'
      };
      
      setOrder(mockOrder);
    } catch (error) {
      toast.error('Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-600" />;
      case 'shipped':
        return <FaTruck className="text-blue-600" />;
      case 'processing':
        return <FaBox className="text-yellow-600" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaBox className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card':
        return <FaCreditCard className="text-blue-600" />;
      case 'paypal':
        return <FaCreditCard className="text-blue-600" />;
      default:
        return <FaCreditCard className="text-gray-600" />;
    }
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    // Simulate invoice download
    toast.success('Invoice download started');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Here you would submit the review
    setShowReviewForm(false);
    setReviewData({ rating: 5, comment: '' });
    toast.success('Review submitted successfully!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to view order details</h2>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <button
            onClick={() => navigate('/orders')}
            className="btn btn-primary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/orders')}
                className="mr-4 text-gray-600 hover:text-blue-600"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                <p className="text-gray-600">Order #{order.orderNumber}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrintOrder}
                className="btn btn-outline btn-sm flex items-center"
              >
                <FaPrint className="mr-2" />
                Print
              </button>
              <button
                onClick={handleDownloadInvoice}
                className="btn btn-outline btn-sm flex items-center"
              >
                <FaDownload className="mr-2" />
                Invoice
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Status</h2>
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Ordered</p>
                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-1 h-1 bg-green-600 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                      <FaTruck />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Shipped</p>
                    <p className="text-xs text-gray-500">{order.shippedAt ? new Date(order.shippedAt).toLocaleDateString() : '-'}</p>
                  </div>
                  <div className="flex-1 h-1 bg-green-600 mx-4"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white">
                      <FaCheckCircle />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Delivered</p>
                    <p className="text-xs text-gray-500">{order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tracking Number: <span className="font-semibold">{order.trackingNumber}</span></p>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">SKU: {item.product.sku}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Billing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  Shipping Address
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-900">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.country}</p>
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <FaCreditCard className="mr-2 text-blue-600" />
                  Billing Address
                </h2>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-gray-900">
                    {order.billingAddress.firstName} {order.billingAddress.lastName}
                  </p>
                  <p className="text-gray-600">{order.billingAddress.address}</p>
                  <p className="text-gray-600">
                    {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                  </p>
                  <p className="text-gray-600">{order.billingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">
                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${order.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <div className="flex items-center">
                    {getPaymentMethodIcon(order.paymentMethod)}
                    <span className="ml-2 font-semibold capitalize">
                      {order.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaPhone className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Call Support</p>
                    <p className="text-xs text-gray-600">1-800-123-4567</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email Support</p>
                    <p className="text-xs text-gray-600">support@example.com</p>
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

export default OrderDetail; 