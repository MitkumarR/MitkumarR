// ============================================
// pswdgenerator.js — Secure Password Generator
// ============================================

(function () {
    'use strict';
    window.DevTools = window.DevTools || {};

    window.DevTools.initPswdGenerator = function () {
        const outputEl = document.getElementById('pswdgen-output');
        const lengthSlider = document.getElementById('pswdgen-length');
        const lengthVal = document.getElementById('pswdgen-length-val');
        const genBtn = document.getElementById('pswdgen-generate');
        const copyBtn = document.getElementById('pswdgen-copy');
        const optUpper = document.getElementById('pswdgen-upper');
        const optLower = document.getElementById('pswdgen-lower');
        const optNumbers = document.getElementById('pswdgen-numbers');
        const optSymbols = document.getElementById('pswdgen-symbols');
        if (!outputEl) return;

        const charsets = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        function generate() {
            let chars = '';
            if (optUpper && optUpper.checked) chars += charsets.upper;
            if (optLower && optLower.checked) chars += charsets.lower;
            if (optNumbers && optNumbers.checked) chars += charsets.numbers;
            if (optSymbols && optSymbols.checked) chars += charsets.symbols;
            if (!chars) chars = charsets.lower + charsets.numbers;

            const len = parseInt(lengthSlider.value) || 16;
            const array = new Uint32Array(len);
            crypto.getRandomValues(array);
            let password = '';
            for (let i = 0; i < len; i++) {
                password += chars[array[i] % chars.length];
            }
            outputEl.textContent = password;
        }

        lengthSlider.addEventListener('input', () => {
            lengthVal.textContent = lengthSlider.value;
        });

        genBtn.addEventListener('click', generate);

        copyBtn.addEventListener('click', () => {
            const text = outputEl.textContent;
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => copyBtn.textContent = 'Copy', 1500);
                });
            }
        });

        // Generate initial password
        generate();
    };
})();
