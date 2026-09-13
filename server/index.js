/**
 * TALVEX MASTER BACKEND REST API SERVER
 * Pure Node.js v24 + SQLite Architecture
 */

const http = require('node:http');
const url = require('node:url');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config');
const db = require('./db/database');
const { calculatePremium, calculateCollegeIncentive } = require('./services/calculator');
const { handleLogin, handleVerify2FA } = require('./routes/auth');
const { handleRegister, handleGetPolicy, handleClaimSubmission } = require('./routes/student');
const { handleCollegeDashboard, handleCollegeStudents, handleVerifyStudent } = require('./routes/college');
const { handleAdminDashboard, handleAdminClaims, handleClaimAdjudication, handleGetSettings, handleUpdateSettings } = require('./routes/admin');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Helper to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(new Error('Invalid JSON payload'));
      }
    });
    req.on('error', reject);
  });
}

// Global CORS & JSON helper
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  // Preflight OPTIONS handling
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;
  const query = parsedUrl.query;

  try {
    // Serve Frontend Static Files
    if (!pathname.startsWith('/api')) {
      if (method !== 'GET' && method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
        return;
      }

      const publicDir = path.resolve(__dirname, '..');
      let relativePath = pathname === '/' ? '/index.html' : pathname;
      const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
      const filePath = path.join(publicDir, safePath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
        return;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File Not Found');
        return;
      }
    }

    let body = {};
    if (method === 'POST' || method === 'PUT') {
      body = await parseBody(req);
    }

    // --- 1. SYSTEM & HEALTH CHECK ---
    if (method === 'GET' && pathname === '/api/v1/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'ONLINE',
        platform: 'TALVEX Education Protection Platform API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // --- 2. PUBLIC PREMIUM CALCULATOR ---
    if (method === 'POST' && pathname === '/api/v1/calculate-premium') {
      const courseFee = parseFloat(body.courseFee) || 300000;
      const prem = calculatePremium(courseFee);
      const incentive = calculateCollegeIncentive(courseFee);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        studentCalculation: {
          courseFee: prem.courseFee,
          schemeRatePercentage: prem.premiumRatePercentage,
          premiumAmount: prem.premiumAmount,
          currency: 'INR',
          note: 'Student pays exactly 1% of total course tuition fee.'
        },
        institutionalIncentive: {
          incentiveRatePercentage: incentive.incentiveRatePercentage,
          incentiveAmount: incentive.incentiveAmount,
          note: 'Funded institutionally for partner colleges; never charged to students.'
        }
      }));
      return;
    }

    // --- 3. AUTHENTICATION ---
    if (method === 'POST' && pathname === '/api/v1/auth/login') {
      return await handleLogin(req, res, body);
    }
    if (method === 'POST' && pathname === '/api/v1/auth/verify-2fa') {
      return await handleVerify2FA(req, res, body);
    }

    // --- 4. STUDENT JOURNEY ---
    if (method === 'POST' && pathname === '/api/v1/register') {
      return await handleRegister(req, res, body);
    }
    if (method === 'GET' && pathname === '/api/v1/student/policy') {
      return await handleGetPolicy(req, res, query);
    }
    if (method === 'POST' && pathname === '/api/v1/student/claims') {
      return await handleClaimSubmission(req, res, body);
    }

    // --- 5. PARTNER COLLEGE PORTAL ---
    if (method === 'GET' && pathname === '/api/v1/college/dashboard') {
      return await handleCollegeDashboard(req, res, query);
    }
    if (method === 'GET' && pathname === '/api/v1/college/students') {
      return await handleCollegeStudents(req, res, query);
    }
    if (method === 'PUT' && pathname.startsWith('/api/v1/college/students/') && pathname.endsWith('/verify')) {
      const parts = pathname.split('/');
      const studentId = parts[parts.length - 2];
      return await handleVerifyStudent(req, res, studentId);
    }

    // --- 6. PLATFORM ADMIN DASHBOARD ---
    if (method === 'GET' && pathname === '/api/v1/admin/dashboard') {
      return await handleAdminDashboard(req, res);
    }
    if (method === 'GET' && pathname === '/api/v1/admin/claims') {
      return await handleAdminClaims(req, res);
    }
    if (method === 'PUT' && pathname.startsWith('/api/v1/admin/claims/') && pathname.endsWith('/adjudicate')) {
      const parts = pathname.split('/');
      const claimId = parts[parts.length - 2];
      return await handleClaimAdjudication(req, res, claimId, body);
    }
    if (method === 'GET' && pathname === '/api/v1/admin/settings') {
      return await handleGetSettings(req, res);
    }
    if (method === 'PUT' && pathname === '/api/v1/admin/settings') {
      return await handleUpdateSettings(req, res, body);
    }

    // 404 Route Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: `Route not found: ${method} ${pathname}` }));
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
  }
});

// Start Server
server.listen(config.PORT, config.HOST, () => {
  console.log(`====================================================`);
  console.log(`TALVEX Education Protection Platform Backend REST API`);
  console.log(`Server running at http://${config.HOST}:${config.PORT}`);
  console.log(`Database: MongoDB connected (${config.MONGO_URI})`);
  console.log(`====================================================`);
});

module.exports = server;
