/**
 * TALVEX PARTNER COLLEGE ROUTES
 */

const { College, Student, Policy, FeePayer, Document, User } = require('../db/database');
const crypto = require('crypto');

async function handleCollegeDashboard(req, res, query) {
  try {
    const collegeId = query.collegeId || 'COL-001';
    const college = await College.findOne({ id: collegeId }).lean();

    if (!college) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'College not found' }));
      return;
    }

    // Live aggregated counts
    const studentsDocs = await Student.find({ college_id: collegeId }).lean();
    const studentIds = studentsDocs.map(s => s.id);

    const policiesStats = await Policy.aggregate([
      { $match: { student_id: { $in: studentIds } } },
      {
        $group: {
          _id: null,
          active_count: {
            $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] }
          },
          pending_count: {
            $sum: { $cond: [{ $eq: ['$status', 'PENDING_VERIFICATION'] }, 1, 0] }
          },
          total_premium_volume: { $sum: '$premium_paid' }
        }
      }
    ]);

    const stats = policiesStats[0] || { active_count: 0, pending_count: 0, total_premium_volume: 0 };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      college: {
        id: college.id,
        name: college.name,
        code: college.code,
        city: college.city,
        totalStudents: college.total_students,
        enrolledTalvex: college.enrolled_talvex,
        activePolicies: college.active_policies,
        pendingVerification: college.pending_verification,
        incentiveAccrued: college.incentive_accrued
      },
      liveRosterStats: {
        total_roster: studentsDocs.length,
        active_count: stats.active_count,
        pending_count: stats.pending_count,
        total_premium_volume: stats.total_premium_volume
      }
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleCollegeStudents(req, res, query) {
  try {
    const collegeId = query.collegeId || 'COL-001';
    const search = (query.search || '').trim().toLowerCase();
    const status = query.status || 'ALL';

    const studentsDocs = await Student.find({ college_id: collegeId }).sort({ createdAt: -1 }).lean();
    let results = [];

    for (let s of studentsDocs) {
      const p = await Policy.findOne({ student_id: s.id }).lean();
      if (!p) continue;

      if (status !== 'ALL' && p.status !== status) continue;

      if (search) {
        if (
          !s.full_name.toLowerCase().includes(search) &&
          !s.course.toLowerCase().includes(search) &&
          !p.id.toLowerCase().includes(search)
        ) {
          continue;
        }
      }

      const fp = await FeePayer.findOne({ student_id: s.id }).lean();

      results.push({
        student_id: s.id,
        student_name: s.full_name,
        course: s.course,
        course_fee: s.course_fee,
        registered_on: s.createdAt,
        policy_id: p.id,
        policy_status: p.status,
        premium_paid: p.premium_paid,
        fee_payer_name: fp ? fp.full_name : null,
        fee_payer_relationship: fp ? fp.relationship : null,
        fee_payer_age: fp ? fp.age : null
      });
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      count: results.length,
      students: results
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleVerifyStudent(req, res, studentId) {
  try {
    const student = await Student.findOne({ id: studentId }).lean();
    if (!student) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Student not found' }));
      return;
    }

    await Policy.updateMany({ student_id: studentId }, { $set: { status: 'ACTIVE' } });
    await Document.updateMany({ student_id: studentId }, { $set: { status: 'VERIFIED' } });
    
    const college = await College.findOne({ id: student.college_id }).lean();
    if (college) {
      const newPending = Math.max(0, (college.pending_verification || 0) - 1);
      await College.updateOne(
        { id: student.college_id }, 
        { 
          $set: { pending_verification: newPending },
          $inc: { active_policies: 1 } 
        }
      );
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: `Student ${studentId} credentials verified. Policy transitioned to ACTIVE.`
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleCollegeRegister(req, res, body) {
  try {
    const { name, code, city, established_year, email, password } = body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw { status: 400, message: 'Email already registered.' };
    }

    const collegeId = `COL-${Math.floor(100 + Math.random() * 900)}`;

    const newCollege = new College({
      id: collegeId,
      name,
      code,
      city,
      established_year,
      status: 'ACTIVE_PARTNER'
    });
    await newCollege.save();

    // Hashing password trivially for the prototype. Use bcrypt in production.
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    const newUser = new User({
      id: `USR-${Date.now()}`,
      email,
      password_hash: passwordHash,
      role: 'COLLEGE',
      college_id: collegeId,
    });
    await newUser.save();

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'College successfully registered.',
      college: newCollege
    }));
  } catch (err) {
    res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: err.message
    }));
  }
}

module.exports = {
  handleCollegeDashboard,
  handleCollegeStudents,
  handleVerifyStudent,
  handleCollegeRegister
};
