/**
 * Ensure Education CORE STATE & BUSINESS ENGINE
 * LocalStorage backed reactive state with configurable rules
 */

const TALVEX_STORAGE_KEY = 'talvex_platform_state_v1';

const defaultState = {
  // Configurable System Settings
  settings: {
    premiumPercentage: 1.0, // 1% paid by student
    collegeIncentivePercentage: 5.0, // 5% partner incentive (configurable in Admin)
    maxFeePayerAge: 55, // strictly <= 55 at registration
    currencySymbol: '₹',
  },

  // Active Session Role: 'public' | 'student' | 'college' | 'admin'
  currentRole: 'public',

  // Partner Colleges Directory
  colleges: [
    {
      id: 'COL-001',
      name: 'Apex Institute of Technology',
      code: 'AIT-DELHI',
      city: 'New Delhi',
      established: 2004,
      totalStudents: 2450,
      enrolledTalvex: 1820,
      activePolicies: 1760,
      pendingVerification: 60,
      incentiveAccrued: 308000,
      status: 'ACTIVE_PARTNER'
    },
    {
      id: 'COL-002',
      name: 'National Institute of Engineering & Research',
      code: 'NIER-BLR',
      city: 'Bengaluru',
      established: 1998,
      totalStudents: 3100,
      enrolledTalvex: 2240,
      activePolicies: 2190,
      pendingVerification: 50,
      incentiveAccrued: 442000,
      status: 'ACTIVE_PARTNER'
    },
    {
      id: 'COL-003',
      name: 'Imperial College of Science & Commerce',
      code: 'ICSC-MUM',
      city: 'Mumbai',
      established: 2011,
      totalStudents: 1800,
      enrolledTalvex: 1210,
      activePolicies: 1180,
      pendingVerification: 30,
      incentiveAccrued: 215000,
      status: 'ACTIVE_PARTNER'
    },
    {
      id: 'COL-004',
      name: 'Horizon Global University',
      code: 'HGU-PUNE',
      city: 'Pune',
      established: 2015,
      totalStudents: 1400,
      enrolledTalvex: 940,
      activePolicies: 915,
      pendingVerification: 25,
      incentiveAccrued: 168000,
      status: 'ACTIVE_PARTNER'
    }
  ],

  // Demo Student Profile & Policy
  student: {
    id: 'STU-2026-8841',
    fullName: 'Aarav Sharma',
    dob: '2004-05-14',
    email: 'aarav.sharma@apex.edu.in',
    phone: '+91 98765 43210',
    address: 'B-402, Green Avenue, Rohini, New Delhi 110085',
    collegeId: 'COL-001',
    collegeName: 'Apex Institute of Technology',
    course: 'BCA (Artificial Intelligence & Machine Learning)',
    program: 'Undergraduate Degree',
    academicYear: '2026 - 2029 (3 Years)',
    courseFee: 350000,
    feeReceiptNo: 'AIT-REC-2026-9932',
    studentIdCardNo: 'AIT-STU-8841',
    is2FAVerified: true,
    policy: {
      policyId: 'TVX-2026-8841',
      status: 'ACTIVE', // DRAFT | PENDING | ACTIVE | CLAIM_INITIATED | CLAIM_UNDER_REVIEW | CLAIM_APPROVED
      coverage: 'Comprehensive Course Tuition Protection',
      totalCourseFee: 350000,
      premiumRate: 1.0,
      premiumPaid: 3500,
      issueDate: '2026-08-10',
      validUntil: '2029-07-31',
      feePayer: {
        fullName: 'Rajesh Sharma',
        relationship: 'Father',
        dob: '1977-03-22',
        age: 49,
        phone: '+91 98111 22334',
        incomeProofRequired: false,
        incomeProofUploaded: false,
        incomeProofStatus: 'NOT_REQUIRED'
      },
      documents: [
        { id: 'DOC-1', name: 'College ID Card', type: 'COLLEGE_ID', status: 'VERIFIED', uploadDate: '2026-08-08' },
        { id: 'DOC-2', name: 'Official Fee Receipt', type: 'FEE_RECEIPT', status: 'VERIFIED', uploadDate: '2026-08-08' },
        { id: 'DOC-3', name: 'Fee Payer Government ID', type: 'FEE_PAYER_ID', status: 'VERIFIED', uploadDate: '2026-08-09' }
      ]
    }
  },

  // Student Roster for College / Admin management
  roster: [
    {
      studentId: 'STU-2026-8841',
      studentName: 'Aarav Sharma',
      collegeId: 'COL-001',
      course: 'BCA (AI & ML)',
      courseFee: 350000,
      premium: 3500,
      feePayer: 'Rajesh Sharma (Father)',
      feePayerAge: 49,
      policyId: 'TVX-2026-8841',
      status: 'ACTIVE',
      registeredOn: '2026-08-10'
    },
    {
      studentId: 'STU-2026-8842',
      studentName: 'Ananya Gupta',
      collegeId: 'COL-001',
      course: 'B.Tech Computer Science',
      courseFee: 480000,
      premium: 4800,
      feePayer: 'Sunita Gupta (Mother)',
      feePayerAge: 46,
      policyId: 'TVX-2026-8842',
      status: 'ACTIVE',
      registeredOn: '2026-08-14'
    },
    {
      studentId: 'STU-2026-8843',
      studentName: 'Devansh Kulkarni',
      collegeId: 'COL-001',
      course: 'BBA Finance',
      courseFee: 300000,
      premium: 3000,
      feePayer: 'Vikram Kulkarni (Uncle)',
      feePayerAge: 42,
      policyId: 'TVX-2026-8843',
      status: 'PENDING_VERIFICATION',
      registeredOn: '2026-09-08'
    },
    {
      studentId: 'STU-2026-8844',
      studentName: 'Priya Verma',
      collegeId: 'COL-001',
      course: 'MCA Cloud Systems',
      courseFee: 320000,
      premium: 3200,
      feePayer: 'Ramesh Verma (Father)',
      feePayerAge: 51,
      policyId: 'TVX-2026-4421',
      status: 'CLAIM_UNDER_REVIEW',
      registeredOn: '2026-07-20'
    },
    {
      studentId: 'STU-2026-8845',
      studentName: 'Kabir Mehta',
      collegeId: 'COL-001',
      course: 'B.Sc Data Science',
      courseFee: 280000,
      premium: 2800,
      feePayer: 'Anita Mehta (Mother)',
      feePayerAge: 45,
      policyId: 'TVX-2026-8845',
      status: 'ACTIVE',
      registeredOn: '2026-08-25'
    }
  ],

  // Claims in Platform
  claims: [
    {
      claimId: 'CLM-2026-019',
      policyId: 'TVX-2026-4421',
      studentId: 'STU-2026-8844',
      studentName: 'Priya Verma',
      college: 'Apex Institute of Technology',
      courseFee: 320000,
      feePayerName: 'Ramesh Verma',
      relationship: 'Father',
      dateOfDemise: '2026-09-01',
      submittedDate: '2026-09-04',
      status: 'UNDER_REVIEW', // UNDER_REVIEW | APPROVED | REJECTED
      deathCertificateAttached: true,
      notes: 'Initial institutional and municipal verification underway. Contact established with nominee.'
    }
  ],

  // Notification stream
  notifications: [
    { id: 'N-1', role: 'student', title: 'Policy Active', message: 'Your Education Protection Plan TVX-2026-8841 is active and verified.', time: 'Aug 10, 2026', read: true },
    { id: 'N-2', role: 'college', title: 'New Registration', message: 'Devansh Kulkarni submitted scheme documents for verification.', time: 'Sep 08, 2026', read: false },
    { id: 'N-3', role: 'admin', title: 'Claim Under Review', message: 'Claim CLM-2026-019 requires final document approval.', time: 'Sep 04, 2026', read: false }
  ]
};

class TalvexStore {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
  }

  loadState() {
    try {
      const stored = localStorage.getItem(TALVEX_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read stored Ensure Education state, falling back to defaults', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  saveState() {
    try {
      localStorage.setItem(TALVEX_STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Could not save Ensure Education state', e);
    }
    this.notify();
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // --- Business Rule Engine ---

  /**
   * Dynamically calculate 1% scheme premium from course fee
   * premium = courseFee * 0.01 (or configured rate)
   */
  calculatePremium(courseFee) {
    const fee = parseFloat(courseFee) || 0;
    const rate = this.state.settings.premiumPercentage / 100;
    return Math.round(fee * rate);
  }

  /**
   * College Incentive (Configurable in Admin, default 5%)
   */
  calculateCollegeIncentive(courseFee) {
    const fee = parseFloat(courseFee) || 0;
    const rate = this.state.settings.collegeIncentivePercentage / 100;
    return Math.round(fee * rate);
  }

  /**
   * Format currency into Indian Rupee format (e.g. ₹3,00,000)
   */
  formatCurrency(amount) {
    const val = Math.round(parseFloat(amount) || 0);
    return '₹' + val.toLocaleString('en-IN');
  }

  /**
   * Validate Fee Payer Age (must NOT be > 55 years old on registration date)
   */
  validateFeePayerAge(dobString, registrationDate = new Date()) {
    if (!dobString) {
      return { valid: false, age: 0, message: 'Date of birth is required.' };
    }
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) {
      return { valid: false, age: 0, message: 'Invalid date format.' };
    }

    const regDate = new Date(registrationDate);
    let age = regDate.getFullYear() - birthDate.getFullYear();
    const m = regDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && regDate.getDate() < birthDate.getDate())) {
      age--;
    }

    const maxAge = this.state.settings.maxFeePayerAge; // default 55
    if (age > maxAge) {
      return {
        valid: false,
        age,
        message: `Fee payer is ${age} years old. Under Ensure Education eligibility rules, the fee payer must not exceed ${maxAge} years on the registration date.`
      };
    }

    if (age < 18) {
      return {
        valid: false,
        age,
        message: `Fee payer is ${age} years old. Fee payer must be at least 18 years of age.`
      };
    }

    return {
      valid: true,
      age,
      message: `Eligible: Fee payer is ${age} years old (within the maximum limit of ${maxAge} years).`
    };
  }

  /**
   * Income proof requirement check
   * Father / Mother -> FALSE (no income proof)
   * Other family member -> TRUE (income proof required)
   */
  isIncomeProofRequired(relationship) {
    const rel = (relationship || '').trim().toLowerCase();
    if (rel === 'father' || rel === 'mother') {
      return false;
    }
    return true;
  }

  // --- State Modifiers ---

  setRole(role) {
    this.state.currentRole = role;
    this.saveState();
  }

  registerNewStudent(formData) {
    const courseFee = parseFloat(formData.courseFee) || 300000;
    const premium = this.calculatePremium(courseFee);
    const policyId = `TVX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentId = `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newStudent = {
      id: studentId,
      fullName: formData.fullName,
      dob: formData.dob,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      collegeId: formData.collegeId,
      collegeName: formData.collegeName || 'Apex Institute of Technology',
      course: formData.course,
      program: formData.program || 'Degree Program',
      academicYear: formData.academicYear || '2026 - 2029',
      courseFee: courseFee,
      feeReceiptNo: formData.feeReceiptNo || 'REC-' + Math.floor(10000 + Math.random() * 90000),
      studentIdCardNo: formData.studentIdCardNo || 'ID-' + Math.floor(1000 + Math.random() * 9000),
      is2FAVerified: true,
      policy: {
        policyId: policyId,
        status: 'ACTIVE',
        coverage: 'Comprehensive Course Tuition Protection',
        totalCourseFee: courseFee,
        premiumRate: this.state.settings.premiumPercentage,
        premiumPaid: premium,
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: '2029-07-31',
        feePayer: {
          fullName: formData.feePayerName,
          relationship: formData.feePayerRelationship,
          dob: formData.feePayerDob,
          age: formData.feePayerAge,
          phone: formData.feePayerPhone,
          incomeProofRequired: this.isIncomeProofRequired(formData.feePayerRelationship),
          incomeProofUploaded: true,
          incomeProofStatus: this.isIncomeProofRequired(formData.feePayerRelationship) ? 'VERIFIED' : 'NOT_REQUIRED'
        },
        documents: [
          { id: 'DOC-' + Date.now() + '-1', name: 'College Verification Document', type: formData.collegeDocType || 'COLLEGE_ID', status: 'VERIFIED', uploadDate: new Date().toISOString().split('T')[0] },
          { id: 'DOC-' + Date.now() + '-2', name: 'Fee Payer ID', type: 'FEE_PAYER_ID', status: 'VERIFIED', uploadDate: new Date().toISOString().split('T')[0] }
        ]
      }
    };

    // Update active student in store
    this.state.student = newStudent;

    // Add to roster
    this.state.roster.unshift({
      studentId: studentId,
      studentName: formData.fullName,
      collegeId: formData.collegeId,
      course: formData.course,
      courseFee: courseFee,
      premium: premium,
      feePayer: `${formData.feePayerName} (${formData.feePayerRelationship})`,
      feePayerAge: formData.feePayerAge,
      policyId: policyId,
      status: 'ACTIVE',
      registeredOn: new Date().toISOString().split('T')[0]
    });

    // Update College stats
    const col = this.state.colleges.find(c => c.id === formData.collegeId);
    if (col) {
      col.enrolledTalvex = (col.enrolledTalvex || 0) + 1;
      col.activePolicies = (col.activePolicies || 0) + 1;
      col.incentiveAccrued = (col.incentiveAccrued || 0) + this.calculateCollegeIncentive(courseFee);
    }

    // Add notification
    this.state.notifications.unshift({
      id: 'N-' + Date.now(),
      role: 'student',
      title: 'Policy Activated',
      message: `Education Protection Policy ${policyId} is now active. Course fee ₹${courseFee.toLocaleString('en-IN')} is protected.`,
      time: 'Just now',
      read: false
    });

    this.saveState();
    return newStudent;
  }

  submitClaim(claimData) {
    const claimId = `CLM-2026-0${Math.floor(20 + Math.random() * 80)}`;
    const newClaim = {
      claimId: claimId,
      policyId: this.state.student.policy.policyId,
      studentId: this.state.student.id,
      studentName: this.state.student.fullName,
      college: this.state.student.collegeName,
      courseFee: this.state.student.courseFee,
      feePayerName: this.state.student.policy.feePayer.fullName,
      relationship: this.state.student.policy.feePayer.relationship,
      dateOfDemise: claimData.dateOfDemise,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'UNDER_REVIEW',
      deathCertificateAttached: true,
      notes: claimData.notes || 'Claim initiated by student following unfortunate event. Verification initiated.'
    };

    this.state.claims.unshift(newClaim);
    if (this.state.student.policy) {
      this.state.student.policy.status = 'CLAIM_UNDER_REVIEW';
    }

    // Update in roster as well
    const rosterItem = this.state.roster.find(r => r.policyId === newClaim.policyId);
    if (rosterItem) {
      rosterItem.status = 'CLAIM_UNDER_REVIEW';
    }

    this.state.notifications.unshift({
      id: 'N-' + Date.now(),
      role: 'student',
      title: 'Claim Submitted',
      message: `Claim ${claimId} has been lodged and is under review by the Ensure Education adjudication committee.`,
      time: 'Just now',
      read: false
    });

    this.saveState();
    return newClaim;
  }

  adjudicateClaim(claimId, newStatus, reason = '') {
    const claim = this.state.claims.find(c => c.claimId === claimId);
    if (claim) {
      claim.status = newStatus;
      claim.adjudicationNotes = reason;

      const studentRoster = this.state.roster.find(r => r.policyId === claim.policyId);
      if (studentRoster) {
        studentRoster.status = newStatus === 'APPROVED' ? 'CLAIM_APPROVED' : 'CLAIM_REJECTED';
      }

      if (this.state.student.policy && this.state.student.policy.policyId === claim.policyId) {
        this.state.student.policy.status = newStatus === 'APPROVED' ? 'CLAIM_APPROVED' : 'CLAIM_REJECTED';
      }

      this.saveState();
    }
  }

  updateSettings(newSettings) {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.saveState();
  }

  verifyRosterStudent(studentId) {
    const item = this.state.roster.find(r => r.studentId === studentId);
    if (item) {
      item.status = 'ACTIVE';
      this.saveState();
    }
  }
}

// Global singleton instance
window.talvexStore = new TalvexStore();
