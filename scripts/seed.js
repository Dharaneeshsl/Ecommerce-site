const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../server/models/User');
const Product = require('../server/models/Product');
const Order = require('../server/models/Order');

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
];

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 89.99,
    oldPrice: 129.99,
    category: 'Electronics',
    brand: 'TechAudio',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    rating: 4.5,
    numReviews: 128,
    features: ['Noise Cancellation', '30-hour Battery', 'Bluetooth 5.0', 'Quick Charge'],
    specifications: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Warranty': '2 years'
    }
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitor and GPS.',
    price: 199.99,
    oldPrice: 249.99,
    category: 'Electronics',
    brand: 'FitTech',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500'
    ],
    rating: 4.3,
    numReviews: 89,
    features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', 'Sleep Tracking'],
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery Life': '7 days',
      'Water Resistance': '5ATM',
      'Compatibility': 'iOS/Android'
    }
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt available in multiple colors.',
    price: 24.99,
    category: 'Fashion',
    brand: 'EcoWear',
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'
    ],
    rating: 4.7,
    numReviews: 256,
    features: ['100% Organic Cotton', 'Sustainable', 'Multiple Colors', 'Comfortable Fit'],
    specifications: {
      'Material': '100% Organic Cotton',
      'Fit': 'Regular',
      'Care': 'Machine Washable',
      'Sizes': 'XS-XXL'
    }
  },
  {
    name: 'Modern Coffee Table',
    description: 'Elegant wooden coffee table with storage shelf, perfect for living rooms.',
    price: 299.99,
    oldPrice: 399.99,
    category: 'Home & Garden',
    brand: 'HomeStyle',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'
    ],
    rating: 4.6,
    numReviews: 67,
    features: ['Solid Wood Construction', 'Storage Shelf', 'Easy Assembly', 'Modern Design'],
    specifications: {
      'Material': 'Solid Oak Wood',
      'Dimensions': '120x60x45 cm',
      'Weight': '25kg',
      'Assembly': 'Required'
    }
  },
  {
    name: 'Professional Camera Lens',
    description: 'High-quality 50mm f/1.8 prime lens for professional photography.',
    price: 399.99,
    category: 'Electronics',
    brand: 'PhotoPro',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
      'https://images.unsplash.com/photo-1510127034890-ba63a1270cbb?w=500'
    ],
    rating: 4.8,
    numReviews: 203,
    features: ['50mm Focal Length', 'f/1.8 Aperture', 'Auto Focus', 'Weather Sealed'],
    specifications: {
      'Focal Length': '50mm',
      'Maximum Aperture': 'f/1.8',
      'Filter Size': '58mm',
      'Weight': '160g'
    }
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat made from eco-friendly materials, perfect for all types of yoga.',
    price: 49.99,
    category: 'Sports',
    brand: 'YogaLife',
    stock: 75,
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'
    ],
    rating: 4.4,
    numReviews: 142,
    features: ['Non-slip Surface', 'Eco-friendly Material', 'Lightweight', 'Easy to Clean'],
    specifications: {
      'Material': 'TPE',
      'Thickness': '6mm',
      'Dimensions': '183x61 cm',
      'Weight': '2.5kg'
    }
  },
  {
    name: 'Bestselling Novel Collection',
    description: 'Set of 3 bestselling novels from award-winning authors.',
    price: 34.99,
    oldPrice: 44.99,
    category: 'Books',
    brand: 'BookWorld',
    stock: 200,
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
    ],
    rating: 4.5,
    numReviews: 89,
    features: ['Bestselling Authors', 'Hardcover Edition', 'Gift Box Included', 'Free Bookmark'],
    specifications: {
      'Format': 'Hardcover',
      'Pages': '1200 total',
      'Language': 'English',
      'Publisher': 'BookWorld Publishing'
    }
  },
  {
    name: 'Robot Vacuum Cleaner',
    description: 'Smart robot vacuum with mapping technology and app control.',
    price: 299.99,
    category: 'Electronics',
    brand: 'SmartHome',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    rating: 4.2,
    numReviews: 156,
    features: ['Smart Mapping', 'App Control', 'Auto Recharge', 'HEPA Filter'],
    specifications: {
      'Battery Life': '120 minutes',
      'Suction Power': '2000Pa',
      'Noise Level': '<65dB',
      'App Support': 'iOS/Android'
    }
  },
  {
    name: 'Designer Handbag',
    description: 'Luxury leather handbag with multiple compartments and adjustable strap.',
    price: 199.99,
    oldPrice: 299.99,
    category: 'Fashion',
    brand: 'LuxuryStyle',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'
    ],
    rating: 4.6,
    numReviews: 78,
    features: ['Genuine Leather', 'Multiple Compartments', 'Adjustable Strap', 'Laptop Sleeve'],
    specifications: {
      'Material': 'Genuine Leather',
      'Dimensions': '30x25x12 cm',
      'Weight': '1.2kg',
      'Colors': 'Black, Brown, Tan'
    }
  },
  {
    name: 'Gaming Console Bundle',
    description: 'Latest gaming console with two controllers and three popular games.',
    price: 499.99,
    category: 'Electronics',
    brand: 'GameTech',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=500',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500'
    ],
    rating: 4.7,
    numReviews: 234,
    features: ['4K Gaming', 'Two Controllers', 'Three Games Included', '1TB Storage'],
    specifications: {
      'Storage': '1TB SSD',
      'Resolution': '4K Ultra HD',
      'Controllers': '2 included',
      'Games': '3 included'
    }
  },
  {
    name: 'Kitchen Mixer Professional',
    description: 'Professional stand mixer for baking with multiple attachments.',
    price: 349.99,
    oldPrice: 449.99,
    category: 'Home & Garden',
    brand: 'KitchenPro',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'
    ],
    rating: 4.8,
    numReviews: 167,
    features: ['Professional Grade', 'Multiple Attachments', 'Variable Speed', 'Dishwasher Safe'],
    specifications: {
      'Power': '1000W',
      'Capacity': '6.9L',
      'Attachments': '5 included',
      'Warranty': '5 years'
    }
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation and touch controls.',
    price: 129.99,
    category: 'Electronics',
    brand: 'SoundTech',
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500'
    ],
    rating: 4.4,
    numReviews: 189,
    features: ['Active Noise Cancellation', 'Touch Controls', 'Water Resistant', 'Wireless Charging'],
    specifications: {
      'Battery Life': '6 hours',
      'Charging Case': '24 hours total',
      'Water Resistance': 'IPX4',
      'Connectivity': 'Bluetooth 5.0'
    }
  }
];

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Clear existing data
async function clearData() {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

// Seed users
async function seedUsers() {
  try {
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    return [];
  }
}

// Seed products
async function seedProducts() {
  try {
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    return [];
  }
}

// Seed sample orders
async function seedOrders(users, products) {
  try {
    if (users.length === 0 || products.length === 0) {
      console.log('⚠️ Skipping orders - no users or products available');
      return;
    }

    const sampleOrders = [
      {
        user: users[0]._id,
        items: [
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].price
          },
          {
            product: products[2]._id,
            quantity: 2,
            price: products[2].price
          }
        ],
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          phone: '+1234567890'
        },
        paymentMethod: 'stripe',
        paymentResult: {
          id: 'pi_sample_123',
          status: 'succeeded',
          update_time: new Date()
        },
        totalPrice: products[0].price + (products[2].price * 2),
        status: 'delivered',
        deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        user: users[1]._id,
        items: [
          {
            product: products[1]._id,
            quantity: 1,
            price: products[1].price
          }
        ],
        shippingAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          address: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'United States',
          phone: '+1987654321'
        },
        paymentMethod: 'paypal',
        paymentResult: {
          id: 'paypal_sample_456',
          status: 'completed',
          update_time: new Date()
        },
        totalPrice: products[1].price,
        status: 'shipped'
      }
    ];

    const createdOrders = await Order.insertMany(sampleOrders);
    console.log(`✅ Created ${createdOrders.length} orders`);
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
  }
}

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    await clearData();

    // Seed data
    const users = await seedUsers();
    const products = await seedProducts();
    await seedOrders(users, products);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Data Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📦 Products: ${products.length}`);
    console.log(`   📋 Orders: 2`);
    
    console.log('\n🔑 Sample Login Credentials:');
    console.log('   User: john@example.com / password123');
    console.log('   Admin: admin@example.com / admin123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 