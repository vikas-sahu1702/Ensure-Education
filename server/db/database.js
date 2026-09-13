const mongoose = require('mongoose');
const config = require('../config');

// Connect to MongoDB
mongoose.connect(config.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Schemas
const systemSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  description: String,
}, { timestamps: true });

const collegeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  established_year: Number,
  total_students: { type: Number, default: 0 },
  enrolled_talvex: { type: Number, default: 0 },
  active_policies: { type: Number, default: 0 },
  pending_verification: { type: Number, default: 0 },
  incentive_accrued: { type: Number, default: 0 },
  status: { type: String, default: 'ACTIVE_PARTNER' },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['STUDENT', 'COLLEGE', 'ADMIN'], required: true },
  college_id: String,
  is_2fa_enabled: { type: Boolean, default: true },
  last_login: Date,
}, { timestamps: true });

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: String,
  full_name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  college_id: { type: String, required: true },
  course: { type: String, required: true },
  program: { type: String, required: true },
  academic_year: { type: String, required: true },
  course_fee: { type: Number, required: true },
  fee_receipt_no: String,
  student_id_card_no: String,
  doc_type: { type: String, required: true },
}, { timestamps: true });

const feePayerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  student_id: { type: String, required: true },
  full_name: { type: String, required: true },
  relationship: { type: String, required: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  income_proof_required: { type: Boolean, required: true },
  income_proof_status: { type: String, required: true },
}, { timestamps: true });

const policySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  student_id: { type: String, required: true },
  fee_payer_id: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'PENDING_VERIFICATION', 'ACTIVE', 'CLAIM_UNDER_REVIEW', 'CLAIM_APPROVED', 'CLAIM_REJECTED'], required: true },
  coverage_scope: { type: String, required: true },
  total_course_fee: { type: Number, required: true },
  premium_rate: { type: Number, required: true },
  premium_paid: { type: Number, required: true },
  issue_date: { type: Date, required: true },
  valid_until: { type: Date, required: true },
}, { timestamps: true });

const claimSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  policy_id: { type: String, required: true },
  student_id: { type: String, required: true },
  date_of_demise: { type: Date, required: true },
  death_certificate_filename: String,
  status: { type: String, enum: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'], default: 'UNDER_REVIEW' },
  adjudication_notes: String,
  submitted_at: { type: Date, default: Date.now },
  adjudicated_at: Date,
}, { timestamps: true });

const documentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  student_id: { type: String, required: true },
  policy_id: String,
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'], default: 'UPLOADED' },
  rejection_reason: String,
}, { timestamps: true });

const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: String,
  role: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
}, { timestamps: true });

const auditLogSchema = new mongoose.Schema({
  actor_role: { type: String, required: true },
  action: { type: String, required: true },
  details: String,
  ip_address: String,
}, { timestamps: true });

const models = {
  mongoose, // export mongoose instance for transaction support if needed
  SystemSetting: mongoose.model('SystemSetting', systemSettingsSchema),
  College: mongoose.model('College', collegeSchema),
  User: mongoose.model('User', userSchema),
  Student: mongoose.model('Student', studentSchema),
  FeePayer: mongoose.model('FeePayer', feePayerSchema),
  Policy: mongoose.model('Policy', policySchema),
  Claim: mongoose.model('Claim', claimSchema),
  Document: mongoose.model('Document', documentSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  AuditLog: mongoose.model('AuditLog', auditLogSchema)
};

module.exports = models;
