const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT token
const generateToken = (userId, userType = 'user') => {
  return jwt.sign(
    { 
      userId, 
      userType,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
  return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Format phone number to 254 format
const formatPhoneNumber = (phone) => {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');
  
  // Check if starts with 0, convert to 254
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  
  // Check if starts with +254
  if (cleaned.startsWith('254')) {
    return cleaned;
  }
  
  // Check if starts with 7 (Kenyan number without code)
  if (cleaned.startsWith('7') && cleaned.length === 9) {
    return '254' + cleaned;
  }
  
  return cleaned;
};

// Generate random ID
const generateId = (prefix, length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${prefix}-${result}`;
};

// Calculate distance between coordinates (for delivery)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

// Format currency (Kenyan Shillings)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount);
};

// Validate email
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Generate OTP (One Time Password)
const generateOTP = (length = 6) => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// Delay function (for async operations)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  formatPhoneNumber,
  generateId,
  calculateDistance,
  formatCurrency,
  isValidEmail,
  generateOTP,
  delay
};