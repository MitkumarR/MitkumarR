// ============================================
// hashchecker.js — Hash Generator / Checker
// ============================================

(function () {
    'use strict';
    window.DevTools = window.DevTools || {};

    window.DevTools.initHashChecker = function () {
        const input = document.getElementById('hash-input');
        const algoSelect = document.getElementById('hash-algo');
        const outputEl = document.getElementById('hash-output');
        const compareInput = document.getElementById('hash-compare');
        const matchEl = document.getElementById('hash-match');
        if (!input) return;

        async function computeHash() {
            const text = input.value;
            if (!text) {
                outputEl.textContent = '';
                matchEl.textContent = '';
                return;
            }

            const algo = algoSelect.value;
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest(algo, data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            outputEl.textContent = hashHex;

            // Compare
            const compareVal = compareInput.value.trim().toLowerCase();
            if (compareVal) {
                if (compareVal === hashHex) {
                    matchEl.textContent = '✓ Match!';
                    matchEl.style.color = '#A0F200';
                } else {
                    matchEl.textContent = '✕ No match';
                    matchEl.style.color = '#F92841';
                }
            } else {
                matchEl.textContent = '';
            }
        }

        input.addEventListener('input', computeHash);
        algoSelect.addEventListener('change', computeHash);
        compareInput.addEventListener('input', computeHash);
    };
})();
