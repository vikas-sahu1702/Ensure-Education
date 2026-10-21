/**
 * TALVEX DYNAMIC PREMIUM & INCENTIVE CALCULATOR ENGINE
 * Strictly decouples:
 * - Student Scheme Premium (Dynamic 1% of course fee)
 * - College Incentive (Configurable in Admin, default 5% of course fee)
 */

const config = require('../config');
const { getSystemSettingsSync } = require('./eligibility');

/**
 * Calculate dynamic student scheme premium (1% default)
 */
function calculatePremium(courseFee, customRate = null) {
  const fee = parseFloat(courseFee) || 0;
  const currentSettings = typeof getSystemSettingsSync === 'function' ? getSystemSettingsSync() : {};
  const rate = (customRate !== null && customRate !== undefined)
    ? customRate
    : (currentSettings.premiumPercentage ?? config.DEFAULTS.PREMIUM_PERCENTAGE);
  const premium = Math.round(fee * (rate / 100));
  return {
    courseFee: fee,
    premiumRatePercentage: rate,
    premiumAmount: premium,
    currency: 'INR'
  };
}

/**
 * Calculate administrative partner college incentive (5% default)
 */
function calculateCollegeIncentive(courseFee, customRate = null) {
  const fee = parseFloat(courseFee) || 0;
  const currentSettings = typeof getSystemSettingsSync === 'function' ? getSystemSettingsSync() : {};
  const rate = (customRate !== null && customRate !== undefined)
    ? customRate
    : (currentSettings.collegeIncentivePercentage ?? config.DEFAULTS.COLLEGE_INCENTIVE_PERCENTAGE);
  const incentive = Math.round(fee * (rate / 100));
  return {
    courseFee: fee,
    incentiveRatePercentage: rate,
    incentiveAmount: incentive,
    currency: 'INR'
  };
}

/**
 * Currency Formatter
 */
function formatCurrency(amount) {
  const val = Math.round(parseFloat(amount) || 0);
  return '₹' + val.toLocaleString('en-IN');
}

module.exports = {
  calculatePremium,
  calculateCollegeIncentive,
  formatCurrency
};
