/**
 * ENSURE EDUCATION — BILINGUAL AI VOICE & CHAT ASSISTANT
 * Features:
 * - Speech-to-Text (STT) in Hindi (hi-IN) and English (en-IN/en-US)
 * - Text-to-Speech (TTS) natural voice playback
 * - Deep institutional knowledge of Required Documents & Terms & Conditions
 * - Powered by Groq Llama 3.3 with zero-fail institutional fallback
 */

(function () {
  'use strict';

  class EnsureAiAssistant {
    constructor() {
      this.isOpen = false;
      this.language = localStorage.getItem('ensure_ai_lang') || 'auto'; // 'auto', 'en', 'hi'
      this.isVoiceEnabled = localStorage.getItem('ensure_ai_voice') !== 'false';
      this.isRecording = false;
      this.isSpeaking = false;
      this.conversation = [];
      this.hasGroqKey = false;
      this.groqModel = 'llama-3.3-70b-versatile';
      this.recognition = null;
      this.currentUtterance = null;
      this.voices = [];

      this.init();
    }

    async init() {
      this.initSpeechVoices();
      this.initSpeechRecognition();
      this.renderWidget();
      this.bindEvents();
      await this.checkAiStatus();
    }

    /* ----------------------------------------------------------------------
       1. Speech Recognition (Speech-to-Text)
       ---------------------------------------------------------------------- */
    initSpeechRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.warn('[Ensure AI] Web SpeechRecognition API is not supported in this browser.');
        return;
      }

      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
          this.isRecording = true;
          this.updateMicUi(true);
          this.showVoiceBar('Listening in ' + (this.getSpeechLang() === 'hi-IN' ? 'Hindi (हिंदी)...' : 'English / Hindi...'));
        };

        this.recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          const display = finalTranscript || interimTranscript;
          if (display) {
            this.showVoiceBar(`" ${display} "`);
            const input = document.getElementById('ensure-ai-input');
            if (input) input.value = display;
          }

          if (finalTranscript) {
            this.stopRecording();
            this.sendMessage(finalTranscript);
          }
        };

        this.recognition.onerror = (event) => {
          console.warn('[Ensure AI] Speech recognition error:', event.error);
          this.stopRecording();
          if (event.error === 'not-allowed') {
            this.showVoiceBar('Microphone permission denied. Please allow microphone in browser.', 4000);
          } else if (event.error !== 'no-speech') {
            this.showVoiceBar(`Mic notice: ${event.error}`, 3000);
          }
        };

        this.recognition.onend = () => {
          this.stopRecording();
        };
      } catch (e) {
        console.warn('[Ensure AI] Could not initialize SpeechRecognition:', e);
      }
    }

    getSpeechLang() {
      if (this.language === 'hi') return 'hi-IN';
      return 'en-IN';
    }

    toggleRecording() {
      if (!this.recognition) {
        alert('Voice speech-to-text is supported on modern Chrome, Edge, and Safari browsers. Please type your message or check browser permissions.');
        return;
      }

      if (this.isRecording) {
        this.stopRecording();
      } else {
        this.startRecording();
      }
    }

    startRecording() {
      if (!this.recognition) return;
      this.stopSpeaking();
      try {
        this.recognition.lang = this.getSpeechLang();
        this.recognition.start();
      } catch (err) {
        // Recognition might already be running
        this.recognition.stop();
      }
    }

    stopRecording() {
      this.isRecording = false;
      this.updateMicUi(false);
      setTimeout(() => {
        if (!this.isRecording) this.hideVoiceBar();
      }, 1500);
      try {
        if (this.recognition) this.recognition.stop();
      } catch (e) {}
    }

    updateMicUi(isRecording) {
      const micBtn = document.getElementById('ensure-ai-mic-btn');
      if (micBtn) {
        if (isRecording) {
          micBtn.classList.add('recording');
          micBtn.title = 'Stop listening';
        } else {
          micBtn.classList.remove('recording');
          micBtn.title = 'Speak in Hindi or English (Voice Assistant)';
        }
      }
    }

    showVoiceBar(text, timeoutMs = null) {
      const voiceBar = document.getElementById('ensure-ai-voice-bar');
      const voiceText = document.getElementById('ensure-ai-voice-text');
      if (voiceBar && voiceText) {
        voiceText.textContent = text;
        voiceBar.classList.add('active');
        if (timeoutMs) {
          setTimeout(() => {
            this.hideVoiceBar();
          }, timeoutMs);
        }
      }
    }

    hideVoiceBar() {
      const voiceBar = document.getElementById('ensure-ai-voice-bar');
      if (voiceBar) {
        voiceBar.classList.remove('active');
      }
    }

    /* ----------------------------------------------------------------------
       2. Speech Synthesis (Text-to-Speech)
       ---------------------------------------------------------------------- */
    initSpeechVoices() {
      if ('speechSynthesis' in window) {
        const load = () => {
          this.voices = window.speechSynthesis.getVoices();
        };
        load();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
          window.speechSynthesis.onvoiceschanged = load;
        }
      }
    }

    enforceFemaleGrammar(text) {
      if (!text || typeof text !== 'string') return text;
      let out = text;
      // Devanagari Hindi feminine replacements
      out = out
        .replace(/कर\s+सकता\s+हूँ/g, 'कर सकती हूँ')
        .replace(/कर\s+सकता\s+हूं/g, 'कर सकती हूँ')
        .replace(/बता\s+सकता\s+हूँ/g, 'बता सकती हूँ')
        .replace(/बता\s+सकता\s+हूं/g, 'बता सकती हूँ')
        .replace(/समझा\s+सकता\s+हूँ/g, 'समझा सकती हूँ')
        .replace(/समझा\s+सकता\s+हूं/g, 'समझा सकती हूँ')
        .replace(/\bसकता\s+हूँ\b/g, 'सकती हूँ')
        .replace(/\bसकता\s+हूं\b/g, 'सकती हूँ')
        .replace(/\bबताता\s+हूँ\b/g, 'बताती हूँ')
        .replace(/\bबताता\s+हूं\b/g, 'बताती हूँ')
        .replace(/\bसमझाता\s+हूँ\b/g, 'समझाती हूँ')
        .replace(/\bसमझाता\s+हूं\b/g, 'समझाती हूँ')
        .replace(/\bकरूंगा\b/g, 'करूँगी')
        .replace(/\bकरूँगा\b/g, 'करूँगी')
        .replace(/\bबताऊंगा\b/g, 'बताऊँगी')
        .replace(/\bबताऊँगा\b/g, 'बताऊँगी')
        .replace(/\bरहूँगा\b/g, 'रहूँगी')
        .replace(/\bरहूंगा\b/g, 'रहूँगी')
        .replace(/\bसहायक\s+हूँ\b/g, 'सहायिका हूँ')
        .replace(/\bसहायक\s+हूं\b/g, 'सहायिका हूँ')
        .replace(/\bसहायकिका\b/g, 'सहायिका')
        .replace(/\bसहायक\b/g, 'सहायिका');

      // Hinglish / Romanized Hindi feminine replacements
      out = out
        .replace(/\bkar\s+sakta\s+hu[nm]?\b/gi, 'kar sakti hun')
        .replace(/\bbata\s+sakta\s+hu[nm]?\b/gi, 'bata sakti hun')
        .replace(/\bsamjha\s+sakta\s+hu[nm]?\b/gi, 'samjha sakti hun')
        .replace(/\bhelp\s+kar\s+sakta\s+hu[nm]?\b/gi, 'help kar sakti hun')
        .replace(/\bsakta\s+hu[nm]?\b/gi, 'sakti hun')
        .replace(/\bkarunga\b/gi, 'karungi')
        .replace(/\bbataunga\b/gi, 'bataungi')
        .replace(/\bkaruunga\b/gi, 'karuungi')
        .replace(/\bbatauunga\b/gi, 'batauungi');

      return out;
    }

    speakText(text, btnElement = null) {
      if (!('speechSynthesis' in window)) return;
      this.stopSpeaking();

      // 1. Strip all Unicode emojis and pictographs completely so TTS never reads them out loud
      let cleanText = text.replace(/[\p{Extended_Pictographic}\uFE0F\u200D\u200E\u200F\u2600-\u27BF]/gu, '');

      // 2. Strip HTML tags like <br>, table pipes, markdown tags, bold, bullets, headers, URLs
      cleanText = cleanText
        .replace(/https?:\/\/\S+/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\|/g, ', ')
        .replace(/[*_#`~•]/g, ' ')
        .replace(/[-–—]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // 3. Enforce feminine grammar on TTS speech
      cleanText = this.enforceFemaleGrammar(cleanText);

      if (!cleanText) return;

      // 4. Detect language strictly based on actual Devanagari Hindi characters
      const isDevanagariHindi = /[\u0900-\u097F]/.test(cleanText);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select suitable female voice
      if (isDevanagariHindi) {
        utterance.lang = 'hi-IN';
        const femaleHiVoice = this.voices.find(v => (v.lang === 'hi-IN' || v.lang.startsWith('hi')) && /swara|kalpana|heera|geeta|female|google\s*हिन्दी/i.test(v.name));
        const hiVoice = femaleHiVoice || this.voices.find(v => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
        if (hiVoice) utterance.voice = hiVoice;
      } else {
        utterance.lang = 'en-IN';
        const femaleEnVoice = this.voices.find(v => (v.lang === 'en-IN' || (v.lang.startsWith('en') && v.name.includes('India'))) && /neerja|heera|swara|female/i.test(v.name));
        const inVoice = femaleEnVoice || this.voices.find(v => v.lang === 'en-IN' || v.name.includes('India') || v.lang.startsWith('en'));
        if (inVoice) utterance.voice = inVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentUtterance = utterance;
        if (btnElement) btnElement.classList.add('speaking');
      };

      utterance.onend = utterance.onerror = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        if (btnElement) btnElement.classList.remove('speaking');
        document.querySelectorAll('.ensure-ai-action-btn.speaking').forEach(b => b.classList.remove('speaking'));
      };

      window.speechSynthesis.speak(utterance);
    }

    stopSpeaking() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      this.isSpeaking = false;
      this.currentUtterance = null;
      document.querySelectorAll('.ensure-ai-action-btn.speaking').forEach(b => b.classList.remove('speaking'));
    }

    /* ----------------------------------------------------------------------
       3. Backend Communication
       ---------------------------------------------------------------------- */
    async checkAiStatus() {
      try {
        const res = await fetch('/api/v1/ai/status');
        if (res.ok) {
          const data = await res.json();
          this.hasGroqKey = data.hasGroqKey;
          this.groqModel = data.model || 'llama-3.3-70b-versatile';
          this.updateEngineBadge();
        }
      } catch (e) {
        console.warn('[Ensure AI] Could not query AI status, using default knowledge engine.');
      }
    }

    updateEngineBadge() {
      const badge = document.getElementById('ensure-ai-engine-badge');
      if (badge) {
        if (this.hasGroqKey) {
          badge.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5z"></path></svg> Groq Llama 3.3`;
          badge.title = 'Connected to high-speed Groq Llama 3.3 Generative AI';
        } else {
          badge.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg> Institutional Mode`;
          badge.title = 'Using verified local knowledge base. Click Settings to enter Groq API Key.';
        }
      }
    }

    async sendMessage(text) {
      const message = (text || '').trim();
      if (!message) return;

      const input = document.getElementById('ensure-ai-input');
      if (input) input.value = '';

      // Append user message
      this.appendMessage('user', message);
      this.conversation.push({ role: 'user', content: message });

      // Append typing indicator
      const typingId = this.showTypingIndicator();

      try {
        const storedKey = localStorage.getItem('ensure_ai_groq_key') || '';
        const payload = {
          message: message,
          conversation: this.conversation.slice(-6),
          language: this.language,
          customApiKey: storedKey
        };

        const res = await fetch('/api/v1/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        this.removeTypingIndicator(typingId);

        if (res.ok) {
          const data = await res.json();
          const reply = data.message || 'Sorry, I could not process your query.';
          if (data.hasGroqKey !== undefined && this.hasGroqKey !== data.hasGroqKey) {
            this.hasGroqKey = data.hasGroqKey;
            this.updateEngineBadge();
          }
          this.appendMessage('bot', reply);
          this.conversation.push({ role: 'assistant', content: reply });

          if (this.isVoiceEnabled) {
            this.speakText(reply);
          }
        } else {
          const err = await res.json();
          this.appendMessage('bot', `⚠️ Notice: ${err.error || 'Server error'}`);
        }
      } catch (err) {
        this.removeTypingIndicator(typingId);
        this.appendMessage('bot', '⚠️ Connection notice. Please check your local network or server connection.');
      }
    }

    /* ----------------------------------------------------------------------
       4. UI Rendering & DOM Setup
       ---------------------------------------------------------------------- */
    renderWidget() {
      // 1. Floating Launcher Button
      const launcher = document.createElement('div');
      launcher.id = 'ensure-ai-launcher';
      launcher.className = 'ensure-ai-launcher';
      launcher.title = 'Open Ensure AI Voice & Chat Assistant';
      launcher.innerHTML = `
        <div class="ensure-ai-launcher-avatar">
          <div class="ensure-ai-pulse-ring"></div>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18 2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13zm9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"></path>
          </svg>
        </div>
        <div class="ensure-ai-launcher-info">
          <span class="ensure-ai-launcher-title">
            Ensure AI
            <span class="ensure-ai-launcher-badge">Voice</span>
          </span>
          <span class="ensure-ai-launcher-sub">
            <span class="ensure-ai-online-dot"></span>
            Hindi & English Online
          </span>
        </div>
      `;
      document.body.appendChild(launcher);

      // 2. Chat Window Container
      const widget = document.createElement('div');
      widget.id = 'ensure-ai-widget';
      widget.className = 'ensure-ai-widget hidden';
      widget.innerHTML = `
        <!-- Header -->
        <div class="ensure-ai-header">
          <div class="ensure-ai-header-left">
            <div class="ensure-ai-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18 2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13zm9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"></path>
              </svg>
            </div>
            <div class="ensure-ai-title-wrap">
              <div class="ensure-ai-title-text">
                Ensure AI
                <span style="font-size: 0.65rem; background: rgba(253,251,212,0.25); padding: 1px 6px; border-radius: 4px; font-weight: 600;">Voice & Chat</span>
              </div>
              <div class="ensure-ai-status-pill">
                <span class="ensure-ai-online-dot"></span>
                <span>Active Protection Assistant</span>
              </div>
            </div>
          </div>
          <div class="ensure-ai-header-controls">
            <!-- Language Switcher Pill -->
            <button id="ensure-ai-lang-btn" class="ensure-ai-lang-pill" title="Toggle language: English / Hindi">
              <span id="ensure-ai-lang-text">EN / हिंदी</span>
            </button>
            <!-- Settings Button -->
            <button id="ensure-ai-settings-toggle" class="ensure-ai-btn-icon" title="AI Settings & Groq API Key">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
            <!-- Close Button -->
            <button id="ensure-ai-close-btn" class="ensure-ai-btn-icon" title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Subheader Status Bar -->
        <div class="ensure-ai-subbar">
          <div id="ensure-ai-voice-toggle" class="ensure-ai-voice-toggle" title="Toggle automatic speech synthesis">
            <svg id="ensure-ai-speaker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            <span id="ensure-ai-voice-status-text">Voice Playback: ON</span>
          </div>
          <div id="ensure-ai-engine-badge" class="ensure-ai-engine-badge" title="AI Model Status">
            Institutional Engine
          </div>
        </div>

        <!-- Settings Modal Overlay -->
        <div id="ensure-ai-settings-modal" class="ensure-ai-settings-modal">
          <div class="ensure-ai-settings-title">
            <span>Groq AI Configuration</span>
            <span style="font-size: 0.72rem; color: var(--gold-primary); font-weight: 600;">Llama 3.3 70B</span>
          </div>
          <div class="ensure-ai-settings-desc">
            Enter your <strong>Groq API Key</strong> (<code>gsk_...</code>) for lightning-fast Llama-3.3 reasoning. If left empty, the assistant uses the built-in institutional knowledge base.
          </div>
          <div class="ensure-ai-settings-field">
            <label for="ensure-ai-groq-key-input">Groq API Key:</label>
            <input type="password" id="ensure-ai-groq-key-input" placeholder="gsk_xxxxxxxxxxxxxxxxxxxx">
          </div>
          <div class="ensure-ai-settings-actions">
            <button id="ensure-ai-settings-cancel" class="ensure-ai-settings-btn cancel">Cancel</button>
            <button id="ensure-ai-settings-save" class="ensure-ai-settings-btn save">Save Key</button>
          </div>
        </div>

        <!-- Messages History -->
        <div id="ensure-ai-messages" class="ensure-ai-messages"></div>

        <!-- Quick Suggestion Topic Pills -->
        <div id="ensure-ai-suggestions" class="ensure-ai-suggestions"></div>

        <!-- Live Speech Transcription Bar -->
        <div id="ensure-ai-voice-bar" class="ensure-ai-voice-bar">
          <div class="ensure-ai-voice-status">
            <div class="ensure-ai-soundwaves">
              <span class="ensure-ai-wave-bar"></span>
              <span class="ensure-ai-wave-bar"></span>
              <span class="ensure-ai-wave-bar"></span>
              <span class="ensure-ai-wave-bar"></span>
              <span class="ensure-ai-wave-bar"></span>
            </div>
            <span id="ensure-ai-voice-text">Listening...</span>
          </div>
          <button id="ensure-ai-voice-cancel" style="background:none; border:none; color:var(--gold-dark); cursor:pointer; font-weight:700; font-size:0.75rem;">Cancel</button>
        </div>

        <!-- Chat Input Form -->
        <form id="ensure-ai-form" class="ensure-ai-input-form">
          <button type="button" id="ensure-ai-mic-btn" class="ensure-ai-mic-btn" title="Speak in Hindi or English (Voice Assistant)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </button>
          <input type="text" id="ensure-ai-input" class="ensure-ai-input" placeholder="Type or click mic to speak..." autocomplete="off">
          <button type="submit" id="ensure-ai-send-btn" class="ensure-ai-send-btn" title="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      `;
      document.body.appendChild(widget);

      this.renderSuggestionPills();
      this.sendInitialGreeting();
    }

    renderSuggestionPills() {
      const container = document.getElementById('ensure-ai-suggestions');
      if (!container) return;

      const isHindi = this.language === 'hi';
      const pills = isHindi ? [
        { label: '📋 आवश्यक दस्तावेज़', query: 'रजिस्ट्रेशन के लिए कौन-कौन से दस्तावेज़ (Documents) चाहिए?' },
        { label: '📜 नियम एवं शर्तें', query: 'Ensure Education के मुख्य नियम और शर्तें क्या हैं?' },
        { label: '💰 1% प्रीमियम', query: '1% छात्र प्रीमियम कैसे काम करता है? एक उदाहरण दें।' },
        { label: '🛡️ आयु सीमा (≤ 55)', query: 'फीस जमाकर्ता की आयु सीमा (Age limit) और पात्रता के क्या नियम हैं?' },
        { label: '⚖️ दावा निपटान', query: 'यदि फीस जमाकर्ता का निधन हो जाए तो दावा (Claim) कैसे किया जाता है?' }
      ] : [
        { label: '📋 Required Documents', query: 'What documents are required for student registration?' },
        { label: '📜 Terms & Conditions', query: 'Tell me the core terms and conditions of Ensure Education.' },
        { label: '💰 1% Scheme Premium', query: 'How does the 1% student premium calculation work? Give examples.' },
        { label: '🛡️ Fee Payer Age (≤ 55)', query: 'What is the fee payer age limit and income proof rule?' },
        { label: '⚖️ Bereavement Claim', query: 'How does the bereavement tuition protection claim process work?' }
      ];

      container.innerHTML = pills.map(p => `
        <button type="button" class="ensure-ai-pill" data-query="${p.query}">
          ${p.label}
        </button>
      `).join('');

      container.querySelectorAll('.ensure-ai-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          const q = btn.getAttribute('data-query');
          if (q) this.sendMessage(q);
        });
      });
    }

    sendInitialGreeting() {
      const isHindi = this.language === 'hi';
      const text = isHindi
        ? `नमस्ते! 🙏 मैं **Ensure AI** हूँ — आपकी डिजिटल सहायिका। आवश्यक दस्तावेज़ों या योजना के नियमों के बारे में मैं आपकी क्या सहायता कर सकती हूँ?`
        : `Hello! 👋 I'm **Ensure AI**. How can I help you with required documents or scheme terms today?`;

      this.appendMessage('bot', text);
    }

    bindEvents() {
      // Launcher Toggle
      const launcher = document.getElementById('ensure-ai-launcher');
      const widget = document.getElementById('ensure-ai-widget');
      const closeBtn = document.getElementById('ensure-ai-close-btn');

      launcher.addEventListener('click', () => this.toggleWidget());
      closeBtn.addEventListener('click', () => this.toggleWidget(false));

      // Form submission
      const form = document.getElementById('ensure-ai-form');
      const input = document.getElementById('ensure-ai-input');
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = input.value.trim();
        if (msg) this.sendMessage(msg);
      });

      // Microphone button
      const micBtn = document.getElementById('ensure-ai-mic-btn');
      micBtn.addEventListener('click', () => this.toggleRecording());

      // Cancel Voice
      const cancelVoice = document.getElementById('ensure-ai-voice-cancel');
      if (cancelVoice) {
        cancelVoice.addEventListener('click', () => this.stopRecording());
      }

      // Voice Playback Toggle
      const voiceToggle = document.getElementById('ensure-ai-voice-toggle');
      voiceToggle.addEventListener('click', () => {
        this.isVoiceEnabled = !this.isVoiceEnabled;
        localStorage.setItem('ensure_ai_voice', this.isVoiceEnabled);
        this.updateVoiceToggleUi();
        if (!this.isVoiceEnabled) this.stopSpeaking();
      });

      // Language Switcher
      const langBtn = document.getElementById('ensure-ai-lang-btn');
      langBtn.addEventListener('click', () => {
        this.language = this.language === 'hi' ? 'en' : 'hi';
        localStorage.setItem('ensure_ai_lang', this.language);
        this.updateLangUi();
        this.renderSuggestionPills();
        const notification = this.language === 'hi'
          ? 'भाषा बदलकर हिंदी (Hindi) कर दी गई है। आप हिंदी में बोल या लिख सकते हैं!'
          : 'Language switched to English. You can speak or type in English or Hindi!';
        this.appendMessage('bot', notification);
      });

      // Settings Modal Toggle
      const settingsToggle = document.getElementById('ensure-ai-settings-toggle');
      const settingsModal = document.getElementById('ensure-ai-settings-modal');
      const settingsCancel = document.getElementById('ensure-ai-settings-cancel');
      const settingsSave = document.getElementById('ensure-ai-settings-save');
      const groqKeyInput = document.getElementById('ensure-ai-groq-key-input');

      settingsToggle.addEventListener('click', () => {
        const isActive = settingsModal.classList.toggle('active');
        if (isActive) {
          groqKeyInput.value = localStorage.getItem('ensure_ai_groq_key') || '';
          groqKeyInput.focus();
        }
      });

      settingsCancel.addEventListener('click', () => {
        settingsModal.classList.remove('active');
      });

      settingsSave.addEventListener('click', async () => {
        const key = groqKeyInput.value.trim();
        if (!key) {
          localStorage.removeItem('ensure_ai_groq_key');
          this.hasGroqKey = false;
          this.updateEngineBadge();
          settingsModal.classList.remove('active');
          this.appendMessage('bot', 'Switched to internal verified knowledge base mode.');
          return;
        }

        try {
          const res = await fetch('/api/v1/ai/save-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey: key })
          });
          if (res.ok) {
            localStorage.setItem('ensure_ai_groq_key', key);
            this.hasGroqKey = true;
            this.updateEngineBadge();
            settingsModal.classList.remove('active');
            this.appendMessage('bot', '✅ **Groq API Key verified and activated!** Ensure AI is now powered by high-speed Llama 3.3 70B.');
          } else {
            alert('Could not save Groq API key.');
          }
        } catch (e) {
          localStorage.setItem('ensure_ai_groq_key', key);
          this.hasGroqKey = true;
          this.updateEngineBadge();
          settingsModal.classList.remove('active');
          this.appendMessage('bot', 'Key saved locally. Connected to Groq AI.');
        }
      });

      this.updateVoiceToggleUi();
      this.updateLangUi();
    }

    toggleWidget(forceState = null) {
      this.isOpen = (forceState !== null) ? forceState : !this.isOpen;
      const widget = document.getElementById('ensure-ai-widget');
      const launcher = document.getElementById('ensure-ai-launcher');

      if (this.isOpen) {
        widget.classList.remove('hidden');
        launcher.style.display = 'none';
        const input = document.getElementById('ensure-ai-input');
        if (input) setTimeout(() => input.focus(), 150);
      } else {
        widget.classList.add('hidden');
        launcher.style.display = 'flex';
        this.stopRecording();
        this.stopSpeaking();
      }
    }

    updateVoiceToggleUi() {
      const text = document.getElementById('ensure-ai-voice-status-text');
      const icon = document.getElementById('ensure-ai-speaker-icon');
      if (text) {
        text.textContent = `Voice Playback: ${this.isVoiceEnabled ? 'ON' : 'OFF'}`;
      }
      if (icon) {
        icon.style.opacity = this.isVoiceEnabled ? '1' : '0.4';
      }
    }

    updateLangUi() {
      const text = document.getElementById('ensure-ai-lang-text');
      if (text) {
        text.textContent = this.language === 'hi' ? '🇮🇳 हिंदी' : '🌐 EN / हिंदी';
      }
    }

    appendMessage(role, content) {
      const container = document.getElementById('ensure-ai-messages');
      if (!container) return;

      const isBot = role === 'bot';
      const safeContent = isBot ? this.enforceFemaleGrammar(content) : content;
      const msgDiv = document.createElement('div');
      msgDiv.className = `ensure-ai-msg ${role}`;

      const avatarHtml = isBot
        ? `<div class="ensure-ai-msg-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18 2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13zm9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"></path></svg>
           </div>`
        : `<div class="ensure-ai-msg-avatar" style="background:#713600; color:#FFFEEB;">U</div>`;

      // Format markdown-like text
      const formatted = this.formatMarkdown(safeContent);

      let actionsHtml = '';
      if (isBot) {
        actionsHtml = `
          <div class="ensure-ai-msg-actions">
            <button class="ensure-ai-action-btn speak-btn" title="Listen to this response aloud">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              <span>Listen</span>
            </button>
            <button class="ensure-ai-action-btn copy-btn" title="Copy text">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Copy</span>
            </button>
          </div>
        `;
      }

      msgDiv.innerHTML = `
        ${avatarHtml}
        <div class="ensure-ai-msg-content">
          ${formatted}
          ${actionsHtml}
        </div>
      `;

      container.appendChild(msgDiv);
      container.scrollTop = container.scrollHeight;

      if (isBot) {
        const speakBtn = msgDiv.querySelector('.speak-btn');
        if (speakBtn) {
          speakBtn.addEventListener('click', () => {
            if (speakBtn.classList.contains('speaking')) {
              this.stopSpeaking();
            } else {
              this.speakText(content, speakBtn);
            }
          });
        }

        const copyBtn = msgDiv.querySelector('.copy-btn');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(content).then(() => {
              copyBtn.querySelector('span').textContent = 'Copied!';
              setTimeout(() => { copyBtn.querySelector('span').textContent = 'Copy'; }, 2000);
            });
          });
        }
      }
    }

    formatMarkdown(text) {
      if (!text) return '';

      // 1. Preserve <br> tags across escaping
      let safe = text.replace(/<br\s*\/?>/gi, '___BR_TAG___');

      // 2. Escape standard HTML entities
      let html = safe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // 3. Restore <br> as clean valid HTML line breaks
      html = html.replace(/___BR_TAG___/g, '<br>');

      // 4. Bold **text**
      html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // 5. Parse lines, tables, and lists
      const lines = html.split('\n');
      const formattedLines = [];
      let inList = false;
      let inTable = false;
      let tableRows = [];

      const flushTable = () => {
        if (!inTable || tableRows.length === 0) return;
        let tableHtml = '<div class="ensure-ai-table-wrap"><table class="ensure-ai-table">';
        tableRows.forEach((row, idx) => {
          // Skip markdown divider rows like |---|---|
          if (/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(row)) return;

          const cells = row.split('|')
            .map(c => c.trim())
            .filter((c, i, arr) => !(i === 0 && c === '') && !(i === arr.length - 1 && c === ''));

          if (cells.length > 0) {
            const isHeader = idx === 0 && tableRows.length > 1 && /^\|?(\s*:?-+:?\s*\|)+/.test(tableRows[1] || '');
            const tag = isHeader ? 'th' : 'td';
            tableHtml += '<tr>' + cells.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
          }
        });
        tableHtml += '</table></div>';
        formattedLines.push(tableHtml);
        inTable = false;
        tableRows = [];
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Check for table row
        if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
          if (inList) {
            formattedLines.push(formattedLines[formattedLines.length - 1].startsWith('<ol') ? '</ol>' : '</ul>');
            inList = false;
          }
          inTable = true;
          tableRows.push(trimmed);
          continue;
        } else if (inTable) {
          flushTable();
        }

        // Bullet points
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          if (!inList) {
            formattedLines.push('<ul>');
            inList = true;
          }
          formattedLines.push(`<li>${trimmed.substring(2)}</li>`);
        } else if (/^\d+\.\s/.test(trimmed)) {
          if (!inList) {
            formattedLines.push('<ol>');
            inList = true;
          }
          const content = trimmed.replace(/^\d+\.\s/, '');
          formattedLines.push(`<li>${content}</li>`);
        } else {
          if (inList) {
            formattedLines.push(formattedLines[formattedLines.length - 1].startsWith('<ol') ? '</ol>' : '</ul>');
            inList = false;
          }
          if (trimmed) {
            formattedLines.push(`<p>${line}</p>`);
          }
        }
      }

      if (inTable) flushTable();
      if (inList) formattedLines.push('</ul>');

      return formattedLines.join('');
    }

    showTypingIndicator() {
      const container = document.getElementById('ensure-ai-messages');
      if (!container) return null;

      const id = 'typing-' + Date.now();
      const div = document.createElement('div');
      div.id = id;
      div.className = 'ensure-ai-msg bot';
      div.innerHTML = `
        <div class="ensure-ai-msg-avatar">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 13A2.5 2.5 0 0 0 5 15.5 2.5 2.5 0 0 0 7.5 18 2.5 2.5 0 0 0 10 15.5 2.5 2.5 0 0 0 7.5 13zm9 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"></path></svg>
        </div>
        <div class="ensure-ai-msg-content" style="padding: 8px 12px;">
          <div class="ensure-ai-typing">
            <span class="ensure-ai-typing-dot"></span>
            <span class="ensure-ai-typing-dot"></span>
            <span class="ensure-ai-typing-dot"></span>
          </div>
        </div>
      `;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
      return id;
    }

    removeTypingIndicator(id) {
      if (!id) return;
      const el = document.getElementById(id);
      if (el) el.remove();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.ensureAi = new EnsureAiAssistant();
    });
  } else {
    window.ensureAi = new EnsureAiAssistant();
  }
})();
