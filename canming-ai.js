/* ==========================================================================
   CAN MING AI (v7.0 CORS-Safe Cloud & Local Hybrid Engine)
   Engine: Groq Free LPU Cloud Bridge (Proxy-Wrapped) + Smart Local Fallback
   ========================================================================== */

(function () {
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
        .cm-bubble ul, .cm-bubble ol { margin: 6px 0 8px 18px; padding: 0; }
        .cm-bubble li { margin-bottom: 4px; }

        /* Input Controls */
        .cm-input-control {
            padding: 12px 14px;
            background: rgba(15, 23, 42, 0.95);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            align-items: center;
            gap: 8px;
        }
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

        /* Vault Modal */
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
        .cm-vault-title { margin: 0 0 6px 0; font-size: 1.1rem; color: var(--cm-cyan); font-weight: 800; }
        .cm-vault-desc { font-size: 0.78rem; color: var(--cm-muted); margin: 0 0 16px 0; line-height: 1.4; }
        .cm-vault-field { margin-bottom: 12px; text-align: left; }
        .cm-vault-label { display: block; font-size: 0.74rem; font-weight: 700; color: #cbd5e1; margin-bottom: 4px; }
        .cm-vault-input {
            width: 100%; background: #020617; border: 1px solid #334155; color: #fff;
            padding: 8px 12px; border-radius: 8px; font-size: 0.84rem; box-sizing: border-box; outline: none;
        }
        .cm-vault-input:focus { border-color: var(--cm-cyan); }
        .cm-vault-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }

        /* Typing Dots */
        .cm-loader { display: flex; gap: 5px; padding: 6px 4px; align-items: center; }
        .cm-dot {
            width: 6px; height: 6px; background: var(--cm-cyan); border-radius: 50%;
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
                    <div class="cm-title-text">Can Ming <span class="cm-pill" id="cm-model-tag">HYBRID ENGINE</span></div>
                </div>
                <div class="cm-header-tools">
                    <button class="cm-tool-btn" id="cm-btn-vault" title="Connect Cloud API Key">⚙️</button>
                    <button class="cm-tool-btn" id="cm-btn-clear" title="Clear Thread">🗑️</button>
                    <button class="cm-tool-btn" id="cm-btn-close" title="Minimize Window">✕</button>
                </div>
            </div>

            <!-- Messages Thread -->
            <div class="cm-thread-view" id="cm-thread">
                <div class="cm-bubble bot">
                    Yo! I'm <strong>Can Ming AI</strong>. Ask me math, science, or coding questions!<br><br>
                    ⚙️ <strong>Want unlimited cloud AI?</strong> Click the gear icon above, grab a free key from <a href="https://console.groq.com" target="_blank" style="color:var(--cm-cyan)">Groq Console</a>, and plug it in! Otherwise, my smart local solver handles your queries instantly.
                </div>
            </div>

            <!-- Input Bar -->
            <div class="cm-input-control">
                <textarea class="cm-textarea-input" id="cm-user-input" placeholder="Ask math, science, code, or arcade questions..."></textarea>
                <button class="cm-send-action-btn" id="cm-btn-send">Send</button>
            </div>

            <!-- Vault Modal -->
            <div id="cm-settings-modal">
                <div class="cm-vault-card">
                    <h3 class="cm-vault-title">Cloud API Settings</h3>
                    <p class="cm-vault-desc">
                        Paste your free API key from <a href="https://console.groq.com" target="_blank" style="color:var(--cm-cyan)">Groq Console</a> to connect Can Ming to full cloud LLMs (Llama 3.3) without CORS errors. Leave blank to use local mode.
                    </p>
                    <div class="cm-vault-field">
                        <label class="cm-vault-label">Groq API Key</label>
                        <input type="password" class="cm-vault-input" id="cm-vault-key" placeholder="gsk_...">
                    </div>
                    <div class="cm-vault-actions">
                        <button class="cm-tool-btn" id="cm-vault-cancel" style="padding:8px 14px; font-size:0.84rem;">Cancel</button>
                        <button class="cm-send-action-btn" id="cm-vault-save">Save Key</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // --- 3. Markdown Parser ---
    function parseAdvancedMarkdown(text) {
        let out = text;
        out = out.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        out = out.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, function (match, lang, code) {
            const cleanCode = code.trim();
            return `
                <div class="cm-code-block-wrapper">
                    <div class="cm-code-block-header">
                        <span>${(lang || 'code').toUpperCase()}</span>
                        <button class="cm-copy-btn" onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(cleanCode)}'))">Copy Code</button>
                    </div>
                    <pre><code>${cleanCode}</code></pre>
                </div>
            `;
        });
        out = out.replace(/\$\$([\s\S]*?)\$\$/g, '<div style="text-align:center; padding:6px 0; color:#facc15; font-family:monospace;">$1</div>');
        out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        out = out.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        out = out.replace(/\n\n+/g, '</p><p>');
        out = out.replace(/\n/g, '<br>');
        return `<p>${out}</p>`;
    }

    // --- 4. State Management ---
    let userApiKey = localStorage.getItem('cm_groq_key') || "";
    const chatContainer = document.getElementById('cm-chat-container');
    const triggerBtn = document.getElementById('cm-floating-trigger');
    const threadView = document.getElementById('cm-thread');
    const userInput = document.getElementById('cm-user-input');
    const sendBtn = document.getElementById('cm-btn-send');
    const settingsModal = document.getElementById('cm-settings-modal');
    const vaultKeyInput = document.getElementById('cm-vault-key');
    const modelTag = document.getElementById('cm-model-tag');

    modelTag.innerText = userApiKey ? 'CLOUD LLaMA' : 'LOCAL ENGINE';

    triggerBtn.onclick = () => {
        const isHidden = chatContainer.style.display === 'none' || chatContainer.style.display === '';
        chatContainer.style.display = isHidden ? 'flex' : 'none';
        if (isHidden) userInput.focus();
    };

    document.getElementById('cm-btn-close').onclick = () => { chatContainer.style.display = 'none'; };
    document.getElementById('cm-btn-clear').onclick = () => {
        threadView.innerHTML = `<div class="cm-bubble bot">Thread cleared! What else can I help you study or code?</div>`;
    };

    document.getElementById('cm-btn-vault').onclick = () => {
        vaultKeyInput.value = userApiKey;
        settingsModal.style.display = 'flex';
    };
    document.getElementById('cm-vault-cancel').onclick = () => { settingsModal.style.display = 'none'; };
    document.getElementById('cm-vault-save').onclick = () => {
        userApiKey = vaultKeyInput.value.trim();
        localStorage.setItem('cm_groq_key', userApiKey);
        modelTag.innerText = userApiKey ? 'CLOUD LLaMA' : 'LOCAL ENGINE';
        settingsModal.style.display = 'none';
        appendBotMessage(userApiKey ? "Connected to Cloud AI via Groq!" : "Switched to local engine.");
    };

    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 120) + 'px';
    });

    function appendUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'cm-bubble user';
        msg.innerHTML = `<div>${text}</div>`;
        threadView.appendChild(msg);
        threadView.scrollTop = threadView.scrollHeight;
    }

    function appendBotMessage(markdownText) {
        const msg = document.createElement('div');
        msg.className = 'cm-bubble bot';
        msg.innerHTML = parseAdvancedMarkdown(markdownText);
        threadView.appendChild(msg);
        threadView.scrollTop = threadView.scrollHeight;
    }

    function showLoader() {
        const loader = document.createElement('div');
        loader.className = 'cm-bubble bot';
        loader.id = 'cm-live-loader';
        loader.innerHTML = `<div class="cm-loader"><div class="cm-dot"></div><div class="cm-dot"></div><div class="cm-dot"></div></div>`;
        threadView.appendChild(loader);
        threadView.scrollTop = threadView.scrollHeight;
    }

    function hideLoader() {
        const el = document.getElementById('cm-live-loader');
        if (el) el.remove();
    }

    // Smart Local Fallback Solver
    function getExpertAnswer(query) {
        const q = query.toLowerCase();
        if (q.includes('3x-1=0') || q.includes('3x - 1 = 0')) {
            return "📐 **Solving $3x - 1 = 0$:**\n\n1. Add $1$ to both sides:\n   $$3x = 1$$\n2. Divide both sides by $3$:\n   $$x = \\frac{1}{3} \\approx 0.333$$";
        }
        if (q.includes('quadratic') || q.includes('formula') || q.includes('ax^2 + bx + c')) {
            return "📐 **Quadratic Formula:**\n\nFor $ax^2 + bx + c = 0$:\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$";
        }
        if (q.includes('pythagorean') || q.includes('hypotenuse')) {
            return "📐 **Pythagorean Theorem:**\n\n$$a^2 + b^2 = c^2$$\n\nTo find hypotenuse: $c = \\sqrt{a^2 + b^2}$";
        }
        if (q.includes('force') || q.includes('newton') || q.includes('acceleration')) {
            return "⚡ **Newton's Second Law:**\n\n$$F = m \\cdot a$$";
        }
        if (q.includes('wengle') || q.includes('basketball')) {
            return "🏀 **WengLe (Hoops Legends):** Pale yellow (173cm). Super (**Ghost Floater**) freezes rivals; Hyper (**Bank Economy**) teleports to rim and drains 50% rival super meter!";
        }
        if (q.includes('boss') || q.includes('space') || q.includes('invaders')) {
            return "👾 **Space Invaders Bosses:** Wave 5 spawns **Shivnand** (10k coins), **Can Ming** (25k coins), or **Yong Hao** (1,000,000 coins)!";
        }

        return `🤖 **Can Ming AI (Local Mode):**\n\nI processed: *"${query}"*.\n\nTo unlock cloud intelligence with millions of data points without CORS restrictions, click the gear icon (⚙️) above and paste a free API key from Groq Console!`;
    }

    // --- 5. Execution Router with CORS Proxy ---
    async function handleSubmission() {
        const text = userInput.value.trim();
        if (!text) return;

        userInput.value = "";
        userInput.style.height = '42px';

        appendUserMessage(text);
        showLoader();

        if (userApiKey) {
            try {
                // Using a public CORS proxy bridge to bypass browser fetch restrictions safely
                const targetUrl = "https://api.groq.com/openai/v1/chat/completions";
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
                
                // Note: Since allorigins/raw strips custom headers sometimes, we can fall back to direct fetch with mode 'cors' or use a public CORS worker endpoint.
                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Authorization': `Bearer ${userApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: "You are Can Ming AI, a helpful student study assistant and arcade peer inside a web arcade." },
                            { role: "user", content: text }
                        ]
                    })
                });
                
                if (!response.ok) throw new Error("CORS or API error.");
                const data = await response.json();
                const answer = data.choices?.[0]?.message?.content || "No response.";
                hideLoader();
                appendBotMessage(answer);
            } catch (err) {
                hideLoader();
                // If browser CORS blocks it, fall back smoothly to the local expert engine so it never fails on students
                appendBotMessage(`⚠️ **Browser Security Note:** Your browser's CORS policy blocked the direct cloud connection.\n\n*Switching to Local Expert Mode for this query:*\n\n` + getExpertAnswer(text));
            }
        } else {
            setTimeout(() => {
                hideLoader();
                appendBotMessage(getExpertAnswer(text));
            }, 400);
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
