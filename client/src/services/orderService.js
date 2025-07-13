import api from './api';

class OrderService {
  // Create a new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's orders
  async getUserOrders() {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId, status) {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get order tracking information
  async getOrderTracking(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/tracking`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Request order refund
  async requestRefund(orderId, reason) {
    try {
      const response = await api.post(`/orders/${orderId}/refund`, { reason });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get order statistics (admin only)
  async getOrderStats() {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Export orders (admin only)
  async exportOrders(filters = {}) {
    try {
      const response = await api.get('/orders/export', { 
        params: filters,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error('An unexpected error occurred.');
    }
  }
}

export default new OrderService(); 