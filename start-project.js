#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 E-commerce Website Setup & Startup Script');
console.log('=============================================\n');

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
  console.log(`\n${colors.cyan}${step}${colors.reset}: ${message}`);
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

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Check if Node.js is installed
function checkNodeVersion() {
  try {
    const version = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      logError(`Node.js version ${version} is not supported. Please install Node.js 16 or higher.`);
      process.exit(1);
    }
    
    logSuccess(`Node.js ${version} detected`);
    return true;
  } catch (error) {
    logError('Node.js is not installed. Please install Node.js 16 or higher.');
    process.exit(1);
  }
}

// Check if MongoDB is running
function checkMongoDB() {
  return new Promise((resolve) => {
    try {
      execSync('mongod --version', { encoding: 'utf8' });
      logSuccess('MongoDB is installed');
      
      // Try to connect to MongoDB
      try {
        execSync('mongosh --eval "db.runCommand(\'ping\')"', { 
          encoding: 'utf8',
          timeout: 5000 
        });
        logSuccess('MongoDB is running');
        resolve(true);
      } catch (error) {
        logWarning('MongoDB is installed but not running. Please start MongoDB manually.');
        logInfo('To start MongoDB:');
        logInfo('  - Windows: Start MongoDB service or run "mongod"');
        logInfo('  - macOS: brew services start mongodb-community');
        logInfo('  - Linux: sudo systemctl start mongod');
        resolve(false);
      }
    } catch (error) {
      logWarning('MongoDB is not installed or not in PATH');
      logInfo('Please install MongoDB or use MongoDB Atlas (cloud)');
      resolve(false);
    }
  });
}

// Install dependencies
function installDependencies() {
  logStep('1', 'Installing backend dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    logSuccess('Backend dependencies installed');
  } catch (error) {
    logError('Failed to install backend dependencies');
    return false;
  }

  logStep('2', 'Installing frontend dependencies...');
  try {
    execSync('cd client && npm install', { stdio: 'inherit' });
    logSuccess('Frontend dependencies installed');
  } catch (error) {
    logError('Failed to install frontend dependencies');
    return false;
  }

  return true;
}

// Check environment file
function checkEnvironmentFile() {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, 'env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      logStep('3', 'Creating environment file...');
      try {
        fs.copyFileSync(envExamplePath, envPath);
        logSuccess('Environment file created from example');
        logWarning('Please edit .env file with your configuration before starting the app');
      } catch (error) {
        logError('Failed to create environment file');
        return false;
      }
    } else {
      logWarning('No .env file found and no env.example available');
      logInfo('Please create a .env file with the required environment variables');
    }
  } else {
    logSuccess('Environment file already exists');
  }
  
  return true;
}

// Seed database
function seedDatabase() {
  return new Promise((resolve) => {
    rl.question('\nWould you like to seed the database with sample data? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        logStep('4', 'Seeding database with sample data...');
        try {
          execSync('npm run seed', { stdio: 'inherit' });
          logSuccess('Database seeded successfully');
        } catch (error) {
          logError('Failed to seed database');
        }
      } else {
        logInfo('Skipping database seeding');
      }
      resolve();
    });
  });
}

// Start the application
function startApplication() {
  return new Promise((resolve) => {
    rl.question('\nWould you like to start the application now? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        logStep('5', 'Starting the application...');
        logInfo('Starting both frontend and backend servers...');
        
        try {
          // Start the development servers
          const child = spawn('npm', ['run', 'dev'], { 
            stdio: 'inherit',
            shell: true 
          });
          
          child.on('error', (error) => {
            logError(`Failed to start application: ${error.message}`);
          });
          
          child.on('close', (code) => {
            if (code !== 0) {
              logError(`Application exited with code ${code}`);
            }
          });
          
          // Handle process termination
          process.on('SIGINT', () => {
            logInfo('\nShutting down servers...');
            child.kill('SIGINT');
            process.exit(0);
          });
          
          process.on('SIGTERM', () => {
            logInfo('\nShutting down servers...');
            child.kill('SIGTERM');
            process.exit(0);
          });
          
        } catch (error) {
          logError(`Failed to start application: ${error.message}`);
        }
      } else {
        logInfo('You can start the application later with: npm run dev');
      }
      resolve();
    });
  });
}

// Show next steps
function showNextSteps() {
  console.log('\n' + '='.repeat(50));
  log('🎉 Setup Complete!', 'green');
  console.log('='.repeat(50));
  
  console.log('\n📋 Next Steps:');
  console.log('1. Configure your environment variables in .env file');
  console.log('2. Start MongoDB (if not already running)');
  console.log('3. Run the application: npm run dev');
  console.log('4. Access the application: http://localhost:3000');
  console.log('5. API documentation: http://localhost:5000/api');
  
  console.log('\n🔧 Available Commands:');
  console.log('  npm run dev          - Start both frontend and backend');
  console.log('  npm run server       - Start backend only');
  console.log('  npm run client       - Start frontend only');
  console.log('  npm run seed         - Seed database with sample data');
  console.log('  npm run build        - Build for production');
  console.log('  npm test             - Run tests');
  
  console.log('\n📚 Documentation:');
  console.log('  - README.md          - Complete project documentation');
  console.log('  - API endpoints      - See README.md for API documentation');
  console.log('  - Frontend routes    - See client/src/App.js for routes');
  
  console.log('\n🔒 Security Notes:');
  console.log('  - Change JWT_SECRET in .env file');
  console.log('  - Set up proper payment gateway keys');
  console.log('  - Configure CORS settings for production');
  console.log('  - Use HTTPS in production');
  
  console.log('\n🚀 Deployment:');
  console.log('  - Backend: Deploy to Heroku, Railway, or similar');
  console.log('  - Frontend: Deploy to Netlify, Vercel, or similar');
  console.log('  - Database: Use MongoDB Atlas for cloud database');
  
  console.log('\n💡 Tips:');
  console.log('  - Use MongoDB Compass for database management');
  console.log('  - Check browser console for frontend errors');
  console.log('  - Check server logs for backend errors');
  console.log('  - Use Postman or similar for API testing');
}

// Main execution
async function main() {
  try {
    // Check prerequisites
    logStep('Checking prerequisites...', '');
    checkNodeVersion();
    const mongoRunning = await checkMongoDB();
    
    if (!mongoRunning) {
      logWarning('Please start MongoDB before running the application');
    }
    
    // Install dependencies
    if (!installDependencies()) {
      process.exit(1);
    }
    
    // Check environment
    if (!checkEnvironmentFile()) {
      process.exit(1);
    }
    
    // Seed database
    await seedDatabase();
    
    // Start application
    await startApplication();
    
    // Show next steps
    showNextSteps();
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  checkNodeVersion,
  checkMongoDB,
  installDependencies,
  checkEnvironmentFile,
  seedDatabase,
  startApplication
}; 