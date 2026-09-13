/**
 * Ensure Education ROLE PORTALS & DASHBOARDS CONTROLLER
 * - Student Dashboard (3D Perspective Tilt Card, Document Vault, Claim Center)
 * - College Portal (KPIs, Student Roster, Quick Verification, Incentive Ledger)
 * - Admin Dashboard (Global Metrics, Claim Adjudication, Configurable System Rules)
 */

class TalvexPortals {
  constructor() {
    this.init();
  }

  init() {
    this.setupStudentDashboard();
    this.setupCollegePortal();
    this.setupAdminDashboard();
    this.setup3DCardTilt();
  }

  // --- 1. STUDENT DASHBOARD ---
  setupStudentDashboard() {
    this.renderStudentData();

    // Claim initiation button
    const claimBtn = document.getElementById('student-initiate-claim-btn');
    const claimModal = document.getElementById('claim-initiation-modal');
    const closeClaimModal = document.getElementById('close-claim-modal-btn');
    const cancelClaimModal = document.getElementById('cancel-claim-modal-btn');
    const submitClaimForm = document.getElementById('claim-initiation-form');

    if (claimBtn && claimModal) {
      claimBtn.addEventListener('click', () => {
        claimModal.classList.add('active');
      });
    }

    if (closeClaimModal && claimModal) {
      closeClaimModal.addEventListener('click', () => claimModal.classList.remove('active'));
    }
    if (cancelClaimModal && claimModal) {
      cancelClaimModal.addEventListener('click', () => claimModal.classList.remove('active'));
    }

    if (submitClaimForm) {
      submitClaimForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const dateOfDemise = document.getElementById('claim-demise-date')?.value || new Date().toISOString().split('T')[0];
        const notes = document.getElementById('claim-notes')?.value || '';

        window.talvexStore.submitClaim({ dateOfDemise, notes });
        if (claimModal) claimModal.classList.remove('active');
        this.renderStudentData();
        if (window.showToast) window.showToast('Claim registered successfully. Status updated to Under Review.', 'warning');
      });
    }

    // Subscribe to store updates
    window.talvexStore.subscribe(() => {
      this.renderStudentData();
    });
  }

  renderStudentData() {
    const student = window.talvexStore.state.student;
    if (!student || !student.policy) return;

    // Policy Card Elements
    const elPolicyId = document.getElementById('dash-policy-id');
    const elStatusBadge = document.getElementById('dash-policy-status');
    const elStudentName = document.getElementById('dash-student-name');
    const elCollege = document.getElementById('dash-college');
    const elCourse = document.getElementById('dash-course');
    const elFeePayer = document.getElementById('dash-fee-payer');
    const elValidity = document.getElementById('dash-validity');
    const elCourseFee = document.getElementById('dash-course-fee');
    const elPremiumPaid = document.getElementById('dash-premium-paid');

    if (elPolicyId) elPolicyId.textContent = student.policy.policyId;
    if (elStatusBadge) {
      elStatusBadge.textContent = student.policy.status.replace(/_/g, ' ');
      elStatusBadge.className = 'badge ' + (
        student.policy.status === 'ACTIVE' ? 'badge-active' :
        student.policy.status.includes('CLAIM') ? 'badge-pending' : 'badge-gold'
      );
    }
    if (elStudentName) elStudentName.textContent = student.fullName;
    if (elCollege) elCollege.textContent = student.collegeName;
    if (elCourse) elCourse.textContent = student.course;
    if (elFeePayer) elFeePayer.textContent = `${student.policy.feePayer.fullName} (${student.policy.feePayer.relationship})`;
    if (elValidity) elValidity.textContent = `${student.policy.issueDate} to ${student.policy.validUntil}`;
    if (elCourseFee) elCourseFee.textContent = window.talvexStore.formatCurrency(student.courseFee);
    if (elPremiumPaid) elPremiumPaid.textContent = window.talvexStore.formatCurrency(student.policy.premiumPaid);

    // Claim Tracker View
    const claimSection = document.getElementById('dash-claim-tracker-container');
    if (claimSection) {
      const activeClaim = window.talvexStore.state.claims.find(c => c.policyId === student.policy.policyId);
      if (activeClaim || student.policy.status.includes('CLAIM')) {
        claimSection.style.display = 'block';
        const claimIdEl = document.getElementById('tracker-claim-id');
        const claimStatusEl = document.getElementById('tracker-claim-status');
        if (claimIdEl) claimIdEl.textContent = activeClaim ? activeClaim.claimId : 'CLM-2026-ACTIVE';
        if (claimStatusEl) claimStatusEl.textContent = activeClaim ? activeClaim.status.replace(/_/g, ' ') : student.policy.status;
      } else {
        claimSection.style.display = 'none';
      }
    }
  }

  // --- 2. COLLEGE PORTAL ---
  setupCollegePortal() {
    this.renderCollegeData();

    // Roster search and status filters
    const searchInput = document.getElementById('college-roster-search');
    const filterSelect = document.getElementById('college-status-filter');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterCollegeRoster());
    }
    if (filterSelect) {
      filterSelect.addEventListener('change', () => this.filterCollegeRoster());
    }

    // Portal Tabs (Roster vs Incentive vs Institution Profile)
    const collegeTabs = document.querySelectorAll('[data-college-tab]');
    collegeTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        collegeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const targetView = tab.getAttribute('data-college-tab');
        document.querySelectorAll('.college-tab-view').forEach(view => {
          view.style.display = (view.id === targetView) ? 'block' : 'none';
        });
      });
    });

    window.talvexStore.subscribe(() => {
      this.renderCollegeData();
    });
  }

  renderCollegeData() {
    const col = window.talvexStore.state.colleges[0]; // Primary college demo
    if (!col) return;

    const elTotalStudents = document.getElementById('col-kpi-total-students');
    const elEnrolledTalvex = document.getElementById('col-kpi-enrolled');
    const elActivePolicies = document.getElementById('col-kpi-active-policies');
    const elPending = document.getElementById('col-kpi-pending');
    const elIncentive = document.getElementById('col-kpi-incentive');

    if (elTotalStudents) elTotalStudents.textContent = col.totalStudents.toLocaleString('en-IN');
    if (elEnrolledTalvex) elEnrolledTalvex.textContent = col.enrolledTalvex.toLocaleString('en-IN');
    if (elActivePolicies) elActivePolicies.textContent = col.activePolicies.toLocaleString('en-IN');
    if (elPending) elPending.textContent = col.pendingVerification.toLocaleString('en-IN');
    if (elIncentive) elIncentive.textContent = window.talvexStore.formatCurrency(col.incentiveAccrued);

    this.filterCollegeRoster();
  }

  filterCollegeRoster() {
    const tableBody = document.getElementById('college-roster-tbody');
    if (!tableBody) return;

    const searchTerm = (document.getElementById('college-roster-search')?.value || '').toLowerCase();
    const statusFilter = document.getElementById('college-status-filter')?.value || 'ALL';

    const roster = window.talvexStore.state.roster;
    const filtered = roster.filter(item => {
      const matchesSearch = item.studentName.toLowerCase().includes(searchTerm) ||
                            item.course.toLowerCase().includes(searchTerm) ||
                            item.policyId.toLowerCase().includes(searchTerm);
      const matchesStatus = (statusFilter === 'ALL') || (item.status === statusFilter);
      return matchesSearch && matchesStatus;
    });

    tableBody.innerHTML = filtered.map(item => `
      <tr>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${item.studentName}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${item.studentId}</div>
        </td>
        <td>${item.course}</td>
        <td>
          <div>${window.talvexStore.formatCurrency(item.courseFee)}</div>
          <div style="font-size: 0.75rem; color: var(--gold-primary);">1% Prem: ${window.talvexStore.formatCurrency(item.premium)}</div>
        </td>
        <td>${item.feePayer}</td>
        <td>
          <span class="badge ${
            item.status === 'ACTIVE' ? 'badge-active' :
            item.status.includes('PENDING') ? 'badge-pending' :
            item.status.includes('CLAIM') ? 'badge-review' : 'badge-gold'
          }">
            ${item.status.replace(/_/g, ' ')}
          </span>
        </td>
        <td>
          ${item.status === 'PENDING_VERIFICATION' ? `
            <button class="btn btn-sm btn-outline-gold" onclick="window.talvexStore.verifyRosterStudent('${item.studentId}'); if(window.showToast) window.showToast('Student verified successfully', 'success');">
              Verify
            </button>
          ` : `
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">${item.policyId}</span>
          `}
        </td>
      </tr>
    `).join('');
  }

  // --- 3. ADMIN DASHBOARD ---
  setupAdminDashboard() {
    this.renderAdminData();

    // Admin Tabs (Overview vs Claims vs System Settings)
    const adminTabs = document.querySelectorAll('[data-admin-tab]');
    adminTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        adminTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const targetView = tab.getAttribute('data-admin-tab');
        document.querySelectorAll('.admin-tab-view').forEach(view => {
          view.style.display = (view.id === targetView) ? 'block' : 'none';
        });
      });
    });

    // Admin Settings Form Save
    const settingsForm = document.getElementById('admin-settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const premiumPercentage = parseFloat(document.getElementById('setting-premium-pct')?.value) || 1.0;
        const collegeIncentivePercentage = parseFloat(document.getElementById('setting-college-incentive-pct')?.value) || 5.0;
        const maxFeePayerAge = parseInt(document.getElementById('setting-max-age')?.value, 10) || 55;

        window.talvexStore.updateSettings({
          premiumPercentage,
          collegeIncentivePercentage,
          maxFeePayerAge
        });

        if (window.showToast) window.showToast('Platform parameters successfully updated across all modules.', 'success');
        this.renderAdminData();
      });
    }

    window.talvexStore.subscribe(() => {
      this.renderAdminData();
    });
  }

  renderAdminData() {
    const state = window.talvexStore.state;

    // Calculate aggregated metrics
    let totalCourseFees = 0;
    let totalPremiums = 0;
    let activePoliciesCount = 0;

    state.roster.forEach(r => {
      totalCourseFees += r.courseFee || 0;
      totalPremiums += r.premium || 0;
      if (r.status === 'ACTIVE') activePoliciesCount++;
    });

    let totalIncentives = 0;
    state.colleges.forEach(c => {
      totalIncentives += c.incentiveAccrued || 0;
    });

    // Update KPI UI
    const elProtectedFees = document.getElementById('admin-kpi-protected-fees');
    const elTotalPremium = document.getElementById('admin-kpi-total-premium');
    const elTotalIncentives = document.getElementById('admin-kpi-total-incentives');
    const elActivePolicies = document.getElementById('admin-kpi-active-policies');

    if (elProtectedFees) elProtectedFees.textContent = window.talvexStore.formatCurrency(totalCourseFees);
    if (elTotalPremium) elTotalPremium.textContent = window.talvexStore.formatCurrency(totalPremiums);
    if (elTotalIncentives) elTotalIncentives.textContent = window.talvexStore.formatCurrency(totalIncentives);
    if (elActivePolicies) elActivePolicies.textContent = (activePoliciesCount + 6080).toLocaleString('en-IN'); // platform-wide total

    // Render Claim Queue
    const claimQueueTbody = document.getElementById('admin-claims-tbody');
    if (claimQueueTbody) {
      claimQueueTbody.innerHTML = state.claims.map(claim => `
        <tr>
          <td>
            <span style="font-family: var(--font-mono); font-weight: 700; color: var(--gold-primary);">${claim.claimId}</span>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${claim.policyId}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--text-primary);">${claim.studentName}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${claim.college}</div>
          </td>
          <td>
            <div>${claim.feePayerName} (${claim.relationship})</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Demise Date: ${claim.dateOfDemise}</div>
          </td>
          <td>${window.talvexStore.formatCurrency(claim.courseFee)}</td>
          <td>
            <span class="badge ${claim.status === 'APPROVED' ? 'badge-active' : claim.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}">
              ${claim.status}
            </span>
          </td>
          <td>
            ${claim.status === 'UNDER_REVIEW' ? `
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-sm btn-primary" onclick="window.talvexStore.adjudicateClaim('${claim.claimId}', 'APPROVED', 'Verified municipal records and enrolled college confirmation'); if(window.showToast) window.showToast('Claim approved. Tuition protection settlement authorized.', 'success');">
                  Approve
                </button>
                <button class="btn btn-sm btn-secondary" onclick="window.talvexStore.adjudicateClaim('${claim.claimId}', 'REJECTED', 'Eligibility document discrepancy'); if(window.showToast) window.showToast('Claim marked as rejected.', 'error');">
                  Reject
                </button>
              </div>
            ` : `
              <span style="font-size: 0.8rem; color: var(--text-muted);">Resolved</span>
            `}
          </td>
        </tr>
      `).join('');
    }

    // Populate Settings Inputs with current values
    const inputPrem = document.getElementById('setting-premium-pct');
    const inputIncentive = document.getElementById('setting-college-incentive-pct');
    const inputMaxAge = document.getElementById('setting-max-age');

    if (inputPrem && !inputPrem.matches(':focus')) inputPrem.value = state.settings.premiumPercentage;
    if (inputIncentive && !inputIncentive.matches(':focus')) inputIncentive.value = state.settings.collegeIncentivePercentage;
    if (inputMaxAge && !inputMaxAge.matches(':focus')) inputMaxAge.value = state.settings.maxFeePayerAge;
  }

  // --- 4. 3D CARD PERSPECTIVE TILT ---
  setup3DCardTilt() {
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // degrees
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }
}

window.TalvexPortals = TalvexPortals;
