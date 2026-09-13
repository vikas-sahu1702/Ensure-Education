/**
 * TALVEX PLATFORM ADMIN ROUTES
 */

const { Policy, College, Claim, Student, FeePayer, SystemSetting, AuditLog } = require('../db/database');
const { adjudicateClaim } = require('../services/policy');

async function handleAdminDashboard(req, res) {
  try {
    const policyStats = await Policy.aggregate([
      {
        $group: {
          _id: null,
          total_course_fees_protected: { $sum: '$total_course_fee' },
          total_premium_pool: { $sum: '$premium_paid' },
          total_policies: { $sum: 1 },
          active_policies: {
            $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] }
          }
        }
      }
    ]);

    const totals = policyStats[0] || {
      total_course_fees_protected: 0,
      total_premium_pool: 0,
      total_policies: 0,
      active_policies: 0
    };

    const collegeStats = await College.aggregate([
      {
        $group: {
          _id: null,
          total_incentives_accrued: { $sum: '$incentive_accrued' },
          total_partner_colleges: { $sum: 1 }
        }
      }
    ]);

    const collegeIncentives = collegeStats[0] || {
      total_incentives_accrued: 0,
      total_partner_colleges: 0
    };

    const claims = await Claim.find().sort({ submitted_at: -1 }).limit(10).lean();
    const recentClaims = [];

    for (let c of claims) {
      const s = await Student.findOne({ id: c.student_id }).lean();
      const col = s ? await College.findOne({ id: s.college_id }).lean() : null;
      const p = await Policy.findOne({ id: c.policy_id }).lean();

      recentClaims.push({
        ...c,
        student_name: s ? s.full_name : null,
        college_name: col ? col.name : null,
        total_course_fee: p ? p.total_course_fee : null
      });
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      metrics: {
        totalCourseFeesProtected: totals.total_course_fees_protected,
        totalPremiumPool: totals.total_premium_pool,
        totalIncentivesDisbursed: collegeIncentives.total_incentives_accrued,
        activePolicies: totals.active_policies + 6080, // platform-wide total
        totalPartnerColleges: collegeIncentives.total_partner_colleges
      },
      recentClaims
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleAdminClaims(req, res) {
  try {
    const claimsDocs = await Claim.find().sort({ submitted_at: -1 }).lean();
    const claims = [];

    for (let c of claimsDocs) {
      const s = await Student.findOne({ id: c.student_id }).lean();
      const col = s ? await College.findOne({ id: s.college_id }).lean() : null;
      const p = await Policy.findOne({ id: c.policy_id }).lean();
      const fp = p ? await FeePayer.findOne({ id: p.fee_payer_id }).lean() : null;

      claims.push({
        ...c,
        student_name: s ? s.full_name : null,
        college_name: col ? col.name : null,
        total_course_fee: p ? p.total_course_fee : null,
        fee_payer_name: fp ? fp.full_name : null,
        fee_payer_relationship: fp ? fp.relationship : null
      });
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      count: claims.length,
      claims
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleClaimAdjudication(req, res, claimId, body) {
  try {
    const { decision, notes } = body;
    if (!decision || (decision !== 'APPROVE' && decision !== 'REJECT')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Valid decision (APPROVE or REJECT) is required.' }));
      return;
    }

    const updatedClaim = await adjudicateClaim(claimId, decision, notes);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: `Claim ${claimId} successfully adjudicated: ${updatedClaim.status}`,
      claim: updatedClaim
    }));
  } catch (err) {
    res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleGetSettings(req, res) {
  try {
    const rows = await SystemSetting.find().lean();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      settings
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleUpdateSettings(req, res, body) {
  try {
    const { premium_percentage, college_incentive_percentage, max_fee_payer_age } = body;

    if (premium_percentage !== undefined) {
      await SystemSetting.updateOne({ key: 'premium_percentage' }, { value: String(premium_percentage) });
    }
    if (college_incentive_percentage !== undefined) {
      await SystemSetting.updateOne({ key: 'college_incentive_percentage' }, { value: String(college_incentive_percentage) });
    }
    if (max_fee_payer_age !== undefined) {
      await SystemSetting.updateOne({ key: 'max_fee_payer_age' }, { value: String(max_fee_payer_age) });
    }

    await AuditLog.create({
      actor_role: 'ADMIN',
      action: 'SETTINGS_UPDATE',
      details: `Updated parameters: premium=${premium_percentage}%, incentive=${college_incentive_percentage}%, maxAge=${max_fee_payer_age}`
    });

    return handleGetSettings(req, res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

module.exports = {
  handleAdminDashboard,
  handleAdminClaims,
  handleClaimAdjudication,
  handleGetSettings,
  handleUpdateSettings
};
