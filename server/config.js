/**
 * TALVEX BACKEND CONFIGURATION
 */

const path = require('node:path');
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  HOST: '127.0.0.1',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/talvex',
  JWT_SECRET: process.env.JWT_SECRET || 'talvex_institutional_protection_secret_2026',
  DEFAULTS: {
    PREMIUM_PERCENTAGE: 1.0, // 1% student scheme premium
    COLLEGE_INCENTIVE_PERCENTAGE: 5.0, // 5% partner incentive
    MAX_FEE_PAYER_AGE: 55, // strictly <= 55 at registration
    CURRENCY_SYMBOL: '₹'
  }
};
