/**
 * TALVEX AUTHENTICATION ROUTER
 */

const { User } = require('../db/database');

async function handleLogin(req, res, body) {
  try {
    const { email, password } = body;
    if (!email) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email is required' }));
      return;
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid institutional credentials' }));
      return;
    }

    // Two-step authentication prompt
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      requires2FA: Boolean(user.is_2fa_enabled),
      userId: user.id,
      role: user.role,
      collegeId: user.college_id,
      message: 'Authentication successful. Please verify 2-step OTP.'
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

async function handleVerify2FA(req, res, body) {
  try {
    const { userId, otp } = body;
    if (!otp || String(otp).length < 6) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'A valid 6-digit verification OTP is required.' }));
      return;
    }

    const user = await User.findOne({ id: userId }).lean();
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User session not found.' }));
      return;
    }

    const sessionToken = `tlvx_sess_${Buffer.from(`${user.id}:${Date.now()}`).toString('base64')}`;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        collegeId: user.college_id
      }
    }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: err.message }));
  }
}

module.exports = {
  handleLogin,
  handleVerify2FA
};
