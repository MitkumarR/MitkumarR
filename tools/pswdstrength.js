// ============================================
// pswdstrength.js — Password Strength Analyzer
// ============================================

(function () {
    'use strict';
    window.DevTools = window.DevTools || {};

    window.DevTools.initPswdStrength = function () {
        const input = document.getElementById('pswd-str-input');
        const bar = document.getElementById('pswd-str-bar');
        const label = document.getElementById('pswd-str-label');
        const details = document.getElementById('pswd-str-details');
        if (!input) return;

        function analyze(password) {
            let score = 0;
            const checks = [];

            // Length
            if (password.length >= 8) { score += 1; checks.push({ text: '8+ characters', pass: true }); }
            else checks.push({ text: '8+ characters', pass: false });

            if (password.length >= 12) { score += 1; checks.push({ text: '12+ characters', pass: true }); }
            else checks.push({ text: '12+ characters', pass: false });

            // Character types
            if (/[a-z]/.test(password)) { score += 1; checks.push({ text: 'Lowercase letters', pass: true }); }
            else checks.push({ text: 'Lowercase letters', pass: false });

            if (/[A-Z]/.test(password)) { score += 1; checks.push({ text: 'Uppercase letters', pass: true }); }
            else checks.push({ text: 'Uppercase letters', pass: false });

            if (/[0-9]/.test(password)) { score += 1; checks.push({ text: 'Numbers', pass: true }); }
            else checks.push({ text: 'Numbers', pass: false });

            if (/[^a-zA-Z0-9]/.test(password)) { score += 1; checks.push({ text: 'Special characters', pass: true }); }
            else checks.push({ text: 'Special characters', pass: false });

            // Common patterns penalty
            if (/^(123|abc|password|qwerty|admin)/i.test(password)) {
                score = Math.max(0, score - 2);
                checks.push({ text: 'No common patterns', pass: false });
            } else {
                checks.push({ text: 'No common patterns', pass: true });
            }

            return { score: Math.min(score, 7), checks };
        }

        function getLevel(score) {
            if (score <= 1) return { label: 'Very Weak', color: '#F92841', percent: 15 };
            if (score <= 2) return { label: 'Weak', color: '#e67e22', percent: 30 };
            if (score <= 3) return { label: 'Fair', color: '#f1c40f', percent: 45 };
            if (score <= 4) return { label: 'Good', color: '#A0F200', percent: 60 };
            if (score <= 5) return { label: 'Strong', color: '#1abc9c', percent: 80 };
            return { label: 'Very Strong', color: '#5964F2', percent: 100 };
        }

        input.addEventListener('input', () => {
            const pwd = input.value;
            if (!pwd) {
                bar.style.width = '0%';
                bar.style.backgroundColor = 'transparent';
                label.textContent = 'Enter a password';
                details.innerHTML = '';
                return;
            }

            const result = analyze(pwd);
            const level = getLevel(result.score);

            bar.style.width = level.percent + '%';
            bar.style.backgroundColor = level.color;
            label.textContent = level.label;
            label.style.color = level.color;

            details.innerHTML = result.checks.map(c =>
                `<div class="pswd-check ${c.pass ? 'pass' : 'fail'}">
                    <span>${c.pass ? '✓' : '✕'}</span> ${c.text}
                </div>`
            ).join('');
        });
    };
})();
