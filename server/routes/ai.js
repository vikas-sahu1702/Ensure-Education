/**
 * ENSURE EDUCATION — AI ASSISTANT REST API ROUTE
 * High-speed bilingual (Hindi & English) AI Assistant powered by Groq (Llama 3.3 / Llama 3.1)
 * with zero-fail institutional fallback engine.
 */

const fs = require('node:fs');
const path = require('node:path');
const config = require('../config');

// In-memory key store that can be dynamically updated via UI or read from process.env
let dynamicGroqApiKey = process.env.GROQ_API_KEY || '';

const SYSTEM_PROMPT = `You are "Ensure AI", the official FEMALE AI voice and chat assistant (सहायिका) for "Ensure Education" (Student Education Protection Platform).

--- STRICT LANGUAGE & FEMALE PERSONA RULES (CRITICAL) ---
1. STRICT FEMALE IDENTITY & HINDI GRAMMAR:
   - Your speech synthesis voice in the browser is a FEMALE voice.
   - When generating Hindi or Hinglish text, you MUST ALWAYS identify as FEMALE and use STRICT FEMININE FIRST-PERSON GRAMMATICAL FORMS:
     * ALWAYS use: "कर सकती हूँ" (NEVER "कर सकता हूँ")
     * ALWAYS use: "समझा सकती हूँ" or "समझाती हूँ" (NEVER "समझाता हूँ" or "समझा सकता हूँ")
     * ALWAYS use: "बता सकती हूँ" or "बताती हूँ" (NEVER "बताता हूँ" or "बता दूंगा" or "बताऊंगा")
     * ALWAYS use: "करूँगी" or "रहूँगी" (NEVER "करूँगा" or "रहूँगा")
     * ALWAYS use: "सहायिका हूँ" (NEVER "सहायक हूँ")
     * Polite phrasing: "मैं Ensure AI हूँ, आपकी क्या सहायता कर सकती हूँ?"
     * In Hinglish: "kar sakti hun", "bata sakti hun", "help kar sakti hun" (NEVER "kar sakta hun")
     * NEVER use masculine self-referencing verbs like "सकता हूँ", "सकता हूं", "बताता हूँ", "बताऊंगा", or "करूँगा".

2. STRICT LANGUAGE MATCHING:
   - If the user speaks or writes in ENGLISH (e.g., "hello", "hi", "how are you", "what documents do I need?"):
     * You MUST reply 100% IN ENGLISH.
     * Do NOT start with "Namaste" and do NOT include Hindi phrases or Devanagari text when the user communicates in English.
   - If the user speaks or writes in HINDI or HINGLISH (e.g., "नमस्ते", "कागज़ क्या चाहिए", "kaun se documents lagenge", "namaste"):
     * Reply in natural, friendly Hindi or Hinglish using feminine grammar.

3. CONCISENESS & BREVITY:
   - Keep answers direct, concise, and helpful.
   - For simple greetings like "hello" or "hi", reply in 1-2 friendly sentences without giving a long speech.

4. VOICE-FRIENDLY FORMAT:
   - Minimize emoji usage so text-to-speech sounds clean and natural.

5. CLEAN LIST FORMATTING (NO RAW HTML OR PIPE TABLES):
   - NEVER output raw HTML tags like "<br>", "<hr>", or "<div>".
   - DO NOT use ASCII markdown pipe tables (| Column 1 | Column 2 |). Instead, format all document checklists, terms, and explanations using clean bullet points (•), numbered steps, and bold headings (**Heading**). Bullet lists fit mobile chat screens much better and sound much more natural when spoken by the voice assistant.

--- INSTITUTIONAL PLATFORM SPECIFICATIONS & RULES ---
1. SCHEME PURPOSE:
   - Ensure Education is an institutional digital platform that financially protects a student's education if their registered fee payer (parent or guardian) passes away during the course duration.
   - It pays the student's remaining semester tuition fees directly to the partner college so the student's degree is never interrupted.

2. REQUIRED DOCUMENTS FOR REGISTRATION:
   - For Student: Official College Student ID Card OR Official College Admission Fee Receipt (from partner college).
   - For Fee Payer: Valid Government Photo ID (Aadhaar Card, PAN Card, Passport, or Voter ID).
   - CRITICAL INCOME PROOF RULES:
     * If Fee Payer is FATHER or MOTHER: Income proof is NOT required (100% Exempted).
     * If Fee Payer is ANY OTHER FAMILY MEMBER (Uncle, Grandparent, Guardian, etc.): Official Income Proof IS STRICTLY REQUIRED (Latest Salary Slip, Form 16, or ITR).

3. KEY TERMS AND CONDITIONS:
   - Fee Payer Age Limit: Fee payer must NOT exceed 55 years of age on registration date (strictly age 18 to 55). Age > 55 is rejected.
   - Student Scheme Premium: Exactly 1.0% of total course tuition fee (one-time payment).
     * Example: ₹3,00,000 fee = ₹3,00,000 * 1% = ₹3,000 one-time premium.
     * Example: ₹4,80,000 fee = ₹4,80,000 * 1% = ₹4,800 one-time premium.
   - Partner College Incentive: Configurable 5.0% institutional promotional incentive paid to partner colleges (funded institutionally; never charged to students).
   - Bereavement Protection Claim: If fee payer passes away, claim is lodged with death certificate. Admin adjudicates within 3 business days for direct fee settlement to the college.
   - Security: Mandatory Two-Step Authentication (2FA) via 6-digit OTP.`;

/**
 * Enforces strictly feminine Hindi and Hinglish grammar to match the female browser TTS voice.
 */
function enforceFemaleGrammar(text) {
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

/**
 * Intelligent Rule-Based Local Fallback Engine (Active when Groq key is absent or offline)
 */
function generateLocalKnowledgeResponse(userMessage, language = 'auto') {
  const trimmed = (userMessage || '').trim();
  const q = trimmed.toLowerCase();

  // Strict Greeting handlers (Short, non-repetitive)
  if (/^(hello|hi|hey|good morning|good afternoon|good evening)[!.\s]*$/i.test(trimmed)) {
    return "Hello! How can I assist you with Ensure Education's registration documents or scheme terms today?";
  }
  if (/^(namaste|namaskar|pranam|नमस्ते|नमस्कार)[!.\s]*$/i.test(trimmed)) {
    return "नमस्ते! मैं Ensure Education के रजिस्ट्रेशन दस्तावेज़ों या योजना के नियमों में आपकी क्या सहायता कर सकती हूँ?";
  }

  const isHindi = language === 'hi' ||
    /[\u0900-\u097F]/.test(userMessage) ||
    /\b(kaun|kya|chahiye|dastavej|kagaz|niyam|sharte|umar|aayu|paisa|kitna|kaise|batao|kripya|namaste)\b/i.test(q);

  // 1. Documents Required
  if (/(document|doc|dastavej|kagaz|proof|certificate|दस्तावेज़|दस्तावेज|कागज़|कागज|प्रमाण|प्रमाणपत्र)/i.test(userMessage)) {
    if (isHindi) {
      return `📋 **Ensure Education पंजीकरण के लिए आवश्यक दस्तावेज़:**

1. **छात्र के लिए (Student Documents):**
   • कॉलेज आईडी कार्ड (College Student ID Card) **या**
   • आधिकारिक कॉलेज फीस रसीद (Official College Fee Receipt).

2. **फीस जमाकर्ता/अभिभावक के लिए (Fee Payer Documents):**
   • सरकारी फोटो पहचान पत्र (आधार कार्ड, पैन कार्ड, पासपोर्ट या वोटर आईडी).

3. **आय प्रमाण नियम (Income Proof Rules - अत्यंत महत्वपूर्ण):**
   • **माता या पिता (Father/Mother):** आय प्रमाण की **बिल्कुल आवश्यकता नहीं है** (100% Exempted).
   • **अन्य रिश्तेदार (चाचा, दादा, भाई, अभिभावक आदि):** आधिकारिक आय प्रमाण (वेतन पर्ची / Form 16 / ITR) **अनिवार्य है**.

क्या आप 1% प्रीमियम या 55 वर्ष की आयु सीमा के बारे में भी जानना चाहते हैं?`;
    } else {
      return `📋 **Documents Required for Ensure Education Registration:**

1. **For the Student:**
   • Valid College Student ID Card **OR**
   • Official College Admission Fee Receipt (from partner college).

2. **For the Registered Fee Payer:**
   • Government Photo ID (Aadhaar Card, PAN Card, Passport, or Voter ID).

3. **Income Proof Rules (Critical Distinction):**
   • **Father or Mother:** Income proof is **NOT required** (100% Exempt).
   • **Other Eligible Family Members (Uncle, Grandparent, Guardian, etc.):** Income proof **IS MANDATORY** (Salary Slip, Form 16, or ITR).

Would you like me to calculate your 1% scheme premium or explain fee payer age eligibility?`;
    }
  }

  // 2. Terms and Conditions
  if (/(term|condition|rule|niyam|shart|policy|नियम|शर्त|शर्तें|पॉलिसी)/i.test(userMessage)) {
    if (isHindi) {
      return `📜 **Ensure Education के मुख्य नियम एवं शर्तें (Terms & Conditions):**

1. **1.0% छात्र प्रीमियम (Student Premium):** छात्र को कुल कोर्स फीस का केवल 1% एकमुश्त प्रीमियम देना होता है (जैसे ₹3,00,000 फीस पर मात्र ₹3,000).
2. **आयु सीमा (Age Limit - सख्त नियम):** फीस जमाकर्ता की आयु पंजीकरण की तारीख पर **55 वर्ष से अधिक नहीं** होनी चाहिए (आयु 18 से 55 वर्ष). 55 से अधिक आयु अमान्य है.
3. **सुरक्षा कवरेज (Coverage Scope):** कोर्स के दौरान पंजीकृत फीस जमाकर्ता का निधन होने पर बची हुई पूरी कॉलेज ट्यूशन फीस Ensure Education सीधे कॉलेज को चुकाता है.
4. **कॉलेज प्रोत्साहन (5% College Incentive):** पार्टनर कॉलेजों को 5% प्रोत्साहन राशि संस्थागत रूप से दी जाती है (छात्र से कभी कोई अतिरिक्त शुल्क नहीं लिया जाता).
5. **दावा निपटान (Claim Adjudication):** मृत्यु प्रमाण पत्र जमा करने पर 3 कार्य दिवसों के भीतर समीक्षा कर कॉलेज फीस स्वीकृत की जाती है.
6. **2FA सुरक्षा:** सभी लॉगिन और पंजीकरण 6-अंकों के OTP से सुरक्षित हैं.`;
    } else {
      return `📜 **Ensure Education Core Terms and Conditions:**

1. **1.0% Dynamic Student Premium:** Exactly 1% of total course tuition fee paid once (e.g., ₹3,00,000 course fee = ₹3,000 premium).
2. **Fee Payer Age Limit (Strict Rule):** Fee payer must **NOT exceed 55 years of age** on the date of registration (Age 18 - 55). Age > 55 is rejected.
3. **Comprehensive Coverage Scope:** If the registered fee payer passes away during the course, Ensure Education covers remaining course fees paid directly to the partner college.
4. **Institutional College Incentive (5%):** Partner colleges receive a 5.0% promotional incentive funded institutionally (NEVER charged to students).
5. **Bereavement Claims Process:** Official municipal death certificate is submitted; Platform Admin adjudicates claim within 3 business days for direct fee settlement.
6. **Two-Factor Authentication (2FA):** Mandatory 6-digit OTP verification for secure access.`;
    }
  }

  // 3. Premium / Fees / Calculator
  if (/(premium|fee|cost|kitna|calculate|1%|paisa|प्रीमियम|फीस|खर्च|पैसा|रुपए|गणना)/i.test(userMessage)) {
    if (isHindi) {
      return `💰 **Ensure Education 1% प्रीमियम गणना:**

• छात्र को कुल कोर्स फीस का **सटीक 1.0%** एकमुश्त प्रीमियम देना होता है.
• **उदाहरण 1:** ₹3,00,000 कोर्स फीस = **₹3,000** एकमुश्त प्रीमियम.
• **उदाहरण 2:** ₹4,80,000 कोर्स फीस = **₹4,800** एकमुश्त प्रीमियम.
• पार्टनर कॉलेज को 5% संस्थागत इंसेंटिव मिलता है जो संस्था की ओर से दिया जाता है, छात्र से नहीं!

अपनी कोर्स फीस बताएं, मैं तुरंत आपका सटीक प्रीमियम बता सकती हूँ!`;
    } else {
      return `💰 **Ensure Education 1.0% Premium Calculation:**

• Students pay a one-time scheme premium of **exactly 1.0%** of their total course fee.
• **Example 1:** ₹3,00,000 Course Fee ➔ **₹3,000** one-time premium.
• **Example 2:** ₹4,80,000 Course Fee ➔ **₹4,800** one-time premium.
• Partner colleges receive a 5% incentive funded institutionally, never charged to students.

Enter your course fee to calculate the exact protection amount!`;
    }
  }

  // 4. Age limit / Eligibility
  if (/(age|umar|55|eligible|eligibility|patrata|उम्र|आयु|पात्रता|सीमा)/i.test(userMessage)) {
    if (isHindi) {
      return `🛡️ **फीस जमाकर्ता आयु सीमा और पात्रता:**

• **अधिकतम आयु सीमा:** फीस जमाकर्ता की आयु पंजीकरण की तारीख पर **55 वर्ष या उससे कम** होनी चाहिए.
• यदि आयु 55 वर्ष से अधिक है (56 वर्ष या उससे ज्यादा), तो सिस्टम आवेदन अस्वीकार (Reject) कर देगा.
• फीस जमाकर्ता की न्यूनतम आयु 18 वर्ष होनी चाहिए.
• **रिश्ता:** माता, पिता, या अन्य निकट सम्बन्धी/अभिभावक. (माता/पिता के लिए आय प्रमाण नहीं चाहिए).`;
    } else {
      return `🛡️ **Fee Payer Eligibility & Age Limit:**

• **Maximum Permitted Age:** The registered fee payer must **NOT exceed 55 years of age** on the date of registration (Age <= 55).
• Any fee payer aged 56 or older is strictly rejected under platform underwriting rules.
• Minimum age is 18 years.
• **Relationship:** Father, Mother, or other eligible family members/guardians (Father/Mother exempt from income proof).`;
    }
  }

  // 5. Bereavement Claim
  if (/(claim|demise|death|bereavement|निधन|मृत्यु|दावा|क्लेम)/i.test(userMessage)) {
    if (isHindi) {
      return `⚖️ **Ensure Education दावा (Claim) निपटान प्रक्रिया:**

1. **दावा दर्ज़ करना (Lodge Claim):** पंजीकृत फीस जमाकर्ता के असामयिक निधन की स्थिति में, छात्र या कॉलेज आधिकारिक मृत्यु प्रमाण पत्र (Death Certificate) के साथ दावा दर्ज़ करते हैं.
2. **समीक्षा (Adjudication):** प्लेटफॉर्म एडमिनिस्ट्रेटर 3 कार्य दिवसों के भीतर नगरपालिका रिकॉर्ड और कॉलेज की शेष फीस का सत्यापन करते हैं.
3. **सीधा भुगतान (Direct Settlement):** अनुमोदन के बाद, बची हुई सेमेस्टर फीस सीधे पार्टनर कॉलेज को हस्तांतरित कर दी जाती है ताकि छात्र की पढ़ाई निर्बाध चलती रहे.`;
    } else {
      return `⚖️ **Ensure Education Bereavement Claim Process:**

1. **Lodge Claim:** In the event of the registered fee payer's demise, the student or partner college lodges a claim along with the municipal death certificate.
2. **Verification & Adjudication:** The Platform Administrator verifies records and remaining college dues within 3 business days.
3. **Direct College Settlement:** Once approved, remaining course tuition fees are disbursed directly to the partner college to ensure the student completes their education without financial worry.`;
    }
  }

  // 5. General Greeting or Overview
  if (isHindi) {
    return `नमस्ते! 🙏 मैं **Ensure AI** हूँ — Ensure Education की वॉयस एवं चैट सहायिका।

मैं आपकी इन विषयों में सहायता कर सकती हूँ:
1. 📋 **पंजीकरण के लिए आवश्यक दस्तावेज़** (माता-पिता के लिए कोई आय प्रमाण नहीं, अन्य के लिए आवश्यक).
2. 📜 **नियम और शर्तें** (55 वर्ष की आयु सीमा, 1% छात्र प्रीमियम, 5% कॉलेज प्रोत्साहन).
3. 💰 **1% प्रीमियम गणना** एवं सुरक्षा कवरेज.
4. ⚖️ **दावा (Claim) निपटान प्रक्रिया**.

आप मुझसे बोलकर (माइक द्वारा) या लिखकर कोई भी प्रश्न हिंदी या अंग्रेजी में पूछ सकते हैं!`;
  } else {
    return `Hello! 👋 I am **Ensure AI**, your intelligent voice and chat assistant for Ensure Education.

I can assist you with:
1. 📋 **Required Documents for Registration** (No income proof for parents; mandatory for other relatives).
2. 📜 **Platform Terms & Conditions** (Strict <= 55 fee payer age limit, 1% premium, 5% college incentive).
3. 💰 **1.0% Scheme Premium Calculation** for your tuition.
4. ⚖️ **Bereavement Claims Process** & Education Protection.

Feel free to ask by typing or speaking in English or Hindi!`;
  }
}

/**
 * Handle POST /api/v1/ai/chat
 */
async function handleAiChat(req, res, body) {
  const { message, conversation = [], language = 'auto', customApiKey = '' } = body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'A valid message prompt is required.' }));
    return;
  }

  const effectiveApiKey = (customApiKey || req.headers['x-groq-api-key'] || dynamicGroqApiKey || process.env.GROQ_API_KEY || '').trim();
  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';

  // If no Groq API Key is present, return the immediate local knowledge base response
  if (!effectiveApiKey) {
    const reply = enforceFemaleGrammar(generateLocalKnowledgeResponse(message, language));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      provider: 'local-knowledge-engine',
      model: 'EnsureEducation-Bilingual-Expert',
      message: reply,
      hasGroqKey: false,
      note: 'Operating on institutional knowledge base. Provide a Groq API key in Settings or .env for full generative AI.'
    }));
    return;
  }

  // Call Groq API with OpenAI compatible completions
  try {
    const messagesPayload = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Include recent conversation turns for context (up to last 6 messages)
    if (Array.isArray(conversation) && conversation.length > 0) {
      const recent = conversation.slice(-6);
      for (const turn of recent) {
        if (turn.role && turn.content) {
          messagesPayload.push({
            role: turn.role === 'user' ? 'user' : 'assistant',
            content: String(turn.content).slice(0, 1000)
          });
        }
      }
    }

    messagesPayload.push({ role: 'user', content: message });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messagesPayload,
        temperature: 0.3,
        max_tokens: 400
      }),
      signal: AbortSignal.timeout(12000)
    });

    if (!groqRes.ok) {
      const errorText = await groqRes.text();
      console.warn('Groq API returned error status:', groqRes.status, errorText);
      // Fallback gracefully on Groq API error
      const fallbackReply = enforceFemaleGrammar(generateLocalKnowledgeResponse(message, language));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        provider: 'fallback-after-groq-error',
        model: 'EnsureEducation-Bilingual-Expert',
        message: fallbackReply,
        groqStatus: groqRes.status,
        warning: `Groq error (${groqRes.status}). Served via verified institutional knowledge base.`
      }));
      return;
    }

    const groqData = await groqRes.json();
    let assistantReply = groqData?.choices?.[0]?.message?.content || generateLocalKnowledgeResponse(message, language);
    assistantReply = enforceFemaleGrammar(assistantReply);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      provider: 'groq',
      model: model,
      message: assistantReply,
      hasGroqKey: true,
      usage: groqData.usage || null
    }));
  } catch (err) {
    console.error('Groq connection error:', err.message);
    const fallbackReply = enforceFemaleGrammar(generateLocalKnowledgeResponse(message, language));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      provider: 'local-knowledge-engine',
      model: 'EnsureEducation-Bilingual-Expert',
      message: fallbackReply,
      hasGroqKey: true,
      warning: `Network timeout connecting to Groq. Served via verified institutional knowledge engine.`
    }));
  }
}

/**
 * Handle GET /api/v1/ai/status
 */
function handleAiStatus(req, res) {
  const currentKey = (dynamicGroqApiKey || process.env.GROQ_API_KEY || '').trim();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    hasGroqKey: currentKey.length > 5,
    keyMasked: currentKey ? `${currentKey.slice(0, 4)}...${currentKey.slice(-4)}` : null,
    model: process.env.GROQ_MODEL || 'qwen/qwen3.8-27b',
    supportedLanguages: ['en', 'hi', 'hinglish'],
    capabilities: [
      'Document requirements for student & fee payer',
      'Terms & conditions explanation',
      'Dynamic 1% student premium calculator',
      'Age limit (strictly <= 55) eligibility verification',
      'Income proof waiver for father/mother',
      'Speech-to-text voice recognition',
      'Voice synthesis audio playback'
    ]
  }));
}

/**
 * Handle POST /api/v1/ai/save-key (Allows setting the Groq API key dynamically)
 */
async function handleAiSaveKey(req, res, body) {
  const key = (body.apiKey || '').trim();
  if (!key) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'Groq API Key is required.' }));
    return;
  }

  dynamicGroqApiKey = key;
  process.env.GROQ_API_KEY = key;

  // Persist to .env file if writable
  try {
    const envPath = path.resolve(__dirname, '../../.env');
    if (fs.existsSync(envPath)) {
      let content = fs.readFileSync(envPath, 'utf8');
      if (content.includes('GROQ_API_KEY=')) {
        content = content.replace(/GROQ_API_KEY=.*(\r?\n|$)/, `GROQ_API_KEY=${key}\n`);
      } else {
        content += `\nGROQ_API_KEY=${key}\nGROQ_MODEL=llama-3.3-70b-versatile\n`;
      }
      fs.writeFileSync(envPath, content, 'utf8');
    }
  } catch (err) {
    console.warn('Could not write GROQ_API_KEY to .env file:', err.message);
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: true,
    message: 'Groq API Key successfully registered and activated.',
    keyMasked: `${key.slice(0, 4)}...${key.slice(-4)}`
  }));
}

module.exports = {
  handleAiChat,
  handleAiStatus,
  handleAiSaveKey
};
