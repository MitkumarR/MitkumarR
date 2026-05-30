// ============================================
// jwtdecoder.js — JWT Token Decoder
// ============================================

(function () {
    'use strict';
    window.DevTools = window.DevTools || {};

    window.DevTools.initJwtDecoder = function () {
        const input = document.getElementById('jwt-input');
        const headerEl = document.getElementById('jwt-header');
        const payloadEl = document.getElementById('jwt-payload');
        const errorEl = document.getElementById('jwt-error');
        if (!input) return;

        function base64UrlDecode(str) {
            str = str.replace(/-/g, '+').replace(/_/g, '/');
            while (str.length % 4) str += '=';
            return decodeURIComponent(
                atob(str).split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join('')
            );
        }

        function decode() {
            const token = input.value.trim();
            headerEl.textContent = '';
            payloadEl.textContent = '';
            errorEl.textContent = '';

            if (!token) return;

            const parts = token.split('.');
            if (parts.length !== 3) {
                errorEl.textContent = 'Invalid JWT: expected 3 parts separated by dots.';
                return;
            }

            try {
                const header = JSON.parse(base64UrlDecode(parts[0]));
                headerEl.textContent = JSON.stringify(header, null, 2);
            } catch (e) {
                errorEl.textContent = 'Failed to decode header: ' + e.message;
                return;
            }

            try {
                const payload = JSON.parse(base64UrlDecode(parts[1]));
                // Add human-readable dates for common timestamp fields
                const timeFields = ['exp', 'iat', 'nbf'];
                timeFields.forEach(f => {
                    if (payload[f] && typeof payload[f] === 'number') {
                        payload[f + '_readable'] = new Date(payload[f] * 1000).toISOString();
                    }
                });
                payloadEl.textContent = JSON.stringify(payload, null, 2);
            } catch (e) {
                errorEl.textContent = 'Failed to decode payload: ' + e.message;
            }
        }

        input.addEventListener('input', decode);
    };
})();
