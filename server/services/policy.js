/**
 * TALVEX POLICY & CLAIMS LIFECYCLE SERVICE
 */

const { User, Student, FeePayer, Policy, Claim, Document, College, AuditLog, mongoose } = require('../db/database');
const { calculatePremium, calculateCollegeIncentive } = require('./calculator');
const { validateRegistrationPayload } = require('./eligibility');

/**
 * Register a student and issue a new Education Protection Policy
 */
async function issuePolicy(registrationData) {
  // Validate eligibility first
  const validation = await validateRegistrationPayload(registrationData);
  if (!validation.isValid) {
    const error = new Error('Eligibility validation failed.');
    error.status = 422;
    error.details = validation.errors;
    throw error;
  }

  const courseFee = parseFloat(registrationData.courseFee);
  const premiumCalc = calculatePremium(courseFee);
  const collegeIncentiveCalc = calculateCollegeIncentive(courseFee);

  const studentId = `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const feePayerId = `FP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const policyId = `TVX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const userId = `USR-${studentId}`;

  // Execute sequentially (transactions require MongoDB replica sets)
  try {
    // 1. Create User
    await User.create({
      id: userId,
      email: registrationData.email,
      phone: registrationData.phone || '',
      password_hash: 'demo_password_hash',
      role: 'STUDENT',
      college_id: registrationData.collegeId
    });

    // 2. Create Student
    await Student.create({
      id: studentId,
      user_id: userId,
      full_name: registrationData.fullName,
      dob: new Date(registrationData.dob),
      email: registrationData.email,
      phone: registrationData.phone || '',
      address: registrationData.address || 'India',
      college_id: registrationData.collegeId,
      course: registrationData.course,
      program: registrationData.program || 'Degree Program',
      academic_year: registrationData.academicYear || '2026 - 2029',
      course_fee: courseFee,
      fee_receipt_no: registrationData.feeReceiptNo || `REC-${Math.floor(10000 + Math.random() * 90000)}`,
      student_id_card_no: registrationData.studentIdCardNo || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      doc_type: registrationData.collegeDocType || 'FEE_RECEIPT'
    });

    // 3. Create Fee Payer
    await FeePayer.create({
      id: feePayerId,
      student_id: studentId,
      full_name: registrationData.feePayerName,
      relationship: registrationData.feePayerRelationship,
      dob: new Date(registrationData.feePayerDob),
      age: validation.age,
      phone: registrationData.feePayerPhone || '',
      income_proof_required: validation.incomeProofRequired,
      income_proof_status: validation.incomeProofRequired ? 'VERIFIED' : 'NOT_REQUIRED'
    });

    // 4. Create Policy
    const issueDate = new Date();
    const validUntil = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000);

    await Policy.create({
      id: policyId,
      student_id: studentId,
      fee_payer_id: feePayerId,
      status: 'ACTIVE',
      coverage_scope: 'Comprehensive Course Tuition Protection against Registered Fee Payer Demise',
      total_course_fee: courseFee,
      premium_rate: premiumCalc.premiumRatePercentage,
      premium_paid: premiumCalc.premiumAmount,
      issue_date: issueDate,
      valid_until: validUntil
    });

    // 5. Create Documents
    const docsToInsert = [
      { id: `DOC-${Date.now()}-1`, student_id: studentId, policy_id: policyId, name: 'College Admission Verification Proof', type: registrationData.collegeDocType || 'FEE_RECEIPT', status: 'VERIFIED' },
      { id: `DOC-${Date.now()}-2`, student_id: studentId, policy_id: policyId, name: 'Fee Payer Government ID', type: 'FEE_PAYER_ID', status: 'VERIFIED' }
    ];
    
    if (validation.incomeProofRequired) {
      docsToInsert.push({ id: `DOC-${Date.now()}-3`, student_id: studentId, policy_id: policyId, name: 'Fee Payer Income Proof', type: 'INCOME_PROOF', status: 'VERIFIED' });
    }
    
    await Document.insertMany(docsToInsert);

    // 6. Update College Statistics
    await College.updateOne(
      { id: registrationData.collegeId },
      { 
        $inc: { 
          enrolled_talvex: 1, 
          active_policies: 1, 
          incentive_accrued: collegeIncentiveCalc.incentiveAmount 
        } 
      }
    );

    // 7. Add Audit Log
    await AuditLog.create({
      actor_role: 'STUDENT',
      action: 'POLICY_ISSUANCE',
      details: `Policy ${policyId} activated for student ${studentId} with 1% premium of ₹${premiumCalc.premiumAmount}`
    });

    return await getPolicyDetails(policyId);
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch full policy record with student, college, fee payer, and documents
 */
async function getPolicyDetails(policyId) {
  const policy = await Policy.findOne({ id: policyId }).lean();
  if (!policy) return null;

  const student = await Student.findOne({ id: policy.student_id }).lean();
  const college = student ? await College.findOne({ id: student.college_id }).lean() : null;
  const feePayer = await FeePayer.findOne({ id: policy.fee_payer_id }).lean();
  const documents = await Document.find({ policy_id: policyId }).lean();

  return {
    ...policy,
    student_name: student?.full_name,
    student_dob: student?.dob,
    student_email: student?.email,
    student_phone: student?.phone,
    course: student?.course,
    program: student?.program,
    academic_year: student?.academic_year,
    college_name: college?.name,
    college_code: college?.code,
    college_city: college?.city,
    fee_payer_name: feePayer?.full_name,
    fee_payer_relationship: feePayer?.relationship,
    fee_payer_dob: feePayer?.dob,
    fee_payer_age: feePayer?.age,
    fee_payer_phone: feePayer?.phone,
    income_proof_required: feePayer?.income_proof_required,
    income_proof_status: feePayer?.income_proof_status,
    documents: documents.map(d => ({
      id: d.id,
      name: d.name,
      type: d.type,
      status: d.status,
      created_at: d.createdAt
    }))
  };
}

/**
 * Lodge a bereavement claim
 */
async function submitClaim(claimData) {
  const policy = await getPolicyDetails(claimData.policyId);
  if (!policy) {
    const err = new Error('Policy not found.');
    err.status = 404;
    throw err;
  }

  if (policy.status !== 'ACTIVE') {
    const err = new Error(`Cannot initiate claim: Policy status is currently ${policy.status}`);
    err.status = 400;
    throw err;
  }

  const claimId = `CLM-2026-${Math.floor(100 + Math.random() * 900)}`;

  try {
    await Claim.create({
      id: claimId,
      policy_id: claimData.policyId,
      student_id: policy.student_id,
      date_of_demise: new Date(claimData.dateOfDemise),
      death_certificate_filename: claimData.deathCertificateFilename || 'death_certificate.pdf',
      status: 'UNDER_REVIEW',
      adjudication_notes: claimData.notes || 'Claim initiated by student. Document verification underway.'
    });

    await Policy.updateOne(
      { id: claimData.policyId },
      { $set: { status: 'CLAIM_UNDER_REVIEW' } }
    );

    await AuditLog.create({
      actor_role: 'STUDENT',
      action: 'CLAIM_SUBMISSION',
      details: `Claim ${claimId} lodged for policy ${claimData.policyId}`
    });

    return await Claim.findOne({ id: claimId }).lean();
  } catch (err) {
    throw err;
  }
}

/**
 * Adjudicate a claim (Approve or Reject)
 */
async function adjudicateClaim(claimId, decision, notes) {
  const claim = await Claim.findOne({ id: claimId }).lean();
  if (!claim) {
    const err = new Error('Claim not found.');
    err.status = 404;
    throw err;
  }

  const newStatus = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
  const newPolicyStatus = decision === 'APPROVE' ? 'CLAIM_APPROVED' : 'CLAIM_REJECTED';

  try {
    await Claim.updateOne(
      { id: claimId },
      { 
        $set: { 
          status: newStatus, 
          adjudication_notes: notes || 'Adjudication completed per policy terms', 
          adjudicated_at: new Date() 
        } 
      }
    );

    await Policy.updateOne(
      { id: claim.policy_id },
      { $set: { status: newPolicyStatus } }
    );

    await AuditLog.create({
      actor_role: 'ADMIN',
      action: 'CLAIM_ADJUDICATION',
      details: `Claim ${claimId} marked ${newStatus}. Notes: ${notes}`
    });

    return await Claim.findOne({ id: claimId }).lean();
  } catch (err) {
    throw err;
  }
}

module.exports = {
  issuePolicy,
  getPolicyDetails,
  submitClaim,
  adjudicateClaim
};
