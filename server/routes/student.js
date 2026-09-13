/**
 * TALVEX STUDENT ROUTES
 */

const { Claim } = require('../db/database');
const { issuePolicy, getPolicyDetails, submitClaim } = require('../services/policy');

async function handleRegister(req, res, body) {
  try {
    const policy = await issuePolicy(body);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Education Protection Policy successfully issued and activated.',
      policy
    }));
  } catch (err) {
    res.writeHead(err.status || 500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: err.message,
      details: err.details || null
    }));
  }
}

async function handleGetPolicy(req, res, query) {
  try {
    // Query by policyId or studentId, fallback to demo student policy
    const policyId = query.policyId || 'TVX-2026-8841';
    const policy = await getPolicyDetails(policyId);

    if (!policy) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Policy not found.' }));
      return;
    }

    // Check for active claims on this policy
    const activeClaim = await Claim.findOne({ policy_id: policyId }).sort({ submitted_at: -1 }).lean();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      policy,
      activeClaim: activeClaim || null
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: err.message }));
  }
}

async function handleClaimSubmission(req, res, body) {
  try {
    const claim = await submitClaim(body);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Bereavement protection claim lodged successfully. Status updated to UNDER_REVIEW.',
      claim
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
  handleRegister,
  handleGetPolicy,
  handleClaimSubmission
};
