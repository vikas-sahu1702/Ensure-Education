/**
 * TALVEX DATABASE SEEDER
 * Populates database with initial institutional demo data
 */

const mongoose = require('mongoose');
const { SystemSetting, College, User, Student, FeePayer, Policy, Document, Claim, Notification, mongoose: dbMongoose } = require('./database');
const config = require('../config');

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB for seeding...');
    // We rely on database.js to connect, so we might just wait a bit or use mongoose.connection.readyState
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    console.log('Clearing existing data...');
    await Promise.all([
      SystemSetting.deleteMany({}),
      College.deleteMany({}),
      User.deleteMany({}),
      Student.deleteMany({}),
      FeePayer.deleteMany({}),
      Policy.deleteMany({}),
      Document.deleteMany({}),
      Claim.deleteMany({}),
      Notification.deleteMany({})
    ]);

    console.log('Seeding System Settings...');
    await SystemSetting.insertMany([
      { key: 'premium_percentage', value: String(config.DEFAULTS.PREMIUM_PERCENTAGE), description: 'Dynamic scheme protection percentage paid by student (default 1%)' },
      { key: 'college_incentive_percentage', value: String(config.DEFAULTS.COLLEGE_INCENTIVE_PERCENTAGE), description: 'Administrative incentive paid to partner college (default 5%)' },
      { key: 'max_fee_payer_age', value: String(config.DEFAULTS.MAX_FEE_PAYER_AGE), description: 'Maximum permitted fee payer age on registration date (strictly <= 55)' },
      { key: 'currency_symbol', value: '₹', description: 'Base currency symbol for platform' }
    ]);

    console.log('Seeding Colleges...');
    await College.insertMany([
      { id: 'COL-001', name: 'Apex Institute of Technology', code: 'AIT-DELHI', city: 'New Delhi', established_year: 2004, total_students: 2450, enrolled_talvex: 1820, active_policies: 1760, pending_verification: 60, incentive_accrued: 308000, status: 'ACTIVE_PARTNER' },
      { id: 'COL-002', name: 'National Institute of Engineering & Research', code: 'NIER-BLR', city: 'Bengaluru', established_year: 1998, total_students: 3100, enrolled_talvex: 2240, active_policies: 2190, pending_verification: 50, incentive_accrued: 442000, status: 'ACTIVE_PARTNER' },
      { id: 'COL-003', name: 'Imperial College of Science & Commerce', code: 'ICSC-MUM', city: 'Mumbai', established_year: 2011, total_students: 1800, enrolled_talvex: 1210, active_policies: 1180, pending_verification: 30, incentive_accrued: 215000, status: 'ACTIVE_PARTNER' },
      { id: 'COL-004', name: 'Horizon Global University', code: 'HGU-PUNE', city: 'Pune', established_year: 2015, total_students: 1400, enrolled_talvex: 940, active_policies: 915, pending_verification: 25, incentive_accrued: 168000, status: 'ACTIVE_PARTNER' }
    ]);

    console.log('Seeding Users...');
    await User.insertMany([
      { id: 'USR-STU-001', email: 'aarav.sharma@apex.edu.in', phone: '+91 98765 43210', password_hash: 'demo_hash_student_password', role: 'STUDENT', college_id: 'COL-001' },
      { id: 'USR-COL-001', email: 'registrar@apex.edu.in', phone: '+91 11 2700 8899', password_hash: 'demo_hash_college_password', role: 'COLLEGE', college_id: 'COL-001' },
      { id: 'USR-ADM-001', email: 'admin@talvex.org', phone: '+91 11 4000 1100', password_hash: 'demo_hash_admin_password', role: 'ADMIN', college_id: null }
    ]);

    console.log('Seeding Students...');
    await Student.insertMany([
      { id: 'STU-2026-8841', user_id: 'USR-STU-001', full_name: 'Aarav Sharma', dob: new Date('2004-05-14'), email: 'aarav.sharma@apex.edu.in', phone: '+91 98765 43210', address: 'B-402, Green Avenue, Rohini, New Delhi 110085', college_id: 'COL-001', course: 'BCA (Artificial Intelligence & Machine Learning)', program: 'Undergraduate Degree', academic_year: '2026 - 2029 (3 Years)', course_fee: 350000, fee_receipt_no: 'AIT-REC-2026-9932', student_id_card_no: 'AIT-STU-8841', doc_type: 'FEE_RECEIPT' },
      { id: 'STU-2026-8842', user_id: null, full_name: 'Ananya Gupta', dob: new Date('2004-09-12'), email: 'ananya.gupta@apex.edu.in', phone: '+91 98765 11223', address: 'New Delhi', college_id: 'COL-001', course: 'B.Tech Computer Science', program: 'Undergraduate', academic_year: '2026-2030', course_fee: 480000, fee_receipt_no: 'REC-8842', student_id_card_no: 'ID-8842', doc_type: 'COLLEGE_ID' },
      { id: 'STU-2026-8843', user_id: null, full_name: 'Devansh Kulkarni', dob: new Date('2005-01-20'), email: 'devansh.k@apex.edu.in', phone: '+91 98765 77889', address: 'New Delhi', college_id: 'COL-001', course: 'BBA Finance', program: 'Undergraduate', academic_year: '2026-2029', course_fee: 300000, fee_receipt_no: 'REC-8843', student_id_card_no: 'ID-8843', doc_type: 'FEE_RECEIPT' },
      { id: 'STU-2026-8844', user_id: null, full_name: 'Priya Verma', dob: new Date('2003-11-05'), email: 'priya.v@apex.edu.in', phone: '+91 98765 33445', address: 'New Delhi', college_id: 'COL-001', course: 'MCA Cloud Systems', program: 'Postgraduate', academic_year: '2026-2028', course_fee: 320000, fee_receipt_no: 'REC-8844', student_id_card_no: 'ID-8844', doc_type: 'FEE_RECEIPT' }
    ]);

    console.log('Seeding Fee Payers...');
    await FeePayer.insertMany([
      { id: 'FP-2026-8841', student_id: 'STU-2026-8841', full_name: 'Rajesh Sharma', relationship: 'Father', dob: new Date('1977-03-22'), age: 49, phone: '+91 98111 22334', income_proof_required: false, income_proof_status: 'NOT_REQUIRED' },
      { id: 'FP-2026-8842', student_id: 'STU-2026-8842', full_name: 'Sunita Gupta', relationship: 'Mother', dob: new Date('1980-04-10'), age: 46, phone: '+91 98765 44332', income_proof_required: false, income_proof_status: 'NOT_REQUIRED' },
      { id: 'FP-2026-8843', student_id: 'STU-2026-8843', full_name: 'Vikram Kulkarni', relationship: 'Uncle', dob: new Date('1984-06-15'), age: 42, phone: '+91 98765 99001', income_proof_required: true, income_proof_status: 'VERIFIED' },
      { id: 'FP-2026-8844', student_id: 'STU-2026-8844', full_name: 'Ramesh Verma', relationship: 'Father', dob: new Date('1975-08-19'), age: 51, phone: '+91 98765 22114', income_proof_required: false, income_proof_status: 'NOT_REQUIRED' }
    ]);

    console.log('Seeding Policies...');
    await Policy.insertMany([
      { id: 'TVX-2026-8841', student_id: 'STU-2026-8841', fee_payer_id: 'FP-2026-8841', status: 'ACTIVE', coverage_scope: 'Comprehensive Course Tuition Protection against Registered Fee Payer Demise', total_course_fee: 350000, premium_rate: 1.0, premium_paid: 3500, issue_date: new Date('2026-08-10'), valid_until: new Date('2029-07-31') },
      { id: 'TVX-2026-8842', student_id: 'STU-2026-8842', fee_payer_id: 'FP-2026-8842', status: 'ACTIVE', coverage_scope: 'Tuition Protection', total_course_fee: 480000, premium_rate: 1.0, premium_paid: 4800, issue_date: new Date('2026-08-14'), valid_until: new Date('2030-07-31') },
      { id: 'TVX-2026-8843', student_id: 'STU-2026-8843', fee_payer_id: 'FP-2026-8843', status: 'PENDING_VERIFICATION', coverage_scope: 'Tuition Protection', total_course_fee: 300000, premium_rate: 1.0, premium_paid: 3000, issue_date: new Date('2026-09-08'), valid_until: new Date('2029-07-31') },
      { id: 'TVX-2026-4421', student_id: 'STU-2026-8844', fee_payer_id: 'FP-2026-8844', status: 'CLAIM_UNDER_REVIEW', coverage_scope: 'Tuition Protection', total_course_fee: 320000, premium_rate: 1.0, premium_paid: 3200, issue_date: new Date('2026-07-20'), valid_until: new Date('2028-07-31') }
    ]);

    console.log('Seeding Documents...');
    await Document.insertMany([
      { id: 'DOC-01', student_id: 'STU-2026-8841', policy_id: 'TVX-2026-8841', name: 'College Student ID Card', type: 'COLLEGE_ID', status: 'VERIFIED' },
      { id: 'DOC-02', student_id: 'STU-2026-8841', policy_id: 'TVX-2026-8841', name: 'Official Fee Receipt (AIT-REC-2026-9932)', type: 'FEE_RECEIPT', status: 'VERIFIED' },
      { id: 'DOC-03', student_id: 'STU-2026-8841', policy_id: 'TVX-2026-8841', name: 'Fee Payer Government ID', type: 'FEE_PAYER_ID', status: 'VERIFIED' }
    ]);

    console.log('Seeding Claims...');
    await Claim.insertMany([
      { id: 'CLM-2026-019', policy_id: 'TVX-2026-4421', student_id: 'STU-2026-8844', date_of_demise: new Date('2026-09-01'), death_certificate_filename: 'death_cert_ramesh_verma.pdf', status: 'UNDER_REVIEW', adjudication_notes: 'Initial municipal registration record confirmed. Awaiting final college verification of remaining semester dues.' }
    ]);

    console.log('Seeding Notifications...');
    await Notification.insertMany([
      { id: 'NOTIF-01', user_id: 'USR-STU-001', role: 'STUDENT', title: 'Policy Active', message: 'Your Education Protection Plan TVX-2026-8841 is active and verified.', is_read: true },
      { id: 'NOTIF-02', user_id: 'USR-COL-001', role: 'COLLEGE', title: 'New Registration', message: 'Devansh Kulkarni submitted scheme documents for verification.', is_read: false },
      { id: 'NOTIF-03', user_id: 'USR-ADM-001', role: 'ADMIN', title: 'Claim Under Review', message: 'Claim CLM-2026-019 requires final document adjudication.', is_read: false }
    ]);

    console.log('TALVEX MongoDB successfully seeded with institutional test data.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
