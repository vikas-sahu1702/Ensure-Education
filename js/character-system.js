/**
 * Ensure Education COMPREHENSIVE ANIMATED CARTOON CHARACTER SYSTEM
 * Features 10 distinct characters with consistent styling,
 * depth layering, corner entrances, idle animations, and
 * page-specific compositions (5-10 characters per view) across all 16 views.
 */

(function() {
  'use strict';

  // Immediately remove any legacy repetitive mascots
  if (typeof document !== 'undefined') {
    document.querySelectorAll('.mascot-wrapper').forEach(el => el.remove());
  }

  // --- 1. SVG CHARACTER DEFINITIONS ---
  const CHARACTER_SVGS = {
    // 1. Aria the Scholar (Student with glasses, backpack & notebook)
    aria: `
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ariaHair" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3D2314"/>
            <stop offset="100%" stop-color="#1A0E08"/>
          </linearGradient>
          <linearGradient id="ariaSkin" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#FFE4C4"/>
            <stop offset="100%" stop-color="#F5D0A9"/>
          </linearGradient>
          <linearGradient id="ariaJacket" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#C05800"/>
            <stop offset="100%" stop-color="#7B3700"/>
          </linearGradient>
          <linearGradient id="ariaBook" x1="0" y1="0" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#D6A84F"/>
            <stop offset="100%" stop-color="#FDFBD4"/>
          </linearGradient>
        </defs>
        <g class="char-body">
          <!-- Backpack (behind) -->
          <rect x="24" y="62" width="22" height="42" rx="8" fill="#5A2E10"/>
          <rect x="74" y="62" width="22" height="42" rx="8" fill="#5A2E10"/>
          <!-- Body / Jacket -->
          <path d="M38 72 C38 60 82 60 82 72 L88 120 C88 126 32 126 32 120 Z" fill="url(#ariaJacket)"/>
          <!-- Collar / Shirt -->
          <path d="M50 72 L60 88 L70 72 Z" fill="#FFFFFF"/>
          <path d="M56 86 L60 96 L64 86 Z" fill="#D6A84F"/>
          <!-- Head / Neck -->
          <rect x="54" y="52" width="12" height="18" rx="4" fill="url(#ariaSkin)"/>
          <!-- Back hair -->
          <circle cx="60" cy="40" r="32" fill="url(#ariaHair)"/>
          <!-- Face -->
          <circle cx="60" cy="42" r="24" fill="url(#ariaSkin)"/>
          <!-- Front Bangs -->
          <path d="M38 34 C44 22 76 22 82 34 C76 30 68 34 60 28 C52 34 44 30 38 34 Z" fill="url(#ariaHair)"/>
          <!-- Glasses -->
          <rect x="42" y="36" width="14" height="12" rx="4" fill="none" stroke="#D6A84F" stroke-width="2.5"/>
          <rect x="64" y="36" width="14" height="12" rx="4" fill="none" stroke="#D6A84F" stroke-width="2.5"/>
          <line x1="56" y1="42" x2="64" y2="42" stroke="#D6A84F" stroke-width="2"/>
          <!-- Eyes -->
          <g class="char-eyes">
            <circle cx="49" cy="42" r="3" fill="#140C04"/>
            <circle cx="50.2" cy="41" r="1.2" fill="#FFFFFF"/>
            <circle cx="71" cy="42" r="3" fill="#140C04"/>
            <circle cx="72.2" cy="41" r="1.2" fill="#FFFFFF"/>
          </g>
          <!-- Cheeks & Smile -->
          <circle cx="42" cy="48" r="3" fill="#FF8A8A" opacity="0.45"/>
          <circle cx="78" cy="48" r="3" fill="#FF8A8A" opacity="0.45"/>
          <path d="M54 51 Q60 56 66 51" fill="none" stroke="#7B3700" stroke-width="2" stroke-linecap="round"/>
          <!-- Holding Course Guide / Tablet -->
          <rect x="46" y="86" width="28" height="34" rx="4" fill="url(#ariaBook)" stroke="#C05800" stroke-width="1.5"/>
          <path d="M50 94 L70 94 M50 102 L66 102 M50 110 L62 110" stroke="#7B3700" stroke-width="1.8" stroke-linecap="round"/>
          <!-- Left Arm & Hand -->
          <path d="M38 74 Q32 92 46 96" fill="none" stroke="url(#ariaJacket)" stroke-width="8" stroke-linecap="round"/>
          <circle cx="46" cy="96" r="5" fill="url(#ariaSkin)"/>
          <!-- Right Waving/Holding Arm -->
          <g class="char-arm-wave">
            <path d="M82 74 Q94 88 74 96" fill="none" stroke="url(#ariaJacket)" stroke-width="8" stroke-linecap="round"/>
            <circle cx="74" cy="96" r="5" fill="url(#ariaSkin)"/>
          </g>
        </g>
      </svg>
    `,

    // 2. Karan the Guardian (Caring Parent / Fee Payer)
    karan: `
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="karanSkin" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#FCD5B5"/>
            <stop offset="100%" stop-color="#EBB38A"/>
          </linearGradient>
          <linearGradient id="karanSuit" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2D3748"/>
            <stop offset="100%" stop-color="#1A202C"/>
          </linearGradient>
          <linearGradient id="karanVest" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#D6A84F"/>
            <stop offset="100%" stop-color="#C05800"/>
          </linearGradient>
        </defs>
        <g class="char-body">
          <!-- Suit & Shoulders -->
          <path d="M32 76 C32 62 88 62 88 76 L94 128 C94 132 26 132 26 128 Z" fill="url(#karanSuit)"/>
          <!-- Inner Vest -->
          <path d="M46 76 L60 102 L74 76 Z" fill="url(#karanVest)"/>
          <path d="M54 76 L60 88 L66 76 Z" fill="#FFFFFF"/>
          <circle cx="60" cy="94" r="2" fill="#FFFFFF"/>
          <circle cx="60" cy="102" r="2" fill="#FFFFFF"/>
          <!-- Neck -->
          <rect x="53" y="52" width="14" height="16" rx="4" fill="url(#karanSkin)"/>
          <!-- Head / Hair -->
          <path d="M38 38 C38 18 82 18 82 38 C82 38 86 44 82 46 C78 40 42 40 38 46 Z" fill="#2D2013"/>
          <circle cx="60" cy="42" r="22" fill="url(#karanSkin)"/>
          <!-- Hairline -->
          <path d="M40 34 C48 24 72 24 80 34 C74 30 64 32 60 28 C56 32 46 30 40 34 Z" fill="#2D2013"/>
          <!-- Kind Eyes & Eyebrows -->
          <path d="M44 33 Q50 30 54 33" stroke="#2D2013" stroke-width="2" stroke-linecap="round"/>
          <path d="M66 33 Q70 30 76 33" stroke="#2D2013" stroke-width="2" stroke-linecap="round"/>
          <g class="char-eyes">
            <circle cx="49" cy="40" r="3.2" fill="#140C04"/>
            <circle cx="50.2" cy="38.8" r="1.2" fill="#FFFFFF"/>
            <circle cx="71" cy="40" r="3.2" fill="#140C04"/>
            <circle cx="72.2" cy="38.8" r="1.2" fill="#FFFFFF"/>
          </g>
          <!-- Friendly Mustache / Smile -->
          <path d="M52 49 Q60 55 68 49" fill="none" stroke="#8C4A15" stroke-width="2.2" stroke-linecap="round"/>
          <!-- Protective / Thumbs Up Arm -->
          <g class="char-arm-wave">
            <path d="M86 78 Q100 90 92 108" fill="none" stroke="url(#karanSuit)" stroke-width="9" stroke-linecap="round"/>
            <circle cx="92" cy="108" r="6" fill="url(#karanSkin)"/>
            <!-- Golden Shield Pin in Hand -->
            <path d="M92 104 L98 108 L95 116 L92 118 L89 116 L86 108 Z" fill="#D6A84F"/>
          </g>
          <!-- Left Arm at Rest -->
          <path d="M34 78 Q22 96 32 110" fill="none" stroke="url(#karanSuit)" stroke-width="9" stroke-linecap="round"/>
          <circle cx="32" cy="110" r="6" fill="url(#karanSkin)"/>
        </g>
      </svg>
    `,

    // 3. Professor Varma (Institutional College Dean)
    varma: `
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="varmaRobe" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4A1E6D"/>
            <stop offset="100%" stop-color="#230B38"/>
          </linearGradient>
          <linearGradient id="varmaStole" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#F59E0B"/>
            <stop offset="100%" stop-color="#D97706"/>
          </linearGradient>
        </defs>
        <g class="char-body">
          <!-- Academic Robe -->
          <path d="M30 76 C30 62 90 62 90 76 L96 130 C96 134 24 134 24 130 Z" fill="url(#varmaRobe)"/>
          <!-- Gold Honor Stole -->
          <path d="M42 76 L48 124 L56 124 L48 76 Z" fill="url(#varmaStole)"/>
          <path d="M78 76 L72 124 L64 124 L72 76 Z" fill="url(#varmaStole)"/>
          <circle cx="60" cy="94" r="6" fill="#D6A84F" stroke="#FDFBD4" stroke-width="1.5"/>
          <!-- Head / Hair -->
          <circle cx="60" cy="44" r="22" fill="#FCD5B5"/>
          <!-- Silver-streaked Hair / Beard -->
          <path d="M38 42 C38 20 82 20 82 42 C82 42 86 52 82 56 C76 64 44 64 38 56 Z" fill="#9CA3AF" opacity="0.35"/>
          <path d="M36 34 C44 20 76 20 84 34 C76 28 66 28 60 26 C54 28 44 28 36 34 Z" fill="#6B7280"/>
          <!-- Round Dean Spectacles -->
          <circle cx="48" cy="42" r="8" fill="none" stroke="#D6A84F" stroke-width="2.2"/>
          <circle cx="72" cy="42" r="8" fill="none" stroke="#D6A84F" stroke-width="2.2"/>
          <line x1="56" y1="42" x2="64" y2="42" stroke="#D6A84F" stroke-width="2"/>
          <!-- Wise Eyes -->
          <g class="char-eyes">
            <circle cx="48" cy="42" r="3" fill="#1F2937"/>
            <circle cx="49" cy="41" r="1.2" fill="#FFFFFF"/>
            <circle cx="72" cy="42" r="3" fill="#1F2937"/>
            <circle cx="73" cy="41" r="1.2" fill="#FFFFFF"/>
          </g>
          <!-- Smile & White Beard Trim -->
          <path d="M52 52 Q60 58 68 52" fill="none" stroke="#4B5563" stroke-width="2" stroke-linecap="round"/>
          <path d="M54 56 Q60 62 66 56" fill="none" stroke="#E5E7EB" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Mortarboard Cap on Head -->
          <path d="M60 14 L92 24 L60 34 L28 24 Z" fill="#230B38"/>
          <circle cx="60" cy="24" r="2.5" fill="#D6A84F"/>
          <g class="char-tassel-sway">
            <path d="M60 24 Q78 28 82 42" fill="none" stroke="#F59E0B" stroke-width="2"/>
            <circle cx="82" cy="43" r="3" fill="#F59E0B"/>
          </g>
          <!-- Holding Partner Accreditation Diploma -->
          <rect x="74" y="86" width="22" height="30" rx="3" fill="#FFFBEB" stroke="#D6A84F" stroke-width="1.5" transform="rotate(12 74 86)"/>
          <circle cx="88" cy="100" r="4" fill="#C05800"/>
        </g>
      </svg>
    `,

    // 4. Talvi the Shield Guardian (Armored Brand Mascot)
    talvi: `
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="talviGold" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FDFBD4"/>
            <stop offset="45%" stop-color="#C05800"/>
            <stop offset="100%" stop-color="#713600"/>
          </linearGradient>
          <linearGradient id="talviInner" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#E2933C"/>
            <stop offset="100%" stop-color="#38240D"/>
          </linearGradient>
          <filter id="talviGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#C05800" flood-opacity="0.45"/>
          </filter>
        </defs>
        <g class="char-body">
          <!-- Outer Shield Shell -->
          <path d="M60 16 C94 16 106 28 106 52 C106 96 60 130 60 130 C60 130 14 96 14 52 C14 28 26 16 60 16 Z" 
                fill="url(#talviGold)" filter="url(#talviGlow)"/>
          <!-- Inner Core Crest -->
          <path d="M60 26 C86 26 94 36 94 54 C94 90 60 118 60 118 C60 118 26 90 26 54 C26 36 34 26 60 26 Z" 
                fill="url(#talviInner)"/>
          <!-- Cute Mascot Eyes -->
          <g class="char-eyes">
            <ellipse cx="46" cy="62" rx="6" ry="7" fill="#140C04"/>
            <circle cx="48" cy="59" r="2.2" fill="#FFFFFF"/>
            <circle cx="44" cy="64" r="1.2" fill="#FFFFFF"/>
            <ellipse cx="74" cy="62" rx="6" ry="7" fill="#140C04"/>
            <circle cx="76" cy="59" r="2.2" fill="#FFFFFF"/>
            <circle cx="72" cy="64" r="1.2" fill="#FFFFFF"/>
          </g>
          <!-- Cheeks -->
          <circle cx="34" cy="72" r="5" fill="#EF4444" opacity="0.5"/>
          <circle cx="86" cy="72" r="5" fill="#EF4444" opacity="0.5"/>
          <!-- Joyful Open Smile -->
          <path d="M52 74 Q60 84 68 74" fill="none" stroke="#140C04" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Golden Star/Crest Insignia on Forehead -->
          <path d="M60 36 L62 42 L68 44 L62 46 L60 52 L58 46 L52 44 L58 42 Z" fill="#FDFBD4"/>
          <!-- Floating Armored Hands -->
          <g class="char-arm-wave">
            <circle cx="8" cy="74" r="8" fill="#FDFBD4" stroke="#713600" stroke-width="2"/>
          </g>
          <circle cx="112" cy="74" r="8" fill="#FDFBD4" stroke="#713600" stroke-width="2"/>
        </g>
      </svg>
    `,

    // 5. Edi the Graduation Sprite (Floating Cap Mascot)
    edi: `
      <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ediCap" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38240D"/>
            <stop offset="100%" stop-color="#140C04"/>
          </linearGradient>
          <linearGradient id="ediGlow" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#F59E0B"/>
            <stop offset="100%" stop-color="#B45309"/>
          </linearGradient>
        </defs>
        <g class="char-body">
          <!-- Halo of Knowledge -->
          <ellipse cx="60" cy="22" rx="38" ry="10" stroke="#FDFBD4" stroke-width="2.5" stroke-dasharray="6 4" opacity="0.8"/>
          <!-- Cap Base Skullcap -->
          <path d="M36 60 L84 60 L84 86 C84 98 36 98 36 86 Z" fill="#2A1608"/>
          <!-- Upper Diamond Board -->
          <path d="M60 26 L108 50 L60 74 L12 50 Z" fill="url(#ediCap)" stroke="#C05800" stroke-width="2.5"/>
          <circle cx="60" cy="50" r="4.5" fill="#D6A84F"/>
          <!-- Swaying Amber Tassel -->
          <g class="char-tassel-sway">
            <path d="M60 50 Q84 56 94 78" fill="none" stroke="#F59E0B" stroke-width="3"/>
            <path d="M90 78 L98 78 L94 94 Z" fill="url(#ediGlow)"/>
          </g>
          <!-- Big Glowing Animated Eyes -->
          <g class="char-eyes">
            <ellipse cx="48" cy="76" rx="5" ry="6.5" fill="#FDFBD4"/>
            <ellipse cx="72" cy="76" rx="5" ry="6.5" fill="#FDFBD4"/>
            <circle cx="48" cy="76" r="2.5" fill="#140C04"/>
            <circle cx="72" cy="76" r="2.5" fill="#140C04"/>
            <circle cx="50" cy="74" r="1.2" fill="#FFFFFF"/>
            <circle cx="74" cy="74" r="1.2" fill="#FFFFFF"/>
          </g>
          <!-- Cheerful Blush & Mouth -->
          <circle cx="38" cy="84" r="4" fill="#FF8A8A" opacity="0.5"/>
          <circle cx="82" cy="84" r="4" fill="#FF8A8A" opacity="0.5"/>
          <path d="M54 84 Q60 90 66 84" fill="none" stroke="#FDFBD4" stroke-width="2.2" stroke-linecap="round"/>
          <!-- Little Wing Sprites -->
          <path d="M18 58 Q4 46 16 38 Q22 48 24 58 Z" fill="#FDFBD4" opacity="0.8"/>
          <path d="M102 58 Q116 46 104 38 Q98 48 96 58 Z" fill="#FDFBD4" opacity="0.8"/>
        </g>
      </svg>
    `,

    // 6. Maya the Tech & Support Specialist (Help / Headset)
    maya: `
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="mayaShirt" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284C7"/>
            <stop offset="100%" stop-color="#0369A1"/>
          </linearGradient>
          <linearGradient id="mayaHair" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stop-color="#1E293B"/>
            <stop offset="100%" stop-color="#0F172A"/>
          </linearGradient>
        </defs>
        <g class="char-body">
          <!-- Torso -->
          <path d="M34 76 C34 62 86 62 86 76 L92 128 C92 132 28 132 28 128 Z" fill="url(#mayaShirt)"/>
          <path d="M48 76 L60 92 L72 76 Z" fill="#FFFFFF"/>
          <rect x="52" y="54" width="16" height="16" rx="4" fill="#FCD5B5"/>
          <!-- Head -->
          <circle cx="60" cy="42" r="22" fill="#FCD5B5"/>
          <!-- Modern Bob Haircut -->
          <path d="M36 40 C36 18 84 18 84 40 C84 48 82 56 80 60 C74 54 70 34 60 34 C50 34 46 54 40 60 C38 56 36 48 36 40 Z" fill="url(#mayaHair)"/>
          <!-- Headset Band & Mic -->
          <path d="M34 38 C34 16 86 16 86 38" fill="none" stroke="#D6A84F" stroke-width="3" stroke-linecap="round"/>
          <rect x="30" y="34" width="8" height="14" rx="4" fill="#C05800"/>
          <rect x="82" y="34" width="8" height="14" rx="4" fill="#C05800"/>
          <path d="M84 42 Q86 58 72 58" fill="none" stroke="#D6A84F" stroke-width="2" stroke-linecap="round"/>
          <circle cx="70" cy="58" r="3" fill="#22C55E"/>
          <!-- Expressive Eyes -->
          <g class="char-eyes">
            <circle cx="48" cy="42" r="3" fill="#0F172A"/>
            <circle cx="49.2" cy="40.8" r="1.2" fill="#FFFFFF"/>
            <circle cx="72" cy="42" r="3" fill="#0F172A"/>
            <circle cx="73.2" cy="40.8" r="1.2" fill="#FFFFFF"/>
          </g>
          <!-- Cheerful Smile -->
          <path d="M52 50 Q60 56 68 50" fill="none" stroke="#0369A1" stroke-width="2.2" stroke-linecap="round"/>
          <!-- Holding Interactive Support Tablet -->
          <rect x="42" y="90" width="36" height="26" rx="4" fill="#0F172A" stroke="#D6A84F" stroke-width="1.5"/>
          <rect x="46" y="94" width="28" height="18" rx="2" fill="#38BDF8" opacity="0.3"/>
          <circle cx="60" cy="103" r="4" fill="#38BDF8"/>
          <!-- Waving Hand -->
          <g class="char-arm-wave">
            <path d="M86 78 Q98 88 94 70" fill="none" stroke="url(#mayaShirt)" stroke-width="8" stroke-linecap="round"/>
            <circle cx="94" cy="68" r="5" fill="#FCD5B5"/>
          </g>
        </g>
      </svg>
    `,

    // 7. Inspector Rishi (Eligibility Auditor with Magnifying Glass)
    rishi: `
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="rishiCoat" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#78350F"/>
            <stop offset="100%" stop-color="#451A03"/>
          </linearGradient>
        </defs>
        <g class="char-body">
          <!-- Investigator Trench / Jacket -->
          <path d="M34 76 C34 62 86 62 86 76 L92 128 C92 132 28 132 28 128 Z" fill="url(#rishiCoat)"/>
          <path d="M46 76 L60 96 L74 76 Z" fill="#FEF3C7"/>
          <line x1="60" y1="96" x2="60" y2="128" stroke="#451A03" stroke-width="2"/>
          <!-- Head & Hat -->
          <circle cx="60" cy="42" r="22" fill="#FCD5B5"/>
          <path d="M34 28 C34 16 86 16 86 28 L94 32 L26 32 Z" fill="#451A03"/>
          <rect x="36" y="28" width="48" height="4" fill="#D6A84F"/>
          <!-- Focused Detective Eyes -->
          <g class="char-eyes">
            <circle cx="48" cy="42" r="3.2" fill="#140C04"/>
            <circle cx="49" cy="40.8" r="1.2" fill="#FFFFFF"/>
            <circle cx="72" cy="42" r="3.2" fill="#140C04"/>
            <circle cx="73" cy="40.8" r="1.2" fill="#FFFFFF"/>
          </g>
          <path d="M44 36 L52 38 M76 36 L68 38" stroke="#451A03" stroke-width="2" stroke-linecap="round"/>
          <path d="M54 50 Q60 54 66 50" fill="none" stroke="#78350F" stroke-width="2" stroke-linecap="round"/>
          <!-- Arm holding Magnifying Glass (< 55 age inspector) -->
          <g class="char-arm-scan">
            <path d="M86 78 Q96 92 84 100" fill="none" stroke="url(#rishiCoat)" stroke-width="8" stroke-linecap="round"/>
            <circle cx="84" cy="100" r="5" fill="#FCD5B5"/>
            <!-- Magnifying Glass -->
            <line x1="84" y1="100" x2="72" y2="86" stroke="#92400E" stroke-width="3" stroke-linecap="round"/>
            <circle cx="68" cy="80" r="12" fill="#DBEAFE" fill-opacity="0.45" stroke="#D6A84F" stroke-width="2.5"/>
            <text x="62" y="84" font-size="9" font-weight="bold" fill="#B45309">≤55</text>
          </g>
          <!-- Left Arm holding Checklist -->
          <path d="M34 78 Q24 94 38 102" fill="none" stroke="url(#rishiCoat)" stroke-width="8" stroke-linecap="round"/>
          <rect x="34" y="96" width="16" height="22" rx="2" fill="#FFFFFF" stroke="#92400E" stroke-width="1.2"/>
          <path d="M37 102 L41 106 L47 100" fill="none" stroke="#16A34A" stroke-width="1.8" stroke-linecap="round"/>
        </g>
      </svg>
    `,

    // 8. Dev the Policy Architect / Tech Guide
    dev: `
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="devVest" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EA580C"/>
            <stop offset="100%" stop-color="#9A3412"/>
          </linearGradient>
        </defs>
        <g class="char-body">
          <path d="M34 76 C34 62 86 62 86 76 L92 128 C92 132 28 132 28 128 Z" fill="#1E293B"/>
          <!-- High-vis Architecture Vest with Reflective Stripes -->
          <path d="M42 76 L36 128 L84 128 L78 76 Z" fill="url(#devVest)"/>
          <line x1="42" y1="100" x2="78" y2="100" stroke="#FDE047" stroke-width="3"/>
          <!-- Head -->
          <circle cx="60" cy="42" r="22" fill="#FCD5B5"/>
          <!-- Hardhat with Ensure Education Logo -->
          <path d="M32 30 C32 14 88 14 88 30 L94 34 L26 34 Z" fill="#F59E0B"/>
          <rect x="52" y="16" width="16" height="6" rx="2" fill="#D97706"/>
          <!-- Cheerful Face -->
          <g class="char-eyes">
            <circle cx="48" cy="42" r="3" fill="#0F172A"/>
            <circle cx="49" cy="40.8" r="1.2" fill="#FFFFFF"/>
            <circle cx="72" cy="42" r="3" fill="#0F172A"/>
            <circle cx="73" cy="40.8" r="1.2" fill="#FFFFFF"/>
          </g>
          <path d="M52 50 Q60 56 68 50" fill="none" stroke="#9A3412" stroke-width="2.2" stroke-linecap="round"/>
          <!-- Holding Policy Blueprint / Stylus -->
          <g class="char-arm-wave">
            <path d="M86 78 Q98 90 88 102" fill="none" stroke="#1E293B" stroke-width="8" stroke-linecap="round"/>
            <circle cx="88" cy="102" r="5" fill="#FCD5B5"/>
            <!-- Blueprint Roll -->
            <rect x="84" y="90" width="8" height="28" rx="3" fill="#38BDF8" stroke="#0284C7" stroke-width="1.5" transform="rotate(-25 84 90)"/>
          </g>
          <!-- Left Arm Pointing to UI -->
          <path d="M34 78 Q16 78 12 70" fill="none" stroke="#1E293B" stroke-width="8" stroke-linecap="round"/>
          <circle cx="12" cy="70" r="5" fill="#FCD5B5"/>
        </g>
      </svg>
    `,

    // 9. Leo the Claim Adjudicator / Officer
    leo: `
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="leoUniform" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E3A8A"/>
            <stop offset="100%" stop-color="#172554"/>
          </linearGradient>
        </defs>
        <g class="char-body">
          <path d="M34 76 C34 62 86 62 86 76 L92 128 C92 132 28 132 28 128 Z" fill="url(#leoUniform)"/>
          <path d="M48 76 L60 92 L72 76 Z" fill="#FFFFFF"/>
          <!-- Tie -->
          <path d="M58 90 L62 90 L64 112 L60 116 L56 112 Z" fill="#D6A84F"/>
          <!-- Institutional Badge -->
          <path d="M42 86 L48 86 L45 94 Z" fill="#F59E0B"/>
          <!-- Head -->
          <circle cx="60" cy="42" r="22" fill="#FCD5B5"/>
          <!-- Short Professional Haircut -->
          <path d="M38 36 C38 20 82 20 82 36 C82 36 86 42 80 42 C74 36 46 36 40 42 Z" fill="#1E293B"/>
          <g class="char-eyes">
            <circle cx="48" cy="42" r="3.2" fill="#0F172A"/>
            <circle cx="49" cy="40.8" r="1.2" fill="#FFFFFF"/>
            <circle cx="72" cy="42" r="3.2" fill="#0F172A"/>
            <circle cx="73" cy="40.8" r="1.2" fill="#FFFFFF"/>
          </g>
          <path d="M52 50 Q60 55 68 50" fill="none" stroke="#1E3A8A" stroke-width="2.2" stroke-linecap="round"/>
          <!-- Holding Approved Claim Stamp -->
          <g class="char-arm-wave">
            <path d="M86 78 Q100 88 88 104" fill="none" stroke="url(#leoUniform)" stroke-width="8" stroke-linecap="round"/>
            <circle cx="88" cy="104" r="5" fill="#FCD5B5"/>
            <!-- Green Approval Seal -->
            <circle cx="98" cy="108" r="10" fill="#16A34A" stroke="#FFFFFF" stroke-width="1.8"/>
            <path d="M94 108 L97 111 L102 105" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          </g>
          <path d="M34 78 Q22 92 34 106" fill="none" stroke="url(#leoUniform)" stroke-width="8" stroke-linecap="round"/>
          <circle cx="34" cy="106" r="5" fill="#FCD5B5"/>
        </g>
      </svg>
    `,

    // 10. Scrollie the Certificate Keeper (Living Diploma Mascot)
    scrollie: `
      <svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="scrollPaper" x1="0" y1="0" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF"/>
            <stop offset="60%" stop-color="#FDF8E8"/>
            <stop offset="100%" stop-color="#F5E6BE"/>
          </linearGradient>
          <linearGradient id="scrollRibbon" x1="0" y1="0" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#DC2626"/>
            <stop offset="100%" stop-color="#991B1B"/>
          </linearGradient>
        </defs>
        <g class="char-body">
          <!-- Main Rolled Certificate Parchment -->
          <path d="M32 24 C32 16 88 16 88 24 L84 106 C84 114 28 114 28 106 Z" 
                fill="url(#scrollPaper)" stroke="#D6A84F" stroke-width="2"/>
          <!-- Top & Bottom Roll Curves -->
          <ellipse cx="60" cy="22" rx="28" ry="7" fill="#FDF8E8" stroke="#D6A84F" stroke-width="1.5"/>
          <ellipse cx="56" cy="106" rx="28" ry="7" fill="#EAD7A4" stroke="#D6A84F" stroke-width="1.5"/>
          <!-- Red Honor Ribbon Sash -->
          <path d="M30 62 L86 52 L87 68 L31 78 Z" fill="url(#scrollRibbon)"/>
          <circle cx="58" cy="65" r="7" fill="#F59E0B" stroke="#B45309" stroke-width="1.5"/>
          <!-- Big Anime Cute Eyes -->
          <g class="char-eyes">
            <ellipse cx="46" cy="44" rx="5.5" ry="6.5" fill="#3D2314"/>
            <circle cx="48" cy="42" r="2.2" fill="#FFFFFF"/>
            <circle cx="44" cy="46" r="1.2" fill="#FFFFFF"/>
            <ellipse cx="72" cy="41" rx="5.5" ry="6.5" fill="#3D2314"/>
            <circle cx="74" cy="39" r="2.2" fill="#FFFFFF"/>
            <circle cx="70" cy="43" r="1.2" fill="#FFFFFF"/>
          </g>
          <!-- Sweet Rosy Cheeks -->
          <circle cx="36" cy="50" r="4.5" fill="#EF4444" opacity="0.45"/>
          <circle cx="80" cy="47" r="4.5" fill="#EF4444" opacity="0.45"/>
          <path d="M54 50 Q60 55 64 49" fill="none" stroke="#3D2314" stroke-width="2" stroke-linecap="round"/>
          <!-- Cute White Floating Hands -->
          <g class="char-arm-wave">
            <circle cx="16" cy="64" r="7" fill="#FFFFFF" stroke="#D6A84F" stroke-width="1.8"/>
          </g>
          <circle cx="100" cy="56" r="7" fill="#FFFFFF" stroke="#D6A84F" stroke-width="1.8"/>
        </g>
      </svg>
    `
  };

  // --- 2. PAGE CONFIGURATIONS (ALL 16 VIEWS) ---
  // STRICT RULE: Every character on any given page is 100% UNIQUE. No duplicates.
  const PAGE_CONFIGS = {
    // #1. HOME VIEW (6 unique characters)
    'home': [
      { charId: 'talvi', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'sway', pos: { top: '380px', left: '1.5%' } },
      { charId: 'aria', size: 'md', depth: 'mid', entrance: 'side-right', idle: 'wave', pos: { top: '240px', right: '2%' } },
      { charId: 'karan', size: 'md', depth: 'mid', entrance: 'bottom-right', idle: 'breathe', pos: { top: '640px', right: '3%' } },
      { charId: 'rishi', size: 'md', depth: 'fore', entrance: 'side-left', idle: 'scan', pos: { top: '1380px', left: '2%' } },
      { charId: 'dev', size: 'md', depth: 'mid', entrance: 'bottom-right', idle: 'head-tilt', pos: { top: '1980px', right: '3%' } },
      { charId: 'maya', size: 'lg', depth: 'fore', entrance: 'bottom-right', idle: 'wave', pos: { top: '3450px', right: '2%' } }
    ],

    // #2. ABOUT VIEW (4 unique characters)
    'about': [
      { charId: 'varma', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'breathe', pos: { top: '220px', left: '2%' } },
      { charId: 'aria', size: 'md', depth: 'mid', entrance: 'side-right', idle: 'head-tilt', pos: { top: '360px', right: '3%' } },
      { charId: 'talvi', size: 'md', depth: 'fore', entrance: 'bottom-right', idle: 'sway', pos: { top: '820px', right: '4%' } },
      { charId: 'dev', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'wave', pos: { top: '1150px', left: '3%' } }
    ],

    // #3. HOW IT WORKS VIEW (5 unique characters)
    'how-it-works': [
      { charId: 'aria', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'wave', pos: { top: '200px', left: '2%' } },
      { charId: 'karan', size: 'md', depth: 'mid', entrance: 'side-right', idle: 'breathe', pos: { top: '480px', right: '3%' } },
      { charId: 'rishi', size: 'md', depth: 'fore', entrance: 'side-left', idle: 'scan', pos: { top: '820px', left: '2.5%' } },
      { charId: 'leo', size: 'md', depth: 'mid', entrance: 'bottom-right', idle: 'head-tilt', pos: { top: '1180px', right: '3%' } },
      { charId: 'scrollie', size: 'md', depth: 'fore', entrance: 'bottom-left', idle: 'float', pos: { top: '1520px', left: '3%' } }
    ],

    // #4. BENEFITS VIEW (5 unique characters)
    'benefits': [
      { charId: 'aria', size: 'lg', depth: 'fore', entrance: 'bottom-right', idle: 'wave', pos: { top: '220px', right: '2%' } },
      { charId: 'karan', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'breathe', pos: { top: '420px', left: '3%' } },
      { charId: 'varma', size: 'md', depth: 'mid', entrance: 'bottom-right', idle: 'head-tilt', pos: { top: '780px', right: '3%' } },
      { charId: 'talvi', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'sway', pos: { top: '1120px', left: '2%' } },
      { charId: 'maya', size: 'md', depth: 'fore', entrance: 'bottom-left', idle: 'wave', pos: { top: '1450px', left: '4%' } }
    ],

    // #5. ELIGIBILITY VIEW (4 unique characters)
    'eligibility': [
      { charId: 'rishi', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'scan', pos: { top: '240px', left: '1.5%' } },
      { charId: 'karan', size: 'md', depth: 'mid', entrance: 'side-right', idle: 'breathe', pos: { top: '420px', right: '3%' } },
      { charId: 'aria', size: 'md', depth: 'mid', entrance: 'bottom-left', idle: 'head-tilt', pos: { top: '780px', left: '3%' } },
      { charId: 'talvi', size: 'md', depth: 'fore', entrance: 'bottom-right', idle: 'sway', pos: { top: '1060px', right: '2%' } }
    ],

    // #6. COLLEGES VIEW (4 unique characters)
    'colleges': [
      { charId: 'varma', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'head-tilt', pos: { top: '220px', left: '2%' } },
      { charId: 'aria', size: 'md', depth: 'mid', entrance: 'side-right', idle: 'wave', pos: { top: '420px', right: '3%' } },
      { charId: 'dev', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'breathe', pos: { top: '780px', left: '3%' } },
      { charId: 'talvi', size: 'md', depth: 'fore', entrance: 'bottom-right', idle: 'sway', pos: { top: '1120px', right: '2%' } }
    ],

    // #7. PROTECTION VIEW (4 unique characters)
    'protection': [
      { charId: 'talvi', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'sway', pos: { top: '220px', left: '1.5%' } },
      { charId: 'karan', size: 'md', depth: 'mid', entrance: 'side-right', idle: 'breathe', pos: { top: '440px', right: '3%' } },
      { charId: 'aria', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'wave', pos: { top: '800px', left: '2.5%' } },
      { charId: 'leo', size: 'md', depth: 'fore', entrance: 'bottom-right', idle: 'head-tilt', pos: { top: '1150px', right: '2%' } }
    ],

    // #8. FAQ VIEW (4 unique characters)
    'faq': [
      { charId: 'maya', size: 'lg', depth: 'fore', entrance: 'bottom-right', idle: 'wave', pos: { top: '240px', right: '2%' } },
      { charId: 'aria', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'head-tilt', pos: { top: '440px', left: '3%' } },
      { charId: 'rishi', size: 'md', depth: 'fore', entrance: 'bottom-left', idle: 'scan', pos: { top: '820px', left: '2.5%' } },
      { charId: 'varma', size: 'md', depth: 'mid', entrance: 'side-right', idle: 'breathe', pos: { top: '1150px', right: '3%' } }
    ],

    // #9. TERMS VIEW (3 unique characters)
    'terms': [
      { charId: 'rishi', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'scan', pos: { top: '220px', left: '2%' } },
      { charId: 'scrollie', size: 'md', depth: 'mid', entrance: 'side-right', idle: 'float', pos: { top: '420px', right: '3%' } },
      { charId: 'leo', size: 'md', depth: 'fore', entrance: 'side-left', idle: 'head-tilt', pos: { top: '780px', left: '3%' } }
    ],

    // #10. CONTACT VIEW (4 unique characters)
    'contact': [
      { charId: 'maya', size: 'lg', depth: 'fore', entrance: 'bottom-right', idle: 'wave', pos: { top: '220px', right: '2%' } },
      { charId: 'aria', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'head-tilt', pos: { top: '380px', left: '3%' } },
      { charId: 'karan', size: 'md', depth: 'mid', entrance: 'bottom-left', idle: 'breathe', pos: { top: '740px', left: '3%' } },
      { charId: 'dev', size: 'md', depth: 'fore', entrance: 'side-right', idle: 'wave', pos: { top: '960px', right: '2%' } }
    ],

    // #11. STUDENT LOGIN VIEW (3 unique characters)
    'student-login': [
      { charId: 'aria', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'wave', pos: { top: '180px', left: '3%' } },
      { charId: 'talvi', size: 'md', depth: 'fore', entrance: 'side-right', idle: 'sway', pos: { top: '260px', right: '3%' } },
      { charId: 'karan', size: 'md', depth: 'mid', entrance: 'bottom-right', idle: 'breathe', pos: { top: '520px', right: '4%' } }
    ],

    // #12. STUDENT REGISTER (5 unique characters)
    'student-register': [
      { charId: 'aria', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'head-tilt', pos: { top: '180px', left: '2%' } },
      { charId: 'karan', size: 'md', depth: 'fore', entrance: 'side-right', idle: 'breathe', pos: { top: '240px', right: '3%' } },
      { charId: 'rishi', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'scan', pos: { top: '520px', left: '2.5%' } },
      { charId: 'talvi', size: 'md', depth: 'fore', entrance: 'bottom-right', idle: 'sway', pos: { top: '640px', right: '3%' } },
      { charId: 'leo', size: 'md', depth: 'mid', entrance: 'bottom-left', idle: 'wave', pos: { top: '920px', left: '3%' } }
    ],

    // #13. COLLEGE LOGIN VIEW (3 unique characters)
    'college-login': [
      { charId: 'varma', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'head-tilt', pos: { top: '190px', left: '3%' } },
      { charId: 'talvi', size: 'md', depth: 'fore', entrance: 'side-right', idle: 'sway', pos: { top: '250px', right: '3%' } },
      { charId: 'dev', size: 'md', depth: 'mid', entrance: 'bottom-right', idle: 'breathe', pos: { top: '540px', right: '4%' } }
    ],

    // #14. COLLEGE PORTAL DASHBOARD (5 unique characters)
    'college-portal': [
      { charId: 'varma', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'head-tilt', pos: { top: '190px', left: '1.5%' } },
      { charId: 'leo', size: 'md', depth: 'fore', entrance: 'side-right', idle: 'wave', pos: { top: '260px', right: '2%' } },
      { charId: 'aria', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'head-tilt', pos: { top: '600px', left: '2.5%' } },
      { charId: 'talvi', size: 'md', depth: 'fore', entrance: 'bottom-right', idle: 'sway', pos: { top: '780px', right: '3%' } },
      { charId: 'dev', size: 'md', depth: 'mid', entrance: 'bottom-left', idle: 'breathe', pos: { top: '1180px', left: '3%' } }
    ],

    // #15. STUDENT DASHBOARD (5 unique characters)
    'student-dashboard': [
      { charId: 'talvi', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'sway', pos: { top: '190px', left: '1.5%' } },
      { charId: 'aria', size: 'md', depth: 'fore', entrance: 'side-right', idle: 'wave', pos: { top: '260px', right: '2%' } },
      { charId: 'karan', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'breathe', pos: { top: '580px', left: '2.5%' } },
      { charId: 'scrollie', size: 'md', depth: 'mid', entrance: 'bottom-right', idle: 'float', pos: { top: '760px', right: '3%' } },
      { charId: 'maya', size: 'md', depth: 'fore', entrance: 'bottom-left', idle: 'wave', pos: { top: '1150px', left: '3%' } }
    ],

    // #16. ADMIN DASHBOARD (5 unique characters)
    'admin-dashboard': [
      { charId: 'dev', size: 'lg', depth: 'fore', entrance: 'bottom-left', idle: 'head-tilt', pos: { top: '190px', left: '1.5%' } },
      { charId: 'leo', size: 'md', depth: 'fore', entrance: 'side-right', idle: 'wave', pos: { top: '260px', right: '2%' } },
      { charId: 'rishi', size: 'md', depth: 'mid', entrance: 'side-left', idle: 'scan', pos: { top: '560px', left: '2.5%' } },
      { charId: 'talvi', size: 'md', depth: 'fore', entrance: 'bottom-right', idle: 'sway', pos: { top: '780px', right: '3%' } },
      { charId: 'varma', size: 'md', depth: 'mid', entrance: 'bottom-left', idle: 'breathe', pos: { top: '1150px', left: '3%' } }
    ]
  };

  // --- 3. CHARACTER SYSTEM ENGINE ---
  class TalvexCharacterSystem {
    constructor() {
      this.activeViews = new Set();
      this.observer = null;
      this.init();
    }

    init() {
      this.setupObserver();
      this.buildAllViews();
      this.triggerEntranceForActiveView();
    }

    setupObserver() {
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const charEl = entry.target;
              charEl.classList.add('char-revealed');
              this.observer.unobserve(charEl);
            }
          });
        }, {
          rootMargin: '100px 0px',
          threshold: 0.15
        });
      }
    }

    buildAllViews() {
      // Clean up any stale mascot wrappers if present anywhere
      document.querySelectorAll('.mascot-wrapper').forEach(el => el.remove());

      Object.keys(PAGE_CONFIGS).forEach(viewKey => {
        const viewEl = document.getElementById('view-' + viewKey);
        if (!viewEl) return;

        // Ensure relative positioning
        viewEl.style.position = 'relative';

        // Check if character layer already exists
        let layer = viewEl.querySelector('.talvex-char-layer');
        if (layer) layer.remove();

        layer = document.createElement('div');
        layer.className = 'talvex-char-layer';

        const configs = PAGE_CONFIGS[viewKey] || [];
        const seenCharIds = new Set();

        configs.forEach((item, index) => {
          // Strict deduplication guarantee: never repeat the same character on the same page
          if (seenCharIds.has(item.charId)) {
            return;
          }
          seenCharIds.add(item.charId);

          const charItem = this.createCharacterElement(item, viewKey, index);
          layer.appendChild(charItem);

          if (this.observer) {
            this.observer.observe(charItem);
          } else {
            charItem.classList.add('char-revealed');
          }
        });

        viewEl.appendChild(layer);
      });
    }

    createCharacterElement(config, viewKey, index) {
      const charWrapper = document.createElement('div');
      
      const sizeClass = `char-size-${config.size || 'md'}`;
      const depthClass = `char-depth-${config.depth || 'mid'}`;
      const entranceClass = `char-enter-${config.entrance || 'bottom-left'}`;
      const idleClass = `idle-${config.idle || 'breathe'}`;
      const hideMobileClass = config.hideMobile ? 'char-hide-mobile' : '';

      charWrapper.className = `talvex-char char-animate-ready ${sizeClass} ${depthClass} ${entranceClass} ${idleClass} ${hideMobileClass}`;
      charWrapper.id = `char-${viewKey}-${index}-${config.charId}`;

      // Positioning styles
      if (config.pos) {
        Object.entries(config.pos).forEach(([prop, val]) => {
          charWrapper.style[prop] = val;
        });
      }

      // Staggered reveal animation delay
      charWrapper.style.animationDelay = `${index * 0.12}s`;

      // Set target opacity variable for CSS keyframes
      const targetOpacity = config.depth === 'bg' ? '0.5' : (config.depth === 'mid' ? '0.9' : '1.0');
      charWrapper.style.setProperty('--target-opacity', targetOpacity);

      // Inject unique SVG
      const rawSvg = CHARACTER_SVGS[config.charId] || CHARACTER_SVGS.talvi;
      // Replace IDs to avoid collisions
      const uniqueSvg = rawSvg.replace(/id="([^"]+)"/g, `id="$1-${viewKey}-${index}"`)
                              .replace(/url\(#([^)]+)\)/g, `url(#$1-${viewKey}-${index})`);
      
      charWrapper.innerHTML = uniqueSvg;
      return charWrapper;
    }

    onRouteChanged(hash) {
      // Purge any lingering legacy mascot wrappers from entire document
      document.querySelectorAll('.mascot-wrapper').forEach(el => el.remove());

      const route = (hash || window.location.hash || '#home').replace('#', '');
      const activeView = document.getElementById('view-' + route);
      if (!activeView) return;

      // Ensure 100% character uniqueness in active view
      const charLayer = activeView.querySelector('.talvex-char-layer');
      if (charLayer) {
        const seen = new Set();
        charLayer.querySelectorAll('.talvex-char').forEach(charEl => {
          const parts = charEl.id.split('-');
          const charId = parts[parts.length - 1];
          if (seen.has(charId)) {
            charEl.remove();
          } else {
            seen.add(charId);
          }
        });
      }

      // Small delay to allow display: block transition
      setTimeout(() => {
        const characters = activeView.querySelectorAll('.talvex-char');
        characters.forEach((charEl, idx) => {
          charEl.classList.remove('char-revealed');
          void charEl.offsetWidth; // Force reflow
          setTimeout(() => {
            charEl.classList.add('char-revealed');
          }, idx * 100);
        });
      }, 50);
    }

    triggerEntranceForActiveView() {
      const hash = window.location.hash || '#home';
      this.onRouteChanged(hash);
    }
  }

  // Export & Global Init
  window.TalvexCharacterSystem = TalvexCharacterSystem;

  document.addEventListener('DOMContentLoaded', () => {
    window.talvexCharacterSystem = new TalvexCharacterSystem();
  });

  // Also init immediately if DOM is already loaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    window.talvexCharacterSystem = new TalvexCharacterSystem();
  }
})();
