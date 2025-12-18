// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Simple file-based database
class FileDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, 'data');
    this.usersFile = path.join(this.dataDir, 'users.json');
    this.init();
  }

  async init() {
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dataDir, { recursive: true });
      
      // Create users file if it doesn't exist
      try {
        await fs.access(this.usersFile);
      } catch {
        await fs.writeFile(this.usersFile, JSON.stringify({ users: [] }, null, 2));
      }
      
      console.log('✅ File database initialized');
    } catch (error) {
      console.error('❌ Database init error:', error);
    }
  }

  async readUsers() {
    try {
      const data = await fs.readFile(this.usersFile, 'utf8');
      return JSON.parse(data).users;
    } catch (error) {
      console.error('❌ Read users error:', error);
      return [];
    }
  }

  async writeUsers(users) {
    try {
      await fs.writeFile(this.usersFile, JSON.stringify({ users }, null, 2));
      return true;
    } catch (error) {
      console.error('❌ Write users error:', error);
      return false;
    }
  }

  async findUserByPhone(phone) {
    const users = await this.readUsers();
    return users.find(user => user.phoneNumber === phone);
  }

  async createUser(userData) {
    const users = await this.readUsers();
    users.push(userData);
    const success = await this.writeUsers(users);
    return success ? userData : null;
  }

  async updateUser(userId, updates) {
    const users = await this.readUsers();
    const index = users.findIndex(user => user.userId === userId);
    
    if (index === -1) return false;
    
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    return await this.writeUsers(users);
  }
}

// Initialize database
const db = new FileDatabase();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mzuri Organics Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    database: 'File-based (users.json)'
  });
});

// Working signup endpoint
app.post('/api/v1/auth/signup', async (req, res) => {
  try {
    console.log('📝 Signup request received');
    
    const {
      fullName,
      phoneNumber,
      email,
      userType,
      password,
      county,
      subCounty,
      ward,
      village,
      nearestTown,
      landmark,
      farmSize,
      mainCrops,
      livestock,
      farmingExperience,
      agreeTerms
    } = req.body;

    // Validation
    const requiredFields = ['fullName', 'phoneNumber', 'password', 'userType', 'county', 'subCounty', 'ward', 'nearestTown'];
    const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    if (!agreeTerms) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to the terms and conditions'
      });
    }

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 9) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be 9 digits (e.g., 712345678)'
      });
    }

    console.log('🔍 Checking if user exists with phone:', cleanPhone);

    // Check if user exists
    const existingUser = await db.findUserByPhone(cleanPhone);
    if (existingUser) {
      console.log('⚠️ Phone number already registered:', cleanPhone);
      return res.status(409).json({
        success: false,
        message: 'Phone number is already registered'
      });
    }

    // Create user object
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Hash password (using bcryptjs)
    let hashedPassword;
    try {
      const bcrypt = require('bcryptjs');
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (bcryptError) {
      console.warn('⚠️ Bcrypt not available, using simple hash');
      hashedPassword = `hashed_${password}_${Date.now()}`;
    }
    
    // Calculate points
    let points = 50;
    if (userType === 'farmer') points = 100;
    if (userType === 'agronomist') points = 150;

    const userData = {
      userId,
      phoneNumber: cleanPhone,
      fullName: fullName.trim(),
      email: email?.trim() || '',
      userType,
      password: hashedPassword,
      county: county.trim(),
      subCounty: subCounty.trim(),
      ward: ward.trim(),
      village: village?.trim() || '',
      nearestTown: nearestTown.trim(),
      landmark: landmark?.trim() || '',
      farmSize: farmSize ? parseFloat(farmSize) : 0,
      mainCrops: Array.isArray(mainCrops) ? mainCrops : (mainCrops ? [mainCrops] : []),
      livestock: Array.isArray(livestock) ? livestock : (livestock ? [livestock] : []),
      farmingExperience: farmingExperience || '',
      isVerified: false,
      isActive: true,
      points: points,
      tier: 'Bronze',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null
    };

    console.log('📝 Creating user with ID:', userId);

    // Save to database
    const createdUser = await db.createUser(userData);
    
    if (!createdUser) {
      throw new Error('Failed to save user to database');
    }
    
    // Remove password from response
    const userResponse = { ...userData };
    delete userResponse.password;

    console.log(`🎉 Signup successful for user: ${cleanPhone}`);
    console.log(`📁 User data saved to: ${db.usersFile}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        user: userResponse,
        token: userId
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Signup error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login endpoint
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    console.log('🔐 Login attempt');
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and password are required'
      });
    }

    // Clean phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Find user
    const user = await db.findUserByPhone(cleanPhone);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Verify password
    let isPasswordValid = false;
    try {
      const bcrypt = require('bcryptjs');
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch {
      // Simple fallback password check
      isPasswordValid = user.password === `hashed_${password}_${user.createdAt ? new Date(user.createdAt).getTime() : ''}`;
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid phone number or password'
      });
    }

    // Update last login
    await db.updateUser(user.userId, {
      lastLogin: new Date().toISOString()
    });

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;

    console.log(`✅ Login successful for: ${cleanPhone}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token: user.userId
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Profile endpoint
app.get('/api/v1/auth/profile', async (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const user = await db.findUserByPhone(cleanPhone);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: {
        user: userResponse
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile'
    });
  }
});

// Check phone availability
app.get('/api/v1/auth/check-phone', async (req, res) => {
  try {
    const { phoneNumber } = req.query;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const existingUser = await db.findUserByPhone(cleanPhone);

    res.status(200).json({
      success: true,
      data: {
        isAvailable: !existingUser,
        phoneNumber: cleanPhone
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Check phone error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check phone availability'
    });
  }
});

// List all users (admin/dev endpoint)
app.get('/api/v1/admin/users', async (req, res) => {
  try {
    const users = await db.readUsers();
    
    // Remove passwords from response
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    res.status(200).json({
      success: true,
      data: {
        users: safeUsers,
        count: safeUsers.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ List users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list users'
    });
  }
});

// Database info endpoint
app.get('/api/v1/db-info', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      type: 'File-based JSON database',
      location: db.usersFile,
      usersFile: db.usersFile,
      dataDirectory: db.dataDir
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /health - Health check',
      'POST /api/v1/auth/signup - User registration',
      'POST /api/v1/auth/login - User login',
      'GET /api/v1/auth/profile?phone=XXX - User profile',
      'GET /api/v1/auth/check-phone?phoneNumber=XXX - Check phone availability',
      'GET /api/v1/admin/users - List all users (dev)',
      'GET /api/v1/db-info - Database information'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Mzuri Organics Backend v2.0...');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}`);
    console.log(`🔒 CORS Origin: http://localhost:4200, http://localhost:3000`);
    console.log(`💾 Database: File-based (users.json)`);
    
    console.log('\n📋 Available Endpoints:');
    console.log('   GET  /health - Health check');
    console.log('   POST /api/v1/auth/signup - User signup');
    console.log('   POST /api/v1/auth/login - User login');
    console.log('   GET  /api/v1/auth/profile?phone=XXX - User profile');
    console.log('   GET  /api/v1/auth/check-phone?phoneNumber=XXX - Check phone');
    console.log('   GET  /api/v1/admin/users - List all users (dev)');
    console.log('   GET  /api/v1/db-info - Database information');
    
    app.listen(PORT, () => {
      console.log(`\n✅ Server is ready! Testing can begin.`);
      console.log('\n💡 Engineer Felix Testing Tips:');
      console.log('   1. Test signup:');
      console.log('      curl -X POST http://localhost:5000/api/v1/auth/signup \\');
      console.log('        -H "Content-Type: application/json" \\');
      console.log('        -d \'{"fullName":"Felix","phoneNumber":"712683708","password":"test123","userType":"buyer","county":"Nairobi","subCounty":"Dagoretti","ward":"Waithaka","nearestTown":"CBD","agreeTerms":true}\'');
      console.log('');
      console.log('   2. Check database info:');
      console.log('      curl http://localhost:5000/api/v1/db-info');
      console.log('');
      console.log('   3. List users:');
      console.log('      curl http://localhost:5000/api/v1/admin/users');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();