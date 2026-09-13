/**
 * TALVEX ELIGIBILITY VALIDATION ENGINE
 * Strictly enforces platform business rules:
 * 1. Fee payer age must NOT exceed 55 years at registration
 * 2. Father / Mother: No income proof required
 * 3. Other family members: Income proof required
 * 4. Two-step authentication required
 */

const { SystemSetting } = require('../db/database');

/**
 * Fetch current system settings from DB
 */
async function getSystemSettings() {
  const settingsDocs = await SystemSetting.find({});
  const settings = {};
  settingsDocs.forEach(r => {
    settings[r.key] = r.value;
  });
  return {
    maxFeePayerAge: parseInt(settings.max_fee_payer_age || '55', 10),
    premiumPercentage: parseFloat(settings.premium_percentage || '1.0'),
    collegeIncentivePercentage: parseFloat(settings.college_incentive_percentage || '5.0')
  };
}

/**
 * Validate Fee Payer Age
 */
async function validateFeePayerAge(dobString, registrationDate = new Date()) {
  if (!dobString) {
    return { valid: false, age: 0, message: 'Fee payer date of birth is required.' };
  }

  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) {
    return { valid: false, age: 0, message: 'Invalid date of birth format.' };
  }

  const regDate = new Date(registrationDate);
  let age = regDate.getFullYear() - birthDate.getFullYear();
  const m = regDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && regDate.getDate() < birthDate.getDate())) {
    age--;
  }

  const { maxFeePayerAge } = await getSystemSettings();

  if (age > maxFeePayerAge) {
    return {
      valid: false,
      age,
      message: `Fee payer is ${age} years old. Under TALVEX rules, the fee payer must not exceed ${maxFeePayerAge} years on the date of registration.`
    };
  }

  if (age < 18) {
    return {
      valid: false,
      age,
      message: `Fee payer is ${age} years old. Fee payer must be an adult of at least 18 years of age.`
    };
  }

  return {
    valid: true,
    age,
    message: `Fee payer is ${age} years old (Eligible: strictly within permitted limit of ${maxFeePayerAge} years).`
  };
}

/**
 * Determine income proof requirement based on relationship
 * Father / Mother => false (Exempt)
 * Other Family Member => true (Required)
 */
function isIncomeProofRequired(relationship) {
  const rel = (relationship || '').trim().toLowerCase();
  return !(rel === 'father' || rel === 'mother');
}

/**
 * Comprehensive registration payload validator
 */
async function validateRegistrationPayload(data) {
  const errors = [];

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('Student full name is required.');
  }
  if (!data.dob) {
    errors.push('Student date of birth is required.');
  }
  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid student email is required.');
  }
  if (!data.collegeId) {
    errors.push('Enrolled partner college selection is required.');
  }
  if (!data.courseFee || parseFloat(data.courseFee) <= 0) {
    errors.push('Valid total course tuition fee is required.');
  }
  if (!data.feePayerName || data.feePayerName.trim().length < 2) {
    errors.push('Fee payer full name is required.');
  }
  if (!data.feePayerRelationship) {
    errors.push('Fee payer relationship is required.');
  }

  // Age validation (now async)
  const ageResult = await validateFeePayerAge(data.feePayerDob);
  if (!ageResult.valid) {
    errors.push(ageResult.message);
  }

  // College verification doc check
  const docType = data.collegeDocType || data.docType;
  if (!docType || (docType !== 'FEE_RECEIPT' && docType !== 'COLLEGE_ID')) {
    errors.push('Valid College verification (College Fee Receipt or College ID Card) is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    age: ageResult.age,
    incomeProofRequired: isIncomeProofRequired(data.feePayerRelationship)
  };
}

module.exports = {
  getSystemSettings,
  validateFeePayerAge,
  isIncomeProofRequired,
  validateRegistrationPayload
};
