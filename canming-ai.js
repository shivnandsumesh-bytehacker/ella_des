/* =========================================================
   CAN MING AI - Cyber Arcade Assistant & Math Solver
   ========================================================= */

(function () {
    // 1. Inject Styles
    const style = document.createElement('style');
    style.textContent = `
        #cmai-toggle {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: linear-gradient(135deg, #00f3ff, #ff007f);
            color: #000;
            border: none;
            border-radius: 50px;
            padding: 12px 20px;
            font-size: 0.95rem;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        #cmai-toggle:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(255, 0, 127, 0.7);
        }
        #cmai-window {
            position: fixed;
            bottom: 80px;
            right: 24px;
            width: 360px;
            max-width: calc(100vw - 32px);
            height: 520px;
            background: rgba(11, 19, 41, 0.96);
            border: 2px solid #00f3ff;
            border-radius: 14px;
            backdrop-filter: blur(14px);
            box-shadow: 0 0 35px rgba(0, 243, 255, 0.3);
            display: none;
            flex-direction: column;
            overflow: hidden;
            z-index: 9999;
            font-family: 'Segoe UI', system-ui, sans-serif;
        }
        .cmai-header {
            background: #0f172a;
            padding: 12px 16px;
            border-bottom: 1.5px solid #1e293b;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cmai-title {
            color: #00f3ff;
            font-weight: 800;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .cmai-close {
            background: transparent;
            border: none;
            color: #94a3b8;
            font-size: 1.2rem;
            cursor: pointer;
        }
        .cmai-messages {
            flex: 1;
            padding: 14px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
            font-size: 0.85rem;
        }
        .cmai-msg {
            padding: 8px 12px;
            border-radius: 10px;
            max-width: 85%;
            line-height: 1.4;
            word-break: break-word;
        }
        .cmai-msg.bot {
            background: #1e293b;
            color: #f8fafc;
            border-left: 3px solid #00f3ff;
            align-self: flex-start;
        }
        .cmai-msg.user {
            background: linear-gradient(135deg, #0284c7, #2563eb);
            color: #fff;
            align-self: flex-end;
        }
        .cmai-preview-bar {
            display: none;
            padding: 6px 12px;
            background: #090d16;
            border-top: 1px solid #1e293b;
            font-size: 0.75rem;
            color: #facc15;
            align-items: center;
            justify-content: space-between;
        }
        .cmai-input-box {
            padding: 10px;
            background: #0f172a;
            border-top: 1.5px solid #1e293b;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .cmai-input-box input[type="text"] {
            flex: 1;
            background: #1e293b;
            border: 1px solid #334155;
            color: #fff;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 0.85rem;
            outline: none;
        }
        .cmai-input-box input[type="text"]:focus {
            border-color: #00f3ff;
        }
        .cmai-btn {
            background: #00f3ff;
            color: #000;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            font-weight: 800;
            cursor: pointer;
        }
        .cmai-upload-label {
            cursor: pointer;
            font-size: 1.1rem;
            padding: 4px;
        }
    `;
    document.head.appendChild(style);

    // 2. Inject DOM Elements
    const container = document.createElement('div');
    container.innerHTML = `
        <button id="cmai-toggle">🤖 Can Ming AI</button>
        <div id="cmai-window">
            <div class="cmai-header">
                <div class="cmai-title">⚡ Can Ming AI <span style="font-size:0.65rem; color:#facc15; border:1px solid #facc15; padding:1px 4px; border-radius:4px;">GUIDE & MATH</span></div>
                <button class="cmai-close" id="cmai-close-btn">✕</button>
            </div>
            <div class="cmai-messages" id="cmai-messages">
                <div class="cmai-msg bot">
                    Hey! I'm <strong>Can Ming AI</strong>. Need help with an arcade bug, game controls, or stuck on a math problem? Ask away or attach a photo!
                </div>
            </div>
            <div class="cmai-preview-bar" id="cmai-preview-bar">
                <span>📎 Image Attached</span>
                <button style="background:none; border:none; color:#ef4444; cursor:pointer;" id="cmai-clear-img">✕</button>
            </div>
            <div class="cmai-input-box">
                <label class="cmai-upload-label" title="Attach picture (math problem or bug)">
                    📷<input type="file" id="cmai-file-input" accept="image/*" style="display:none;">
                </label>
                <input type="text" id="cmai-text-input" placeholder="Ask about bugs or math...">
                <button class="cmai-btn" id="cmai-send-btn">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // 3. Logic & Offline Knowledge
    let attachedImageBase64 = null;
    const messagesEl = document.getElementById('cmai-messages');
    const inputEl = document.getElementById('cmai-text-input');
    const fileInput = document.getElementById('cmai-file-input');
    const previewBar = document.getElementById('cmai-preview-bar');
    const windowEl = document.getElementById('cmai-window');

    document.getElementById('cmai-toggle').onclick = () => {
        windowEl.style.display = windowEl.style.display === 'flex' ? 'none' : 'flex';
    };
    document.getElementById('cmai-close-btn').onclick = () => {
        windowEl.style.display = 'none';
    };

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            attachedImageBase64 = reader.result;
            previewBar.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    };

    document.getElementById('cmai-clear-img').onclick = () => {
        attachedImageBase64 = null;
        fileInput.value = '';
        previewBar.style.display = 'none';
    };

    function appendMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `cmai-msg ${sender}`;
        msg.innerHTML = text.replace(/\n/g, '<br>');
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // Built-in Knowledge & Fallback Solver
    function solveLocally(query, hasImage) {
        const q = query.toLowerCase();

        if (hasImage) {
            return "📸 Image received! If this is a math problem, verify your values: solve step-by-step by isolating variables, applying order of operations ($PEMDAS$), or using the quadratic formula $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.\n\n*(Connect your Gemini API key in `canming-ai.js` for automated image OCR parsing!)*";
        }

        // Arcade Bug Diagnoses
        if (q.includes('reverse') || q.includes('train')) {
            return "🚆 **Train Reverser Tip:** Make sure the Master Key is set to ON [K]. The train must be completely stopped before pressing [R] to switch between Forward, Neutral, and Reverse.";
        }
        if (q.includes('aws')) {
            return "⚠️ **AWS Guide:** AWS rings a warning buzzer on caution/yellow signals. Tap **[Q]** or the on-screen AWS button within 2.5 seconds to prevent emergency brakes!";
        }
        if (q.includes('car') || q.includes('steer') || q.includes('lap')) {
            return "🏎️ **Car Game Tip:** Steering lock dynamically adjusts with your speed to prevent spin-outs. Make sure you complete half the track to trigger the lap gate checkpoint!";
        }
        if (q.includes('snow') || q.includes('cliff')) {
            return "🛷 **Snow Rider Tip:** You cannot spam-hold jump! Time your jump tap right at the ramp edge to clear the chasm, and duck under overhead logs.";
        }

        // Quick Math Solver
        if (/[\d\+\-\*\/\^\=]/.test(q) && (q.includes('solve') || q.includes('what is') || q.includes('calculate'))) {
            try {
                const expr = q.replace(/[^0-9\+\-\*\/\(\)\.]/g, '');
                if (expr) {
                    const ans = Function(`'use strict'; return (${expr})`)();
                    return `🧮 **Math Solution:**\n$$${expr} = ${ans}$$\nStep-by-step: Evaluate operations following standard order of precedence.`;
                }
            } catch (e) {}
        }

        return "I can troubleshoot game controls, diagnose bugs, or solve math equations. Try asking: *'How do I reverse the train?'* or *'Solve 3x + 12 = 45'*!";
    }

    function handleSend() {
        const text = inputEl.value.trim();
        if (!text && !attachedImageBase64) return;

        appendMessage(text || "[Attached Image]", 'user');
        inputEl.value = '';

        const hasImg = !!attachedImageBase64;
        attachedImageBase64 = null;
        fileInput.value = '';
        previewBar.style.display = 'none';

        // Simulated thinking delay
        setTimeout(() => {
            const reply = solveLocally(text, hasImg);
            appendMessage(reply, 'bot');
        }, 450);
    }

    document.getElementById('cmai-send-btn').onclick = handleSend;
    inputEl.onkeydown = (e) => {
        if (e.key === 'Enter') handleSend();
    };
})();
