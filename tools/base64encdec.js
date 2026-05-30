// ============================================
// base64encdec.js — Base64 Encoder/Decoder
// ============================================

(function () {
    'use strict';
    window.DevTools = window.DevTools || {};

    window.DevTools.initBase64 = function () {
        const inputEl = document.getElementById('b64-input');
        const outputEl = document.getElementById('b64-output');
        const encodeBtn = document.getElementById('b64-encode');
        const decodeBtn = document.getElementById('b64-decode');
        const copyBtn = document.getElementById('b64-copy');
        const swapBtn = document.getElementById('b64-swap');
        const errorEl = document.getElementById('b64-error');
        if (!inputEl) return;

        encodeBtn.addEventListener('click', () => {
            errorEl.textContent = '';
            try {
                outputEl.value = btoa(unescape(encodeURIComponent(inputEl.value)));
            } catch (e) {
                errorEl.textContent = 'Encoding error: ' + e.message;
            }
        });

        decodeBtn.addEventListener('click', () => {
            errorEl.textContent = '';
            try {
                outputEl.value = decodeURIComponent(escape(atob(inputEl.value)));
            } catch (e) {
                errorEl.textContent = 'Decoding error: invalid Base64 string.';
            }
        });

        copyBtn.addEventListener('click', () => {
            const text = outputEl.value;
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => copyBtn.textContent = 'Copy Output', 1500);
                });
            }
        });

        swapBtn.addEventListener('click', () => {
            const tmp = inputEl.value;
            inputEl.value = outputEl.value;
            outputEl.value = tmp;
        });
    };
})();
