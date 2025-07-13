const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Mock Data
const mockProducts = [
  // Electronics
  {
    _id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 50,
    rating: 4.5,
    numReviews: 128,
    featured: true
  },
  {
    _id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your fitness goals with this advanced smartwatch',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 30,
    rating: 4.3,
    numReviews: 89,
    featured: true
  },
  {
    _id: '3',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging for all compatible devices',
    price: 39.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    stock: 40,
    rating: 4.2,
    numReviews: 67,
    featured: false
  },
  {
    _id: '4',
    name: 'Bluetooth Speaker',
    description: 'Portable speaker with deep bass and long battery life',
    price: 59.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    stock: 60,
    rating: 4.6,
    numReviews: 110,
    featured: false
  },
  // Clothing
  {
    _id: '5',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and eco-friendly cotton t-shirt',
    price: 29.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    stock: 100,
    rating: 4.1,
    numReviews: 56,
    featured: false
  },
  {
    _id: '6',
    name: 'Classic Blue Jeans',
    description: 'Stylish and durable blue jeans for everyday wear',
    price: 49.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400',
    stock: 80,
    rating: 4.6,
    numReviews: 102,
    featured: false
  },
  {
    _id: '7',
    name: 'Hooded Sweatshirt',
    description: 'Warm and cozy hoodie for all seasons',
    price: 39.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    stock: 70,
    rating: 4.4,
    numReviews: 80,
    featured: false
  },
  {
    _id: '8',
    name: 'Summer Dress',
    description: 'Lightweight and stylish dress for summer',
    price: 34.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400',
    stock: 60,
    rating: 4.7,
    numReviews: 95,
    featured: true
  },
  // Books
  {
    _id: '9',
    name: 'The Art of Coding',
    description: 'A must-read book for aspiring developers',
    price: 19.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    stock: 200,
    rating: 4.8,
    numReviews: 210,
    featured: true
  },
  {
    _id: '10',
    name: 'Mindful Living',
    description: 'A guide to living a mindful and peaceful life',
    price: 14.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400',
    stock: 150,
    rating: 4.5,
    numReviews: 120,
    featured: false
  },
  {
    _id: '11',
    name: 'Business Mastery',
    description: 'Strategies for success in business and entrepreneurship',
    price: 24.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400',
    stock: 90,
    rating: 4.3,
    numReviews: 75,
    featured: false
  },
  {
    _id: '12',
    name: 'Healthy Recipes',
    description: 'Delicious and healthy recipes for every day',
    price: 17.99,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
    stock: 120,
    rating: 4.6,
    numReviews: 98,
    featured: false
  },
  // Home & Garden
  {
    _id: '13',
    name: 'Stainless Steel Water Bottle',
    description: 'Keep your drinks cold for 24 hours with this premium bottle',
    price: 24.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    stock: 75,
    rating: 4.7,
    numReviews: 203,
    featured: true
  },
  {
    _id: '14',
    name: 'Aromatic Scented Candle',
    description: 'Relax with this long-lasting scented candle',
    price: 12.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
    stock: 90,
    rating: 4.5,
    numReviews: 60,
    featured: false
  },
  {
    _id: '15',
    name: 'Indoor Plant Set',
    description: 'Bring nature indoors with this beautiful plant set',
    price: 44.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400',
    stock: 40,
    rating: 4.8,
    numReviews: 88,
    featured: false
  },
  {
    _id: '16',
    name: 'Decorative Throw Pillow',
    description: 'Add comfort and style to your home',
    price: 19.99,
    category: 'Home & Garden',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400',
    stock: 60,
    rating: 4.4,
    numReviews: 70,
    featured: false
  },
  // Sports
  {
    _id: '17',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for all levels',
    price: 29.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400',
    stock: 80,
    rating: 4.7,
    numReviews: 130,
    featured: true
  },
  {
    _id: '18',
    name: 'Adjustable Dumbbells',
    description: 'Perfect for home workouts and strength training',
    price: 89.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517960413843-0aee8e2d471c?w=400',
    stock: 50,
    rating: 4.6,
    numReviews: 90,
    featured: false
  },
  {
    _id: '19',
    name: 'Football',
    description: 'Durable and high-quality football for all ages',
    price: 25.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1505843273132-bc5c6e6f4a59?w=400',
    stock: 100,
    rating: 4.5,
    numReviews: 110,
    featured: false
  },
  {
    _id: '20',
    name: 'Tennis Racket',
    description: 'Lightweight racket for beginners and pros',
    price: 59.99,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
    stock: 60,
    rating: 4.4,
    numReviews: 75,
    featured: false
  },
  // Beauty
  {
    _id: '21',
    name: 'Moisturizing Face Cream',
    description: 'Hydrate and nourish your skin with this face cream',
    price: 22.99,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400',
    stock: 70,
    rating: 4.6,
    numReviews: 95,
    featured: true
  },
  {
    _id: '22',
    name: 'Natural Lip Balm',
    description: 'Keep your lips soft and smooth',
    price: 7.99,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
    stock: 120,
    rating: 4.5,
    numReviews: 60,
    featured: false
  },
  {
    _id: '23',
    name: 'Aloe Vera Gel',
    description: 'Soothing gel for skin hydration and repair',
    price: 12.99,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=400',
    stock: 90,
    rating: 4.7,
    numReviews: 80,
    featured: false
  },
  {
    _id: '24',
    name: 'Herbal Shampoo',
    description: 'Gentle shampoo for healthy, shiny hair',
    price: 15.99,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400',
    stock: 60,
    rating: 4.4,
    numReviews: 70,
    featured: false
  },
];

const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    isAdmin: false
  },
  {
    _id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    isAdmin: true
  }
];

// Mock authentication middleware
const mockAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token === 'mock-token') {
    req.user = mockUsers[0]; // Default to first user
  }
  next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'E-commerce API is running with mock data' });
});

// Products endpoints
app.get('/api/products', (req, res) => {
  const { category, search, featured } = req.query;
  let filteredProducts = [...mockProducts];

  if (featured === 'true') {
    filteredProducts = filteredProducts.filter(product => product.featured);
  }

  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json({
    products: filteredProducts,
    total: filteredProducts.length
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(p => p._id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock login - accept any email/password
  res.json({
    token: 'mock-token',
    user: mockUsers[0],
    message: 'Login successful'
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Mock registration
  const newUser = {
    _id: Date.now().toString(),
    name,
    email,
    isAdmin: false
  };
  
  res.json({
    token: 'mock-token',
    user: newUser,
    message: 'Registration successful'
  });
});

// Cart endpoints
app.get('/api/cart', mockAuth, (req, res) => {
  res.json({
    items: [],
    total: 0
  });
});

app.post('/api/cart', mockAuth, (req, res) => {
  const { productId, quantity } = req.body;
  const product = mockProducts.find(p => p._id === productId);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  res.json({
    message: 'Item added to cart',
    item: {
      product,
      quantity
    }
  });
});

// Orders endpoints
app.get('/api/orders', mockAuth, (req, res) => {
  res.json({
    orders: [
      {
        _id: '1',
        user: req.user._id,
        items: [
          {
            product: mockProducts[0],
            quantity: 2,
            price: mockProducts[0].price
          }
        ],
        total: 199.98,
        status: 'delivered',
        createdAt: new Date().toISOString()
      }
    ]
  });
});

app.post('/api/orders', mockAuth, (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const order = {
    _id: Date.now().toString(),
    user: req.user._id,
    items,
    total,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  res.json({
    message: 'Order created successfully',
    order
  });
});

// Users endpoints
app.get('/api/users/profile', mockAuth, (req, res) => {
  res.json(req.user);
});

app.put('/api/users/profile', mockAuth, (req, res) => {
  const updatedUser = { ...req.user, ...req.body };
  res.json({
    message: 'Profile updated successfully',
    user: updatedUser
  });
});

// Payments endpoint
app.post('/api/payments', mockAuth, (req, res) => {
  const { amount, paymentMethod } = req.body;
  
  res.json({
    message: 'Payment processed successfully',
    transactionId: 'mock-transaction-' + Date.now(),
    amount,
    status: 'completed'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock backend server running on port ${PORT}`);
  console.log(`📊 Serving ${mockProducts.length} mock products`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 