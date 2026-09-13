/**
 * Ensure Education 3D EDUCATION PROTECTION SHIELD
 * Built with Three.js — Realistic metallic lighting, subtle reflections,
 * pointer-tracked depth, and orbital protection rings.
 */

class Talvex3DShield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.shieldGroup = null;
    this.outerRing = null;
    this.innerRing = null;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.clock = null;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      this.retryCount = (this.retryCount || 0) + 1;
      if (this.retryCount > 8) {
        console.warn('Three.js unavailable or offline, activating fallback crest.');
        this.renderFallback();
        return;
      }
      setTimeout(() => this.init(), 150);
      return;
    }

    try {
      const width = this.container.clientWidth || 480;
      const height = this.container.clientHeight || 480;

      // 1. Scene & Camera
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      this.camera.position.set(0, 0, 7.5);

      // 2. WebGL Renderer with High Precision & Antialiasing
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;

      // 3. Studio Lighting Rig
      this.setupLighting();

      // 4. Construct 3D Shield & Protection Rings
      this.buildShieldGeometry();

      // 5. Setup Mouse & Touch Tracking
      this.setupInteraction();

      // 6. Window Resize Handler
      window.addEventListener('resize', () => this.onResize());

      // 7. Start Animation Loop
      this.clock = new THREE.Clock();
      this.animate();
    } catch (err) {
      console.error('WebGL initialization failed, falling back to SVG crest', err);
      this.renderFallback();
    }
  }

  setupLighting() {
    // Ambient light for base warm illumination
    this.ambientLight = new THREE.AmbientLight(0xFDFBD4, 0.95);
    this.scene.add(this.ambientLight);

    // Warm Golden Amber Key Light
    this.keyLight = new THREE.DirectionalLight(0xFFD6A0, 2.8);
    this.keyLight.position.set(4, 5, 5);
    this.scene.add(this.keyLight);

    // Vibrant Burnt Orange Specular Rim Light
    this.rimLight = new THREE.DirectionalLight(0xC05800, 2.0);
    this.rimLight.position.set(-5, -3, 3);
    this.scene.add(this.rimLight);

    // Burnt Coffee Ember Top Accent Light
    this.topLight = new THREE.PointLight(0xC05800, 1.6, 10);
    this.topLight.position.set(0, 4, 2);
    this.scene.add(this.topLight);

    // Check if initial theme is light
    if (document.documentElement.getAttribute('data-theme') === 'light') {
      this.onThemeChange('light');
    }
  }

  buildShieldGeometry() {
    this.shieldGroup = new THREE.Group();

    // Exact Burnt Coffee Palette Materials: #713600, #C05800, #FDFBD4, #38240D
    const coffeeMaterial = new THREE.MeshStandardMaterial({
      color: 0xC05800,          // Vibrant Burnt Orange Bronze
      metalness: 0.86,
      roughness: 0.20,
      envMapIntensity: 1.2
    });

    const darkObsidianMaterial = new THREE.MeshStandardMaterial({
      color: 0x38240D,          // Charred Espresso Obsidian
      metalness: 0.45,
      roughness: 0.35
    });

    const cremaCrestMaterial = new THREE.MeshStandardMaterial({
      color: 0xFDFBD4,          // Buttercream Ivory Crest
      metalness: 0.92,
      roughness: 0.18
    });

    const roastedBrownMaterial = new THREE.MeshStandardMaterial({
      color: 0x713600,          // Deep Roasted Coffee
      metalness: 0.88,
      roughness: 0.22
    });

    // 1. Outer Beveled Shield Shape
    const shieldShape = new THREE.Shape();
    // Top flat edge
    shieldShape.moveTo(-1.6, 1.8);
    shieldShape.lineTo(1.6, 1.8);
    // Right curve tapering down
    shieldShape.quadraticCurveTo(1.7, 0.2, 1.1, -0.9);
    shieldShape.quadraticCurveTo(0.6, -1.8, 0, -2.4);
    // Left curve tapering up
    shieldShape.quadraticCurveTo(-0.6, -1.8, -1.1, -0.9);
    shieldShape.quadraticCurveTo(-1.7, 0.2, -1.6, 1.8);

    const extrudeSettings = {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeo.center();
    const shieldMesh = new THREE.Mesh(shieldGeo, coffeeMaterial);
    this.shieldGroup.add(shieldMesh);

    // 2. Inner Obsidian Inset Plate
    const innerShape = new THREE.Shape();
    innerShape.moveTo(-1.3, 1.55);
    innerShape.lineTo(1.3, 1.55);
    innerShape.quadraticCurveTo(1.4, 0.2, 0.9, -0.7);
    innerShape.quadraticCurveTo(0.5, -1.5, 0, -2.0);
    innerShape.quadraticCurveTo(-0.5, -1.5, -0.9, -0.7);
    innerShape.quadraticCurveTo(-1.4, 0.2, -1.3, 1.55);

    const innerExtrude = {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04
    };

    const innerGeo = new THREE.ExtrudeGeometry(innerShape, innerExtrude);
    innerGeo.center();
    const innerMesh = new THREE.Mesh(innerGeo, darkObsidianMaterial);
    innerMesh.position.z = 0.12;
    this.shieldGroup.add(innerMesh);

    // 3. Central 3D Graduation Cap / Protection Crest Emblem
    // Cap rhombus top
    const capTopGeo = new THREE.BoxGeometry(1.1, 0.05, 1.1);
    const capTop = new THREE.Mesh(capTopGeo, cremaCrestMaterial);
    capTop.rotation.y = Math.PI / 4;
    capTop.rotation.x = 0.35;
    capTop.position.set(0, 0.3, 0.32);
    this.shieldGroup.add(capTop);

    // Skull cap base
    const capBaseGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.22, 16);
    const capBase = new THREE.Mesh(capBaseGeo, darkObsidianMaterial);
    capBase.position.set(0, 0.15, 0.3);
    this.shieldGroup.add(capBase);

    // Emblem Star / Shield Medallion at lower center
    const medalGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 6);
    const medal = new THREE.Mesh(medalGeo, roastedBrownMaterial);
    medal.rotation.x = Math.PI / 2;
    medal.position.set(0, -0.75, 0.3);
    this.shieldGroup.add(medal);

    // 4. Orbital Protection Rings
    const ringGeo1 = new THREE.TorusGeometry(2.7, 0.03, 16, 100);
    this.outerRing = new THREE.Mesh(ringGeo1, coffeeMaterial);
    this.outerRing.rotation.x = Math.PI / 3;
    this.outerRing.rotation.y = 0.2;
    this.scene.add(this.outerRing);

    const ringGeo2 = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    this.innerRing = new THREE.Mesh(ringGeo2, roastedBrownMaterial);
    this.innerRing.rotation.x = -Math.PI / 4;
    this.innerRing.rotation.y = -0.3;
    this.scene.add(this.innerRing);

    this.scene.add(this.shieldGroup);
  }

  setupInteraction() {
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      this.mouse.targetX = (e.clientX - centerX) / (window.innerWidth * 0.5);
      this.mouse.targetY = (e.clientY - centerY) / (window.innerHeight * 0.5);
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        this.mouse.targetX = (touch.clientX - centerX) / (window.innerWidth * 0.5);
        this.mouse.targetY = (touch.clientY - centerY) / (window.innerHeight * 0.5);
      }
    }, { passive: true });
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight || 480;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getElapsedTime();

    // Smooth lerp mouse tracking
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    if (this.shieldGroup) {
      if (!this.isReducedMotion) {
        // Subtle floating / breathing motion
        const floatOffset = Math.sin(delta * 1.5) * 0.08;
        this.shieldGroup.position.y = floatOffset;

        // Controlled rotation responsive to pointer + subtle yaw
        this.shieldGroup.rotation.y = this.mouse.x * 0.45 + Math.sin(delta * 0.5) * 0.05;
        this.shieldGroup.rotation.x = -this.mouse.y * 0.35;
      } else {
        this.shieldGroup.rotation.y = 0;
        this.shieldGroup.rotation.x = 0;
      }
    }

    // Rotate protection rings smoothly
    if (this.outerRing && !this.isReducedMotion) {
      this.outerRing.rotation.z += 0.003;
      this.outerRing.rotation.y = 0.2 + this.mouse.x * 0.2;
    }
    if (this.innerRing && !this.isReducedMotion) {
      this.innerRing.rotation.z -= 0.004;
      this.innerRing.rotation.x = -Math.PI / 4 + this.mouse.y * 0.2;
    }

    this.renderer.render(this.scene, this.camera);
  }

  renderFallback() {
    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center; padding: 20px;">
        <div style="width: 140px; height: 160px; background: linear-gradient(135deg, #FDFBD4 0%, #C05800 50%, #713600 100%); clip-path: polygon(0 0, 100% 0, 85% 70%, 50% 100%, 15% 70%); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 40px rgba(192,88,0,0.40);">
          <div style="width: 110px; height: 130px; background: #1D1207; clip-path: polygon(0 0, 100% 0, 85% 70%, 50% 100%, 15% 70%); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #C05800;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>
        <div style="margin-top: 18px; color: var(--gold-primary); font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em;">
          INSTITUTIONAL EDUCATION PROTECTION SHIELD
        </div>
      </div>
    `;
  }

  onThemeChange(theme) {
    if (!this.ambientLight || !this.keyLight || !this.rimLight) return;
    if (theme === 'light') {
      this.ambientLight.color.setHex(0xFFFAF2);
      this.ambientLight.intensity = 1.15;
      this.keyLight.color.setHex(0xFFDEB0);
      this.keyLight.intensity = 2.4;
      this.rimLight.color.setHex(0x9A4200);
      this.rimLight.intensity = 2.2;
    } else {
      this.ambientLight.color.setHex(0xFDFBD4);
      this.ambientLight.intensity = 0.95;
      this.keyLight.color.setHex(0xFFD6A0);
      this.keyLight.intensity = 2.8;
      this.rimLight.color.setHex(0xC05800);
      this.rimLight.intensity = 2.0;
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

window.Talvex3DShield = Talvex3DShield;
