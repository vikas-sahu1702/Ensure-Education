/**
 * Ensure Education FRONTEND API CLIENT BRIDGE
 * Connects frontend SPA to Node.js / SQLite backend at http://127.0.0.1:3000
 * Gracefully falls back to local storage if server is offline
 */

const API_BASE_URL = 'http://127.0.0.1:3000/api/v1';

class TalvexApiClient {
  constructor() {
    this.isBackendOnline = false;
    this.checkHealth();
  }

  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      if (res.ok) {
        this.isBackendOnline = true;
        console.log('[Ensure Education API] Connected to live backend at ' + API_BASE_URL);
        this.renderApiStatusBadge(true);
      }
    } catch (e) {
      this.isBackendOnline = false;
      console.log('[Ensure Education API] Backend offline. Operating in client-side persistence mode.');
      this.renderApiStatusBadge(false);
    }
  }

  renderApiStatusBadge(isOnline) {
    const existing = document.getElementById('api-status-pill');
    if (existing) existing.remove();

    const roleBar = document.querySelector('.role-bar-inner');
    if (roleBar) {
      const pill = document.createElement('span');
      pill.id = 'api-status-pill';
      pill.className = isOnline ? 'badge badge-active' : 'badge badge-gold';
      pill.style.fontSize = '0.72rem';
      pill.style.marginLeft = '8px';
      pill.innerHTML = isOnline ? '● REST API ONLINE' : '○ CLIENT MODE';
      roleBar.firstElementChild?.appendChild(pill);
    }
  }

  async calculatePremium(courseFee) {
    if (!this.isBackendOnline) {
      return {
        premium: Math.round(courseFee * 0.01),
        incentive: Math.round(courseFee * 0.05)
      };
    }
    try {
      const res = await fetch(`${API_BASE_URL}/calculate-premium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseFee })
      });
      const data = await res.json();
      return {
        premium: data.studentCalculation.premiumAmount,
        incentive: data.institutionalIncentive.incentiveAmount
      };
    } catch (e) {
      return {
        premium: Math.round(courseFee * 0.01),
        incentive: Math.round(courseFee * 0.05)
      };
    }
  }

  async registerStudent(formData) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.error || (result.details && result.details.join(', ')) || 'Registration failed');
        }
        return result.policy;
      } catch (err) {
        console.warn('Backend registration failed, syncing locally:', err);
      }
    }
    // Fallback to local store
    return window.talvexStore.registerNewStudent(formData);
  }

  async submitClaim(claimData) {
    if (this.isBackendOnline) {
      try {
        const res = await fetch(`${API_BASE_URL}/student/claims`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(claimData)
        });
        const result = await res.json();
        if (res.ok) return result.claim;
      } catch (e) {
        console.warn('Backend claim submission failed, falling back locally:', e);
      }
    }
    return window.talvexStore.submitClaim(claimData);
  }

  async updateSettings(settings) {
    if (this.isBackendOnline) {
      try {
        await fetch(`${API_BASE_URL}/admin/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            premium_percentage: settings.premiumPercentage,
            college_incentive_percentage: settings.collegeIncentivePercentage,
            max_fee_payer_age: settings.maxFeePayerAge
          })
        });
      } catch (e) {
        console.warn('Backend settings update failed, falling back locally:', e);
      }
    }
    window.talvexStore.updateSettings(settings);
  }
}

window.talvexApiClient = new TalvexApiClient();
