/**
 * Ensure Education DYNAMIC 1% PREMIUM CALCULATOR
 * Real-time calculation engine strictly enforcing:
 * Student Scheme Premium = Course Fee * 0.01
 */

class TalvexCalculator {
  constructor() {
    this.slider = document.getElementById('calc-slider');
    this.feeInput = document.getElementById('calc-fee-input');
    this.feeDisplay = document.getElementById('calc-fee-display');
    this.premiumDisplay = document.getElementById('calc-premium-display');
    this.monthlyEquivalent = document.getElementById('calc-monthly-equivalent');
    this.presetButtons = document.querySelectorAll('[data-calc-preset]');
    this.protectBtn = document.getElementById('calc-protect-cta');

    if (!this.slider && !this.feeInput) return;

    this.init();
  }

  init() {
    // Sync slider and number input
    if (this.slider) {
      this.slider.addEventListener('input', (e) => {
        this.updateCalculation(e.target.value);
      });
    }

    if (this.feeInput) {
      this.feeInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
        this.updateCalculation(val);
      });
    }

    // Preset button listeners
    if (this.presetButtons) {
      this.presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = parseInt(btn.getAttribute('data-calc-preset'), 10);
          this.updateCalculation(val);
        });
      });
    }

    // CTA to redirect to registration with preselected fee
    if (this.protectBtn) {
      this.protectBtn.addEventListener('click', () => {
        const currentFee = this.slider ? parseInt(this.slider.value, 10) : 300000;
        sessionStorage.setItem('talvex_prefill_fee', currentFee);
        window.location.hash = '#student-register';
      });
    }

    // Initial calculation (default ₹3,00,000)
    const initialFee = parseInt(sessionStorage.getItem('talvex_prefill_fee'), 10) || 300000;
    this.updateCalculation(initialFee);
  }

  updateCalculation(courseFee) {
    const fee = Math.max(50000, Math.min(2500000, parseInt(courseFee, 10) || 300000));
    
    // 1% Calculation via store
    const premium = window.talvexStore ? window.talvexStore.calculatePremium(fee) : Math.round(fee * 0.01);
    
    // Approximate monthly context over 36 months
    const monthly = Math.round(premium / 36);

    // Update UI elements
    if (this.slider && parseInt(this.slider.value, 10) !== fee) {
      this.slider.value = fee;
    }
    if (this.feeInput) {
      this.feeInput.value = fee.toLocaleString('en-IN');
    }
    if (this.feeDisplay) {
      this.feeDisplay.textContent = '₹' + fee.toLocaleString('en-IN');
    }
    if (this.premiumDisplay) {
      this.premiumDisplay.textContent = '₹' + premium.toLocaleString('en-IN');
    }
    if (this.monthlyEquivalent) {
      this.monthlyEquivalent.textContent = `Equivalent to only ₹${monthly.toLocaleString('en-IN')}/month over a standard 3-year degree`;
    }

    // Update active preset highlight
    if (this.presetButtons) {
      this.presetButtons.forEach(btn => {
        const presetVal = parseInt(btn.getAttribute('data-calc-preset'), 10);
        if (presetVal === fee) {
          btn.style.borderColor = 'var(--gold-primary)';
          btn.style.color = 'var(--gold-primary)';
          btn.style.background = 'rgba(214, 168, 79, 0.12)';
        } else {
          btn.style.borderColor = '';
          btn.style.color = '';
          btn.style.background = '';
        }
      });
    }
  }
}

window.TalvexCalculator = TalvexCalculator;
