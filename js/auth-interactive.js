/**
 * Ensure Education - Interactive Authentication Character System
 * Manages the reactive mascot animations on the unified auth portal.
 */

(function() {
  'use strict';

  class AuthInteractiveSystem {
    constructor() {
      this.initialized = false;
    }

    init() {
      this.container = document.getElementById('view-unified-auth');
      if (!this.container) return;

      this.characterHead = document.querySelector('.auth-char-head');
      this.characterEyesGroup = document.querySelector('.auth-char-eyes-group');
      this.characterHands = document.querySelector('.auth-char-hands');
      this.characterBody = document.querySelector('.auth-char-body');
      
      this.eyesOpen = document.querySelector('.auth-eyes-open');
      this.eyesClosed = document.querySelector('.auth-eyes-closed');
      
      this.passwordInputs = this.container.querySelectorAll('input[type="password"]');
      this.textInputs = this.container.querySelectorAll('input[type="text"], input[type="email"]');
      this.togglePasswordBtns = this.container.querySelectorAll('.toggle-password-btn');
      
      this.loginForm = document.getElementById('unified-login-form');
      this.registerForm = document.getElementById('unified-register-form');

      // Bind context
      this.handleMouseMove = this.handleMouseMove.bind(this);
      
      this.setupEventListeners();
      this.initialized = true;
      this.resetCharacter();
    }

    setupEventListeners() {
      // Mouse tracking on the document
      document.addEventListener('mousemove', this.handleMouseMove);

      // Focus tracking for Text/Email inputs
      this.textInputs.forEach(input => {
        input.addEventListener('focus', () => {
          if (!this.isCoveringEyes) {
            this.lookAtInput();
          }
        });
        input.addEventListener('blur', () => this.resetCharacter());
        input.addEventListener('input', () => {
          if (!this.isCoveringEyes) {
            this.typeReact();
          }
        });
      });

      // Focus tracking for Password inputs
      this.passwordInputs.forEach(input => {
        input.addEventListener('focus', () => {
          // Check if it's currently text (show password is on)
          if (input.type === 'text') {
            this.peek();
          } else {
            this.coverEyes();
          }
        });
        input.addEventListener('blur', () => {
          this.uncoverEyes();
          this.resetCharacter();
        });
      });

      // Toggle Password Visibility Logic
      this.togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = btn.getAttribute('data-target');
          const input = document.getElementById(targetId);
          if (!input) return;

          if (input.type === 'password') {
            input.type = 'text';
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
            // If focused, peek
            if (document.activeElement === input) {
              this.peek();
            }
          } else {
            input.type = 'password';
            btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
            if (document.activeElement === input) {
              this.coverEyes();
            }
          }
        });
      });

      // Form Toggling
      const toggleToRegisterBtns = this.container.querySelectorAll('.toggle-to-register');
      const toggleToLoginBtns = this.container.querySelectorAll('.toggle-to-login');

      toggleToRegisterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showRegister();
        });
      });

      toggleToLoginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.showLogin();
        });
      });
      
      // Role Selection in Register Form
      const roleSelect = document.getElementById('auth-role-select');
      const studentFields = document.getElementById('auth-student-fields');
      const collegeFields = document.getElementById('auth-college-fields');
      const registerSubmitBtn = document.getElementById('auth-register-submit-btn');

      if (roleSelect) {
        roleSelect.addEventListener('change', (e) => {
          if (e.target.value === 'student') {
            studentFields.style.display = 'block';
            collegeFields.style.display = 'none';
            registerSubmitBtn.textContent = 'Continue as Student';
          } else {
            studentFields.style.display = 'none';
            collegeFields.style.display = 'block';
            registerSubmitBtn.textContent = 'Register College';
          }
          this.hopReact();
        });
      }
    }

    handleMouseMove(e) {
      if (!this.characterEyesGroup || this.isCoveringEyes || this.isLookingAtInput) return;

      const rect = this.characterHead.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance and angle
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Limit the movement
      const maxEyeMove = 4;
      const maxHeadMove = 2;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX*deltaX + deltaY*deltaY) / 100, 1);

      const eyeX = Math.cos(angle) * distance * maxEyeMove;
      const eyeY = Math.sin(angle) * distance * maxEyeMove;

      const headX = Math.cos(angle) * distance * maxHeadMove;
      const headY = Math.sin(angle) * distance * maxHeadMove;

      this.characterEyesGroup.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
      this.characterHead.style.transform = `translate(${headX}px, ${headY}px)`;
    }

    resetCharacter() {
      this.isLookingAtInput = false;
      this.isCoveringEyes = false;
      if (this.characterEyesGroup) {
        this.characterEyesGroup.style.transform = 'translate(0px, 0px)';
      }
      if (this.eyesOpen) this.eyesOpen.style.opacity = '1';
      if (this.eyesClosed) this.eyesClosed.style.opacity = '0';
      if (this.characterHead) {
        this.characterHead.style.transform = 'translate(0px, 0px)';
      }
      if (this.characterHands) {
        this.characterHands.classList.remove('covering');
        this.characterHands.classList.remove('peeking');
      }
    }

    lookAtInput() {
      this.isLookingAtInput = true;
      if (this.characterEyesGroup) {
        this.characterEyesGroup.style.transform = 'translate(4px, 2px)';
      }
      if (this.characterHead) {
        this.characterHead.style.transform = 'translate(2px, 1px) rotate(2deg)';
      }
    }

    typeReact() {
      if (this.characterHead) {
        this.characterHead.style.transform = 'translate(2px, 2px) rotate(3deg)';
        setTimeout(() => {
          if (this.isLookingAtInput) {
            this.characterHead.style.transform = 'translate(2px, 1px) rotate(2deg)';
          }
        }, 150);
      }
    }

    coverEyes() {
      this.isCoveringEyes = true;
      if (this.eyesOpen) this.eyesOpen.style.opacity = '0';
      if (this.eyesClosed) this.eyesClosed.style.opacity = '1';
      if (this.characterHands) {
        this.characterHands.classList.remove('peeking');
        this.characterHands.classList.add('covering');
      }
      if (this.characterHead) {
        this.characterHead.style.transform = 'translate(0px, -2px) rotate(-3deg)';
      }
    }

    peek() {
      this.isCoveringEyes = true;
      if (this.eyesOpen) this.eyesOpen.style.opacity = '1';
      if (this.eyesClosed) this.eyesClosed.style.opacity = '0';
      if (this.characterHands) {
        this.characterHands.classList.remove('covering');
        this.characterHands.classList.add('peeking');
      }
      if (this.characterHead) {
        this.characterHead.style.transform = 'translate(2px, -1px) rotate(1deg)';
      }
    }

    uncoverEyes() {
      this.isCoveringEyes = false;
      if (this.eyesOpen) this.eyesOpen.style.opacity = '1';
      if (this.eyesClosed) this.eyesClosed.style.opacity = '0';
      if (this.characterHands) {
        this.characterHands.classList.remove('covering');
        this.characterHands.classList.remove('peeking');
      }
    }

    hopReact() {
      if (this.characterBody) {
        this.characterBody.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          this.characterBody.style.transform = 'translateY(0)';
        }, 300);
      }
    }

    showRegister() {
      this.loginForm.classList.remove('active');
      this.registerForm.classList.add('active');
      this.hopReact();
    }

    showLogin() {
      this.registerForm.classList.remove('active');
      this.loginForm.classList.add('active');
      this.hopReact();
    }
  }

  // Global Export
  window.AuthInteractiveSystem = AuthInteractiveSystem;
})();
