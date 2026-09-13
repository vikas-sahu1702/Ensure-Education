/**
 * TALVEX COMPREHENSIVE AUTOMATED REST API TEST SUITE
 * Tests all endpoints, eligibility rules, and calculations.
 */

const http = require('node:http');

const BASE_URL = 'http://127.0.0.1:3000';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('STARTING TALVEX AUTOMATED BACKEND INTEGRATION TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, extra = '') {
    if (condition) {
      console.log(`[PASS] ${testName} ${extra ? `(${extra})` : ''}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${extra ? `(${extra})` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await makeRequest('GET', '/api/v1/health');
    assert(health.status === 200 && health.body.status === 'ONLINE', '1. System Health Check');

    // 2. Dynamic 1% Calculator (Fee: ₹3,00,000 -> 1% = ₹3,000)
    const calc1 = await makeRequest('POST', '/api/v1/calculate-premium', { courseFee: 300000 });
    assert(
      calc1.status === 200 &&
      calc1.body.studentCalculation.premiumAmount === 3000 &&
      calc1.body.studentCalculation.schemeRatePercentage === 1.0 &&
      calc1.body.institutionalIncentive.incentiveAmount === 15000,
      '2. Dynamic Calculator (₹3,00,000 Fee -> 1% Premium = ₹3,000, 5% College Incentive = ₹15,000)'
    );

    // 3. Dynamic 1% Calculator (Fee: ₹4,80,000 -> 1% = ₹4,800)
    const calc2 = await makeRequest('POST', '/api/v1/calculate-premium', { courseFee: 480000 });
    assert(
      calc2.status === 200 && calc2.body.studentCalculation.premiumAmount === 4800,
      '3. Dynamic Calculator (₹4,80,000 Fee -> 1% Premium = ₹4,800)'
    );

    // 4. Authentication Login
    const login = await makeRequest('POST', '/api/v1/auth/login', {
      email: 'aarav.sharma@apex.edu.in',
      password: 'password123'
    });
    assert(login.status === 200 && login.body.requires2FA === true, '4. Student Authentication & 2FA Required');

    // 5. 2FA Verification
    const verify2FA = await makeRequest('POST', '/api/v1/auth/verify-2fa', {
      userId: login.body.userId,
      otp: '482910'
    });
    assert(verify2FA.status === 200 && verify2FA.body.token, '5. 2-Step Authentication (2FA) Code Verification');

    // 6. Strict Eligibility Rule: Reject Fee Payer Age > 55
    const invalidReg = await makeRequest('POST', '/api/v1/register', {
      fullName: 'Test Student Over-Age',
      dob: '2004-01-01',
      email: 'test.overage@apex.edu.in',
      phone: '+91 99999 11111',
      collegeId: 'COL-001',
      collegeDocType: 'COLLEGE_ID',
      course: 'B.Tech IT',
      courseFee: 400000,
      feePayerName: 'Grandfather Senior',
      feePayerRelationship: 'Grandfather',
      feePayerDob: '1960-05-10' // Age ~66 years old (> 55)
    });
    assert(
      invalidReg.status === 422 && invalidReg.body.details && invalidReg.body.details.some(d => d.includes('must not exceed 55 years')),
      '6. Strict Eligibility: Reject Registration when Fee Payer Age > 55'
    );

    // 7. Successful Student Registration & Policy Issuance (Fee Payer Age <= 55)
    const validReg = await makeRequest('POST', '/api/v1/register', {
      fullName: 'Vikramaditya Roy',
      dob: '2004-06-15',
      email: `vikram.${Date.now()}@apex.edu.in`,
      phone: '+91 98765 00001',
      collegeId: 'COL-001',
      collegeDocType: 'FEE_RECEIPT',
      course: 'BCA Cloud Computing',
      program: 'Undergraduate',
      academicYear: '2026 - 2029',
      courseFee: 320000,
      feePayerName: 'Sunil Roy',
      feePayerRelationship: 'Father',
      feePayerDob: '1979-02-14' // Age ~47 (Eligible)
    });
    assert(
      validReg.status === 201 && validReg.body.policy && validReg.body.policy.id.startsWith('TVX-2026-') &&
      validReg.body.policy.premium_paid === 3200,
      '7. Registration & Policy Issuance (Valid Age <= 55, 1% Premium = ₹3,200)'
    );

    const createdPolicyId = validReg.body.policy.id;

    // 8. Fetch Policy Details
    const policyGet = await makeRequest('GET', `/api/v1/student/policy?policyId=${createdPolicyId}`);
    assert(
      policyGet.status === 200 && policyGet.body.policy.status === 'ACTIVE',
      '8. Student Policy Inquiry & Document Inspection'
    );

    // 9. Lodge a Bereavement Claim
    const claim = await makeRequest('POST', '/api/v1/student/claims', {
      policyId: createdPolicyId,
      dateOfDemise: '2026-09-02',
      deathCertificateFilename: 'municipal_death_cert.pdf',
      notes: 'Bereavement notification filed per institutional guidelines.'
    });
    assert(
      claim.status === 201 && claim.body.claim.status === 'UNDER_REVIEW',
      '9. Bereavement Claim Filing (Transitions to UNDER_REVIEW)'
    );

    const createdClaimId = claim.body.claim.id;

    // 10. Partner College Dashboard
    const colDash = await makeRequest('GET', '/api/v1/college/dashboard?collegeId=COL-001');
    assert(
      colDash.status === 200 && colDash.body.college.enrolledTalvex > 0,
      '10. Partner College Institutional Dashboard KPIs'
    );

    // 11. Partner College Student Roster with Search
    const colRoster = await makeRequest('GET', '/api/v1/college/students?collegeId=COL-001&search=Vikramaditya');
    assert(
      colRoster.status === 200 && colRoster.body.students.length > 0,
      '11. College Student Roster Live Search & Filtering'
    );

    // 12. Platform Admin Dashboard
    const adminDash = await makeRequest('GET', '/api/v1/admin/dashboard');
    assert(
      adminDash.status === 200 && adminDash.body.metrics.totalCourseFeesProtected > 0,
      '12. Platform Admin Global Financials & Policy Tracking'
    );

    // 13. Admin Claim Adjudication (Approve Claim)
    const adjudicate = await makeRequest('PUT', `/api/v1/admin/claims/${createdClaimId}/adjudicate`, {
      decision: 'APPROVE',
      notes: 'Official municipal death registration verified with partner college registrar.'
    });
    assert(
      adjudicate.status === 200 && adjudicate.body.claim.status === 'APPROVED',
      '13. Admin Claim Adjudication: Approve Bereavement Claim'
    );

    // 14. Admin Settings Retrieval
    const settings = await makeRequest('GET', '/api/v1/admin/settings');
    assert(
      settings.status === 200 && parseFloat(settings.body.settings.premium_percentage) === 1.0,
      '14. Admin System Settings Retrieval'
    );

    // 15. Admin Settings Update
    const updateSettings = await makeRequest('PUT', '/api/v1/admin/settings', {
      premium_percentage: 1.0,
      college_incentive_percentage: 5.0,
      max_fee_payer_age: 55
    });
    assert(
      updateSettings.status === 200 && updateSettings.body.settings.max_fee_payer_age === '55',
      '15. Admin System Settings Parameter Update & Persistence'
    );

  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
