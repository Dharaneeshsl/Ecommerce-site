#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up E-commerce Website...\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`\n${colors.cyan}${step}${colors.reset} ${message}`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    execSync(command, { 
      cwd, 
      stdio: 'inherit',
      shell: true 
    });
    return true;
  } catch (error) {
    return false;
  }
}

function checkNodeVersion() {
  logStep('1', 'Checking Node.js version...');
  
  try {
    const version = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(version.replace('v', '').split('.')[0]);
    
    if (majorVersion < 16) {
      logError(`Node.js version ${version} is not supported. Please install Node.js 16 or higher.`);
      process.exit(1);
    }
    
    logSuccess(`Node.js ${version} detected`);
  } catch (error) {
    logError('Node.js is not installed. Please install Node.js 16 or higher.');
    process.exit(1);
  }
}

function checkMongoDB() {
  logStep('2', 'Checking MongoDB...');
  
  try {
    execSync('mongod --version', { stdio: 'ignore' });
    logSuccess('MongoDB is installed');
  } catch (error) {
    logWarning('MongoDB is not installed or not in PATH');
    log('Please install MongoDB Community Edition from: https://www.mongodb.com/try/download/community');
    log('Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
  }
}

function installDependencies() {
  logStep('3', 'Installing backend dependencies...');
  
  if (runCommand('npm install')) {
    logSuccess('Backend dependencies installed successfully');
  } else {
    logError('Failed to install backend dependencies');
    process.exit(1);
  }
  
  logStep('4', 'Installing frontend dependencies...');
  
  if (runCommand('npm install', path.join(process.cwd(), 'client'))) {
    logSuccess('Frontend dependencies installed successfully');
  } else {
    logError('Failed to install frontend dependencies');
    process.exit(1);
  }
}

function createEnvironmentFile() {
  logStep('5', 'Setting up environment variables...');
  
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), 'env.example');
  
  if (fs.existsSync(envPath)) {
    logWarning('.env file already exists');
    return;
  }
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    logSuccess('Environment file created from template');
    logWarning('Please update the .env file with your actual configuration values');
  } else {
    // Create a basic .env file
    const envContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Payment Gateway Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password

# Cloud Storage (Optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
`;
    
    fs.writeFileSync(envPath, envContent);
    logSuccess('Basic environment file created');
    logWarning('Please update the .env file with your actual configuration values');
  }
}

function createDatabaseScripts() {
  logStep('6', 'Creating database setup scripts...');
  
  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
  }
  
  // Create seed data script
  const seedScript = `const mongoose = require('mongoose');
const User = require('../server/models/User');
const Product = require('../server/models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    originalPrice: 129.99,
    category: 'Electronics',
    brand: 'TechAudio',
    stock: 50,
    images: [
      { url: 'https://via.placeholder.com/400x400?text=Headphones+1' },
      { url: 'https://via.placeholder.com/400x400?text=Headphones+2' }
    ],
    ratings: 4.5,
    numOfReviews: 128,
    features: ['Noise Cancellation', 'Bluetooth 5.0', '30-hour battery'],
    specifications: {
      'Connectivity': 'Bluetooth 5.0',
      'Battery Life': '30 hours',
      'Weight': '250g'
    }
  },
  {
    name: 'Smartphone Case',
    description: 'Durable protective case for smartphones',
    price: 19.99,
    category: 'Accessories',
    brand: 'ProtectPro',
    stock: 100,
    images: [
      { url: 'https://via.placeholder.com/400x400?text=Case+1' },
      { url: 'https://via.placeholder.com/400x400?text=Case+2' }
    ],
    ratings: 4.2,
    numOfReviews: 89,
    features: ['Shock Absorbing', 'Anti-Scratch', 'Lightweight'],
    specifications: {
      'Material': 'TPU + Polycarbonate',
      'Compatibility': 'Universal',
      'Weight': '50g'
    }
  },
  {
    name: 'Laptop Stand',
    description: 'Adjustable laptop stand for better ergonomics',
    price: 49.99,
    category: 'Accessories',
    brand: 'ErgoTech',
    stock: 30,
    images: [
      { url: 'https://via.placeholder.com/400x400?text=Stand+1' },
      { url: 'https://via.placeholder.com/400x400?text=Stand+2' }
    ],
    ratings: 4.7,
    numOfReviews: 156,
    features: ['Adjustable Height', 'Aluminum Construction', 'Cable Management'],
    specifications: {
      'Material': 'Aluminum',
      'Max Weight': '5kg',
      'Height Range': '10-20cm'
    }
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
`;
  
  fs.writeFileSync(path.join(scriptsDir, 'seed.js'), seedScript);
  logSuccess('Database seed script created');
}

function createStartScripts() {
  logStep('7', 'Creating start scripts...');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Add start scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'dev': 'concurrently \"npm run server\" \"npm run client\"",
    'server': 'nodemon server/index.js",
    'client': 'cd client && npm start',
    'build': 'cd client && npm run build',
    'seed': 'node scripts/seed.js',
    'install-all': 'npm install && cd client && npm install'
  };
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  logSuccess('Start scripts added to package.json');
}

function displayNextSteps() {
  logStep('8', 'Setup complete! Here are your next steps:');
  
  console.log(`
${colors.green}🎉 Setup completed successfully!${colors.reset}

${colors.cyan}Next Steps:${colors.reset}

1. ${colors.yellow}Configure Environment Variables:${colors.reset}
   - Edit the .env file with your actual configuration
   - Set up MongoDB connection string
   - Add payment gateway keys (Stripe/PayPal)

2. ${colors.yellow}Start MongoDB:${colors.reset}
   - Make sure MongoDB is running locally
   - Or use MongoDB Atlas cloud service

3. ${colors.yellow}Seed the Database:${colors.reset}
   - Run: npm run seed
   - This will add sample products to your database

4. ${colors.yellow}Start the Application:${colors.reset}
   - Development mode: npm run dev
   - Backend only: npm run server
   - Frontend only: npm run client

5. ${colors.yellow}Access the Application:${colors.reset}
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

${colors.cyan}Default Test Credentials:${colors.reset}
- Email: admin@example.com
- Password: admin123

${colors.cyan}Features Available:${colors.reset}
✅ User registration and authentication
✅ Product browsing and search
✅ Shopping cart functionality
✅ Checkout process
✅ Payment integration (Stripe/PayPal)
✅ Order management
✅ User profile management
✅ Responsive design

${colors.cyan}API Documentation:${colors.reset}
- All API endpoints are documented in the README.md file

${colors.green}Happy coding! 🚀${colors.reset}
`);
}

// Main setup function
async function main() {
  try {
    checkNodeVersion();
    checkMongoDB();
    installDependencies();
    createEnvironmentFile();
    createDatabaseScripts();
    createStartScripts();
    displayNextSteps();
  } catch (error) {
    logError('Setup failed: ' + error.message);
    process.exit(1);
  }
}

// Run setup
main(); 