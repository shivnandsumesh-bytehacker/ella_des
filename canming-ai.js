/* ==========================================================================
   CAN MING AI (v3.0 Ultra) - Autonomous Multimodal Assistant
   Engine: Google Gemini Multimodal REST Bridge (Flash / Pro)
   Features: Full Vision OCR, Multi-Turn Memory, Markdown Parser, Secure Vault
   ========================================================================== */

(function () {
    // Default fallback model
    const DEFAULT_MODEL = "gemini-1.5-flash";

    // --- 1. Inject Comprehensive Visual System Styles ---
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --cm-cyan: #00f3ff;
            --cm-magenta: #ff007f;
            --cm-gold: #facc15;
            --cm-emerald: #10b981;
            --cm-ruby: #ef4444;
            --cm-bg: rgba(7, 11, 22, 0.96);
            --cm-surface: #0f172a;
            --cm-surface-light: #1e293b;
            --cm-border: rgba(0, 243, 255, 0.28);
            --cm-text: #f8fafc;
            --cm-muted: #94a3b8;
        }

        #cm-floating-trigger {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: linear-gradient(135deg, var(--cm-cyan), var(--cm-magenta));
            color: #030712;
            border: none;
            border-radius: 9999px;
            padding: 13px 24px;
            font-size: 0.95rem;
            font-weight: 900;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
            cursor: pointer;
            box-shadow: 0 0 25px rgba(0, 243, 255, 0.45);
            z-index: 100000;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        #cm-floating-trigger:hover {
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 0 35px rgba(255, 0, 127, 0.65);
        }

        #cm-chat-container {
            position: fixed;
            bottom: 82px;
            right: 24px;
            width: 440px;
            max-width: calc(100vw - 32px);
            height: 640px;
            max-height: calc(100vh - 110px);
            background: var(--cm-bg);
            border: 1.5px solid var(--cm-border);
            border-radius: 20px;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 243, 255, 0.15);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 100000;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: var(--cm-text);
        }

        /* Header */
        .cm-header {
            background: rgba(15, 23, 42, 0.92);
            padding: 14px 18px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cm-brand-cluster {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .cm-live-pulse {
            width: 9px;
            height: 9px;
            background: var(--cm-cyan);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--cm-cyan);
            animation: cmPulseDot 2s infinite ease-in-out;
        }
        @keyframes cmPulseDot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
        }
        .cm-title-text {
            font-size: 1rem;
            font-weight: 800;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .cm-pill {
            font-size: 0.62rem;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid var(--cm-cyan);
            color: var(--cm-cyan);
            text-transform: uppercase;
        }
        .cm-header-tools {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .cm-tool-btn {
            background: transparent;
            border: none;
            color: var(--cm-muted);
            font-size: 1.15rem;
            cursor: pointer;
            padding: 6px;
            border-radius: 8px;
            transition: color 0.15s, background 0.15s;
        }
        .cm-tool-btn:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.08);
        }

        /* Message Thread */
        .cm-thread-view {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
            font-size: 0.88rem;
            scroll-behavior: smooth;
        }
        .cm-thread-view::-webkit-scrollbar { width: 5px; }
        .cm-thread-view::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }

        .cm-bubble {
            padding: 12px 16px;
            border-radius: 14px;
            max-width: 88%;
            line-height: 1.5;
            word-wrap: break-word;
        }
        .cm-bubble.bot {
            background: var(--cm-surface);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-left: 3px solid var(--cm-cyan);
            align-self: flex-start;
            color: #e2e8f0;
        }
        .cm-bubble.user {
            background: linear-gradient(135deg, #0284c7, #2563eb);
            color: #ffffff;
            align-self: flex-end;
            box-shadow: 0 4px 15px rgba(2, 132, 199, 0.25);
        }
        .cm-bubble img.attached-preview {
            max-width: 100%;
            border-radius: 8px;
            margin-top: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        /* Markdown Rendering Components */
        .cm-bubble p { margin: 0 0 8px 0; }
        .cm-bubble p:last-child { margin: 0; }
        .cm-bubble strong { color: var(--cm-cyan); font-weight: 700; }
        .cm-bubble code.inline-code {
            background: rgba(0, 0, 0, 0.45);
            color: var(--cm-gold);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.84rem;
        }
        .cm-code-block-wrapper {
            position: relative;
            background: #020617;
            border: 1px solid #1e293b;
            border-radius: 8px;
            margin: 10px 0;
            overflow: hidden;
        }
        .cm-code-block-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 12px;
            background: #0f172a;
            border-bottom: 1px solid #1e293b;
            font-family: monospace;
            font-size: 0.72rem;
            color: var(--cm-muted);
        }
        .cm-copy-btn {
            background: none;
            border: none;
            color: var(--cm-cyan);
            cursor: pointer;
            font-size: 0.72rem;
            font-weight: 700;
        }
        .cm-code-block-wrapper pre {
            margin: 0;
            padding: 10px 14px;
            overflow-x: auto;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.82rem;
            color: #38bdf8;
            line-height: 1.4;
        }
        .cm-bubble ul, .cm-bubble ol {
            margin: 6px 0 8px 18px;
            padding: 0;
        }
        .cm-bubble li { margin-bottom: 4px; }
        .cm-bubble blockquote {
            border-left: 3px solid var(--cm-gold);
            margin: 8px 0;
            padding-left: 10px;
            color: var(--cm-muted);
        }

        /* Image Attachment Bar */
        .cm-upload-buffer {
            display: none;
            padding: 8px 16px;
            background: rgba(15, 23, 42, 0.95);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            align-items: center;
            justify-content: space-between;
            font-size: 0.78rem;
            color: var(--cm-gold);
        }
        .cm-upload-thumbnail-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .cm-upload-thumbnail {
            width: 34px;
            height: 34px;
            border-radius: 6px;
            object-fit: cover;
            border: 1px solid var(--cm-gold);
        }

        /* Input Controls */
        .cm-input-control {
            padding: 12px 14px;
            background: rgba(15, 23, 42, 0.95);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .cm-action-icon {
            background: transparent;
            border: none;
            color: var(--cm-muted);
            font-size: 1.25rem;
            cursor: pointer;
            padding: 6px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.15s;
        }
        .cm-action-icon:hover { color: var(--cm-cyan); }
        .cm-textarea-input {
            flex: 1;
            background: #090d1a;
            border: 1px solid #1e293b;
            color: #fff;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 0.88rem;
            outline: none;
            resize: none;
            height: 42px;
            max-height: 120px;
            line-height: 1.4;
            font-family: inherit;
            transition: border-color 0.15s;
        }
        .cm-textarea-input:focus { border-color: var(--cm-cyan); }
        .cm-send-action-btn {
            background: var(--cm-cyan);
            color: #030712;
            border: none;
            border-radius: 10px;
            padding: 10px 16px;
            font-weight: 800;
            font-size: 0.85rem;
            cursor: pointer;
            transition: transform 0.08s, filter 0.15s;
        }
        .cm-send-action-btn:hover { filter: brightness(1.15); }
        .cm-send-action-btn:active { transform: scale(0.96); }

        /* Settings Vault Modal */
        #cm-settings-modal {
            position: absolute;
            inset: 0;
            background: rgba(3, 7, 18, 0.95);
            display: none;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 24px;
            z-index: 100010;
        }
        .cm-vault-card {
            background: var(--cm-surface);
            border: 1.5px solid var(--cm-border);
            border-radius: 16px;
            padding: 22px;
            width: 100%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .cm-vault-title {
            margin: 0 0 6px 0;
            font-size: 1.1rem;
            color: var(--cm-cyan);
            font-weight: 800;
        }
        .cm-vault-desc {
            font-size: 0.78rem;
            color: var(--cm-muted);
            margin: 0 0 16px 0;
            line-height: 1.4;
        }
        .cm-vault-field {
            margin-bottom: 12px;
            text-align: left;
        }
        .cm-vault-label {
            display: block;
            font-size: 0.74rem;
            font-weight: 700;
            color: #cbd5e1;
            margin-bottom: 4px;
        }
        .cm-vault-input {
            width: 100%;
            background: #020617;
            border: 1px solid #334155;
            color: #fff;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 0.84rem;
            box-sizing: border-box;
            outline: none;
        }
        .cm-vault-input:focus { border-color: var(--cm-cyan); }
        .cm-vault-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 18px;
        }

        /* Typing Dots */
        .cm-loader {
            display: flex;
            gap: 5px;
            padding: 6px 4px;
            align-items: center;
        }
        .cm-dot {
            width: 6px;
            height: 6px;
            background: var(--cm-cyan);
            border-radius: 50%;
            animation: cmWave 1.2s infinite ease-in-out;
        }
        .cm-dot:nth-child(2) { animation-delay: 0.2s; }
        .cm-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes cmWave {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-5px); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // --- 2. Build DOM Component Hierarchy ---
    const container = document.createElement('div');
    container.innerHTML = `
        <button id="cm-floating-trigger">
            <span>✨</span> Can Ming AI
        </button>

        <div id="cm-chat-container">
            <!-- Header -->
            <div class="cm-header">
                <div class="cm-brand-cluster">
                    <div class="cm-live-pulse"></div>
                    <div class="cm-title-text">Can Ming <span class="cm-pill" id="cm-model-tag">FLASH 1.5</span></div>
                </div>
                <div class="cm-header-tools">
                    <button class="cm-tool-btn" id="cm-btn-vault" title="API Key Vault">⚙️</button>
                    <button class="cm-tool-btn" id="cm-btn-clear" title="Clear Thread">🗑️</button>
                    <button class="cm-tool-btn" id="cm-btn-close" title="Minimize Window">✕</button>
                </div>
            </div>

            <!-- Messages Thread -->
            <div class="cm-thread-view" id="cm-thread">
                <div class="cm-bubble bot">
                    Yo! I'm <strong>Can Ming AI</strong>. Send me any problem, code architecture, or attach a picture (math equations, homework, diagrams, bugs) and I'll break down the solution step-by-step.
                </div>
            </div>

            <!-- Buffer Preview Bar -->
            <div class="cm-upload-buffer" id="cm-upload-buffer">
                <div class="cm-upload-thumbnail-group">
                    <img id="cm-buffer-thumb" class="cm-upload-thumbnail" src="" alt="preview">
                    <span>Image Attached (Ready to Analyze)</span>
                </div>
                <button style="background:none; border:none; color:var(--cm-ruby); cursor:pointer; font-weight:bold;" id="cm-buffer-remove">✕</button>
            </div>

            <!-- Input Bar -->
            <div class="cm-input-control">
                <label class="cm-action-icon" title="Upload screenshot or photo for visual OCR">
                    📷
                    <input type="file" id="cm-file-input" accept="image/*" style="display:none;">
                </label>
                <textarea class="cm-textarea-input" id="cm-user-input" placeholder="Ask anything, solve equations, analyze photos..."></textarea>
                <button class="cm-send-action-btn" id="cm-btn-send">Send</button>
            </div>

            <!-- Secure Vault Configuration Modal -->
            <div id="cm-settings-modal">
                <div class="cm-vault-card">
                    <h3 class="cm-vault-title">AI Engine Settings</h3>
                    <p class="cm-vault-desc">
                        Provide a Google Gemini API Key. Keys are cached securely inside your browser's private local storage and are never uploaded to GitHub.
                    </p>
                    <div class="cm-vault-field">
                        <label class="cm-vault-label">Google Gemini API Key</label>
                        <input type="password" class="cm-vault-input" id="cm-vault-key" placeholder="AIzaSy...">
                    </div>
                    <div class="cm-vault-field">
                        <label class="cm-vault-label">Selected Model</label>
                        <select class="cm-vault-input" id="cm-vault-model">
                            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-Fast & Smart)</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Math & Vision)</option>
                        </select>
                    </div>
                    <div class="cm-vault-actions">
                        <button class="cm-tool-btn" id="cm-vault-cancel" style="padding:8px 14px; font-size:0.84rem;">Cancel</button>
                        <button class="cm-send-action-btn" id="cm-vault-save">Save & Connect</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // --- 3. Dynamic Parser (Markdown, Code Blocks & LaTeX Support) ---
    function parseAdvancedMarkdown(text) {
        let out = text;

        // Escape HTML tags to prevent cross-site injections
        out = out.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        // Code Blocks with Language Badges & Copy Buttons
        out = out.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, function (match, lang, code) {
            const language = lang || 'code';
            const cleanCode = code.trim();
            const id = 'code-' + Math.random().toString(36).substring(2, 9);
            return `
                <div class="cm-code-block-wrapper">
                    <div class="cm-code-block-header">
                        <span>${language.toUpperCase()}</span>
                        <button class="cm-copy-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(cleanCode)}'))">Copy Code</button>
                    </div>
                    <pre><code>${cleanCode}</code></pre>
                </div>
            `;
        });

        // LaTeX Equation Blocks: $$ x = \frac{-b \pm \sqrt{D}}{2a} $$
        out = out.replace(/\$\$([\s\S]*?)\$\$/g, '<div style="text-align:center; padding:6px 0; color:#facc15; font-family:monospace; font-size:0.95rem;">$1</div>');
        // Inline LaTeX: $E = mc^2$
        out = out.replace(/\$([^\$\n]+)\$/g, '<code class="inline-code">$1</code>');

        // Bold & Italic
        out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');
        out = out.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

        // Bullet Lists
        out = out.replace(/^\s*[\-\*]\s+(.*)$/gm, '<li>$1</li>');
        out = out.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');

        // Blockquotes
        out = out.replace(/^>\s+(.*)$/gm, '<blockquote>$1</blockquote>');

        // Paragraphs & Linebreaks
        out = out.replace(/\n\n+/g, '</p><p>');
        out = out.replace(/\n/g, '<br>');

        return `<p>${out}</p>`;
    }

    // --- 4. State & System Prompt Architecture ---
    let userApiKey = localStorage.getItem('cm_ai_key') || "";
    let activeModel = localStorage.getItem('cm_ai_model') || DEFAULT_MODEL;
    let attachedBase64 = null;
    let attachedMime = "image/jpeg";

    // Can Ming Core System Directive
    const SYSTEM_DIRECTIVE = `
You are "Can Ming AI", an elite AI collaborator, math solver, software engineer, and high-energy gaming peer embedded into a web arcade.
Key rules:
1. Tone: Authentic, clear, quick-witted, deeply technical yet approachable.
2. Independent Verification: If asked to verify a math calculation or logic puzzle, calculate step-by-step first before delivering your final verdict.
3. Multimodal: When presented with an image (geometry problems, calculus, code screenshots, handwritten work, circuit diagrams, or track designs), parse it with utmost precision, transcribe relevant formulas, and provide worked steps.
4. Formatting: Use structured elements (bullet points, LaTeX equations with $inline$ and $$display$$, code blocks with declared languages). Avoid verbose conversational preamble.
`.trim();

    // Multi-turn context conversation buffer
    const conversationHistory = [];

    // Element Selectors
    const chatContainer = document.getElementById('cm-chat-container');
    const triggerBtn = document.getElementById('cm-floating-trigger');
    const threadView = document.getElementById('cm-thread');
    const userInput = document.getElementById('cm-user-input');
    const sendBtn = document.getElementById('cm-btn-send');
    const fileInput = document.getElementById('cm-file-input');
    const bufferBar = document.getElementById('cm-upload-buffer');
    const bufferThumb = document.getElementById('cm-buffer-thumb');
    const bufferRemove = document.getElementById('cm-buffer-remove');
    const settingsModal = document.getElementById('cm-settings-modal');
    const vaultKeyInput = document.getElementById('cm-vault-key');
    const vaultModelInput = document.getElementById('cm-vault-model');
    const modelTag = document.getElementById('cm-model-tag');

    modelTag.innerText = activeModel.includes('pro') ? 'PRO 1.5' : 'FLASH 1.5';

    // --- 5. Window Interaction & Vault Logic ---
    triggerBtn.onclick = () => {
        const isHidden = chatContainer.style.display === 'none' || chatContainer.style.display === '';
        chatContainer.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) userInput.focus();
    };

    document.getElementById('cm-btn-close').onclick = () => {
        chatContainer.style.display = 'none';
    };

    document.getElementById('cm-btn-clear').onclick = () => {
        conversationHistory.length = 0;
        threadView.innerHTML = `
            <div class="cm-bubble bot">
                Thread memory cleared! Ready for your next query, bug report, or math problem.
            </div>
        `;
    };

    document.getElementById('cm-btn-vault').onclick = () => {
        vaultKeyInput.value = userApiKey;
        vaultModelInput.value = activeModel;
        settingsModal.style.display = 'flex';
    };

    document.getElementById('cm-vault-cancel').onclick = () => {
        settingsModal.style.display = 'none';
    };

    document.getElementById('cm-vault-save').onclick = () => {
        userApiKey = vaultKeyInput.value.trim();
        activeModel = vaultModelInput.value;
        localStorage.setItem('cm_ai_key', userApiKey);
        localStorage.setItem('cm_ai_model', activeModel);
        modelTag.innerText = activeModel.includes('pro') ? 'PRO 1.5' : 'FLASH 1.5';
        settingsModal.style.display = 'none';
        appendBotMessage("Vault updated! Connected to **" + activeModel + "**.");
    };

    // Auto-grow textarea height
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
    });

    // File Upload Handler
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        attachedMime = file.type || "image/jpeg";
        const reader = new FileReader();
        reader.onload = () => {
            attachedBase64 = reader.result;
            bufferThumb.src = attachedBase64;
            bufferBar.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    };

    bufferRemove.onclick = () => {
        attachedBase64 = null;
        fileInput.value = "";
        bufferBar.style.display = 'none';
    };

    function appendUserMessage(text, imgData) {
        const msg = document.createElement('div');
        msg.className = 'cm-bubble user';
        let content = text ? `<div>${text}</div>` : '';
        if (imgData) {
            content += `<img class="attached-preview" src="${imgData}" alt="User upload">`;
        }
        msg.innerHTML = content;
        threadView.appendChild(msg);
        threadView.scrollTop = threadView.scrollHeight;
    }

    function appendBotMessage(markdownText) {
        const msg = document.createElement('div');
        msg.className = 'cm-bubble bot';
        msg.innerHTML = parseAdvancedMarkdown(markdownText);
        threadView.appendChild(msg);
        threadView.scrollTop = threadView.scrollHeight;
        return msg;
    }

    function showLoader() {
        const loader = document.createElement('div');
        loader.className = 'cm-bubble bot';
        loader.id = 'cm-live-loader';
        loader.innerHTML = `
            <div class="cm-loader">
                <div class="cm-dot"></div>
                <div class="cm-dot"></div>
                <div class="cm-dot"></div>
            </div>
        `;
        threadView.appendChild(loader);
        threadView.scrollTop = threadView.scrollHeight;
    }

    function hideLoader() {
        const el = document.getElementById('cm-live-loader');
        if (el) el.remove();
    }

    // --- 6. Live Multimodal REST Engine ---
    async function executeMultimodalQuery(userPrompt, imageBase64, mimeType) {
        if (!userApiKey) {
            return "⚠️ **No API Key Provided**\n\nTo give Can Ming true vision and unbounded reasoning, open settings (⚙️ top right) and enter your Google Gemini API key.";
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${userApiKey}`;

        // Construct parts array for Gemini 1.5 architecture
        const parts = [];

        if (imageBase64) {
            const rawBase64 = imageBase64.split(',')[1] || imageBase64;
            parts.push({
                inline_data: {
                    mime_type: mimeType,
                    data: rawBase64
                }
            });
        }

        if (userPrompt) {
            parts.push({ text: userPrompt });
        }

        // Push current turn to context buffer
        conversationHistory.push({
            role: "user",
            parts: parts
        });

        // Keep rolling context window manageable
        if (conversationHistory.length > 12) {
            conversationHistory.splice(0, 2);
        }

        const requestBody = {
            system_instruction: {
                parts: [{ text: SYSTEM_DIRECTIVE }]
            },
            contents: conversationHistory,
            generationConfig: {
                temperature: 0.4,
                topP: 0.95,
                maxOutputTokens: 2048
            }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errJson = await response.json().catch(() => ({}));
            const errDetail = errJson.error ? errJson.error.message : response.statusText;
            throw new Error(`[Gemini API Error ${response.status}]: ${errDetail}`);
        }

        const data = await response.json();
        const candidate = data.candidates?.[0];
        if (!candidate || !candidate.content?.parts?.[0]?.text) {
            throw new Error("No textual response returned by safety filters or model state.");
        }

        const responseText = candidate.content.parts[0].text;

        // Save bot turn to context memory
        conversationHistory.push({
            role: "model",
            parts: [{ text: responseText }]
        });

        return responseText;
    }

    // --- 7. Dispatch Action ---
    async function handleSubmission() {
        const text = userInput.value.trim();
        const img = attachedBase64;
        const mime = attachedMime;

        if (!text && !img) return;

        // Reset inputs
        userInput.value = "";
        userInput.style.height = '42px';
        attachedBase64 = null;
        fileInput.value = "";
        bufferBar.style.display = 'none';

        appendUserMessage(text, img);
        showLoader();

        try {
            const botAnswer = await executeMultimodalQuery(text, img, mime);
            hideLoader();
            appendBotMessage(botAnswer);
        } catch (err) {
            hideLoader();
            appendBotMessage(`❌ **Engine Failure**\n\n\`${err.message}\`\n\nVerify that your API key is active with Gemini 1.5 enabled.`);
        }
    }

    sendBtn.onclick = handleSubmission;
    userInput.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmission();
        }
    };
})();
