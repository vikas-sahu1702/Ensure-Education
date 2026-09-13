/**
 * Ensure Education MASTER APPLICATION CONTROLLER & ROUTER
 * Handles SPA navigation, role switcher, FAQ accordions, toast notifications
 */

// Global Toast Notification Utility
window.showToast = function(message, type = 'gold') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
      <div>${message}</div>
      <span style="cursor: pointer; opacity: 0.6; font-size: 1.1rem;" onclick="this.parentElement.parentElement.remove()">&times;</span>
    </div>
  `;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

class TalvexApp {
  constructor() {
    this.currentRoute = '#home';
    this.shield3D = null;
    this.calculator = null;
    this.registration = null;
    this.portals = null;

    this.init();
  }

  init() {
    this.setupRouter();
    this.setupRoleSwitcher();
    this.setupFaqAccordion();
    this.setupMobileMenu();
    this.setupThemeToggle();
    this.setupScrollReveal();

    // Initialize modules once DOM is ready
    this.initializeModules();

    // Handle initial route
    this.handleRoute(window.location.hash || '#home');
  }

  initializeModules() {
    // 1. Initialize 3D Shield
    if (document.getElementById('shield-canvas') && typeof Talvex3DShield !== 'undefined') {
      this.shield3D = new Talvex3DShield('shield-canvas');
    }

    // 2. Initialize 1% Calculator
    if (typeof TalvexCalculator !== 'undefined') {
      this.calculator = new TalvexCalculator();
    }

    // 3. Initialize Registration Wizard
    if (typeof TalvexRegistration !== 'undefined') {
      this.registration = new TalvexRegistration();
    }

    // 4. Initialize Role Portals
    if (typeof TalvexPortals !== 'undefined') {
      this.portals = new TalvexPortals();
    }
  }

  setupRouter() {
    window.addEventListener('hashchange', () => {
      this.handleRoute(window.location.hash);
    });
  }

  handleRoute(hash) {
    const route = hash || '#home';
    this.currentRoute = route;

    // List of recognized page views
    const routes = [
      '#home', '#about', '#how-it-works', '#benefits', '#eligibility',
      '#colleges', '#protection', '#faq', '#terms', '#contact',
      '#student-login', '#student-register', '#college-login',
      '#college-portal', '#student-dashboard', '#admin-dashboard'
    ];

    const targetRoute = routes.includes(route) ? route : '#home';

    // Hide all view sections
    document.querySelectorAll('.page-view').forEach(view => {
      view.style.display = 'none';
    });

    // Show active view
    const activeViewId = 'view-' + targetRoute.replace('#', '');
    const activeView = document.getElementById(activeViewId);
    if (activeView) {
      activeView.style.display = 'block';
    } else {
      const homeView = document.getElementById('view-home');
      if (homeView) homeView.style.display = 'block';
    }

    // Update active nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === targetRoute) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Sync role switcher button state
    this.syncRolePills(targetRoute);

    // Scroll smoothly to top on page transition
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Refresh 3D canvas resize if returning to home
    if (targetRoute === '#home' && this.shield3D) {
      setTimeout(() => this.shield3D.onResize(), 100);
    }

    // Trigger reveal animations for elements on the newly opened page
    setTimeout(() => {
      if (typeof this.attachRevealElements === 'function') {
        this.attachRevealElements();
      }
      if (window.talvexCharacterSystem) {
        window.talvexCharacterSystem.onRouteChanged(targetRoute);
      }
    }, 60);
  }

  setupRoleSwitcher() {
    const pills = document.querySelectorAll('.role-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        const targetRole = pill.getAttribute('data-role');
        window.talvexStore.setRole(targetRole);

        if (targetRole === 'student') {
          window.location.hash = '#student-dashboard';
        } else if (targetRole === 'college') {
          window.location.hash = '#college-portal';
        } else if (targetRole === 'admin') {
          window.location.hash = '#admin-dashboard';
        } else {
          window.location.hash = '#home';
        }
      });
    });
  }

  syncRolePills(route) {
    const pills = document.querySelectorAll('.role-pill');
    let activeRole = 'public';

    if (route.includes('student-dashboard')) activeRole = 'student';
    else if (route.includes('college-portal') || route.includes('college-login')) activeRole = 'college';
    else if (route.includes('admin-dashboard')) activeRole = 'admin';

    pills.forEach(p => {
      if (p.getAttribute('data-role') === activeRole) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  setupFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          // Close others
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  setupMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('main-nav-links');

    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.contains('mobile-open');
        if (isOpen) {
          navLinks.classList.remove('mobile-open');
        } else {
          navLinks.classList.add('mobile-open');
        }
      });

      // Close menu on link click
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          navLinks.classList.remove('mobile-open');
        });
      });
    }
  }

  setupThemeToggle() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const savedTheme = localStorage.getItem('talvex_theme');
    
    // Apply saved theme, or fallback to dark mode
    const initialTheme = savedTheme === 'light' ? 'light' : 'dark';
    this.applyTheme(initialTheme, false);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isCurrentLight = document.documentElement.getAttribute('data-theme') === 'light';
        const nextTheme = isCurrentLight ? 'dark' : 'light';
        this.applyTheme(nextTheme, true);
      });
    }
  }

  applyTheme(theme, notify = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('talvex_theme', theme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      const nextLabel = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
      toggleBtn.setAttribute('aria-label', nextLabel);
      toggleBtn.setAttribute('title', nextLabel);
    }

    // Inform 3D shield if it exists
    if (this.shield3D && typeof this.shield3D.onThemeChange === 'function') {
      this.shield3D.onThemeChange(theme);
    }

    if (notify && typeof window.showToast === 'function') {
      window.showToast(`Switched to ${theme === 'light' ? 'Light' : 'Dark'} Mode`, 'gold');
    }
  }

  setupScrollReveal() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal-box, .reveal-text').forEach(el => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observerOptions = {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    };

    this.revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.attachRevealElements();
  }

  attachRevealElements() {
    if (!this.revealObserver) return;

    // 1. Text elements to reveal (headings, subtitles, badges)
    const textSelectors = [
      '.hero-tag',
      '.hero-title',
      '.hero-subhead',
      '.hero-ctas',
      '.hero-meta-stats',
      '.section-header',
      '.section-tag',
      '.section-title',
      '.section-description'
    ];

    // 2. Boxes & Cards containing text to reveal
    const boxSelectors = [
      '.card',
      '.calculator-card',
      '.calc-result-box',
      '.journey-step-card',
      '.cta-banner-card',
      '.kpi-card',
      '.faq-item',
      '.policy-card-main',
      '.settings-card',
      '.claim-status-tracker',
      '.calc-formula-card',
      '.tilt-card',
      '.radio-card',
      '.modal-window'
    ];

    // Attach to text elements
    document.querySelectorAll(textSelectors.join(', ')).forEach(el => {
      if (!el.classList.contains('reveal-text')) {
        el.classList.add('reveal-text');
      }
      this.revealObserver.observe(el);
    });

    // Stagger child cards inside container grids
    const gridContainers = document.querySelectorAll(
      '.journey-timeline, .kpi-grid, .settings-grid, .faq-list, .radio-cards-grid, [style*="grid-template-columns"]'
    );

    gridContainers.forEach(container => {
      const children = container.querySelectorAll(boxSelectors.join(', '));
      children.forEach((child, i) => {
        child.style.setProperty('--stagger-delay', `${(i % 6) * 90}ms`);
      });
    });

    // Attach to box elements and orchestrate inner text cascades
    document.querySelectorAll(boxSelectors.join(', ')).forEach(el => {
      if (!el.classList.contains('reveal-box')) {
        el.classList.add('reveal-box');
      }

      // Layered entrance for text written inside boxes
      el.querySelectorAll('h1, h2, h3, h4, h5, .journey-step-number, .journey-step-title, .calc-premium-amount, .card-title').forEach(headEl => {
        if (!headEl.classList.contains('box-text-heading')) {
          headEl.classList.add('box-text-heading');
        }
      });

      el.querySelectorAll('p, ul, ol, .journey-step-desc, .calc-disclaimer, .card-desc').forEach(bodyEl => {
        if (!bodyEl.classList.contains('box-text-body')) {
          bodyEl.classList.add('box-text-body');
        }
      });

      el.querySelectorAll('svg, .card-icon, .icon-wrap').forEach(iconEl => {
        if (!iconEl.classList.contains('box-text-icon')) {
          iconEl.classList.add('box-text-icon');
        }
      });

      this.revealObserver.observe(el);
    });

    // 3. Mascot elements (Trigger entrance animations without applying .reveal-box)
    document.querySelectorAll('.mascot-wrapper').forEach(el => {
      this.revealObserver.observe(el);
    });
  }
}

// Instantiate on window load
window.addEventListener('DOMContentLoaded', () => {
  window.talvexApp = new TalvexApp();
});
