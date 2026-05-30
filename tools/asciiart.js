// ============================================
// asciiart.js — ASCII Art Text Generator
// ============================================

(function () {
    'use strict';
    window.DevTools = window.DevTools || {};

    // Simple 5-row pixel font (5x5 grid for each character)
    const FONT = {
        'A': ['  █  ', ' █ █ ', '█████', '█   █', '█   █'],
        'B': ['████ ', '█   █', '████ ', '█   █', '████ '],
        'C': [' ████', '█    ', '█    ', '█    ', ' ████'],
        'D': ['████ ', '█   █', '█   █', '█   █', '████ '],
        'E': ['█████', '█    ', '████ ', '█    ', '█████'],
        'F': ['█████', '█    ', '████ ', '█    ', '█    '],
        'G': [' ████', '█    ', '█  ██', '█   █', ' ████'],
        'H': ['█   █', '█   █', '█████', '█   █', '█   █'],
        'I': ['█████', '  █  ', '  █  ', '  █  ', '█████'],
        'J': ['█████', '   █ ', '   █ ', '█  █ ', ' ██  '],
        'K': ['█   █', '█  █ ', '███  ', '█  █ ', '█   █'],
        'L': ['█    ', '█    ', '█    ', '█    ', '█████'],
        'M': ['█   █', '██ ██', '█ █ █', '█   █', '█   █'],
        'N': ['█   █', '██  █', '█ █ █', '█  ██', '█   █'],
        'O': [' ███ ', '█   █', '█   █', '█   █', ' ███ '],
        'P': ['████ ', '█   █', '████ ', '█    ', '█    '],
        'Q': [' ███ ', '█   █', '█ █ █', '█  █ ', ' ██ █'],
        'R': ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
        'S': [' ████', '█    ', ' ███ ', '    █', '████ '],
        'T': ['█████', '  █  ', '  █  ', '  █  ', '  █  '],
        'U': ['█   █', '█   █', '█   █', '█   █', ' ███ '],
        'V': ['█   █', '█   █', '█   █', ' █ █ ', '  █  '],
        'W': ['█   █', '█   █', '█ █ █', '██ ██', '█   █'],
        'X': ['█   █', ' █ █ ', '  █  ', ' █ █ ', '█   █'],
        'Y': ['█   █', ' █ █ ', '  █  ', '  █  ', '  █  '],
        'Z': ['█████', '   █ ', '  █  ', ' █   ', '█████'],
        '0': [' ███ ', '█  ██', '█ █ █', '██  █', ' ███ '],
        '1': ['  █  ', ' ██  ', '  █  ', '  █  ', '█████'],
        '2': [' ███ ', '█   █', '  ██ ', ' █   ', '█████'],
        '3': ['████ ', '    █', ' ███ ', '    █', '████ '],
        '4': ['█   █', '█   █', '█████', '    █', '    █'],
        '5': ['█████', '█    ', '████ ', '    █', '████ '],
        '6': [' ████', '█    ', '████ ', '█   █', ' ███ '],
        '7': ['█████', '   █ ', '  █  ', ' █   ', '█    '],
        '8': [' ███ ', '█   █', ' ███ ', '█   █', ' ███ '],
        '9': [' ███ ', '█   █', ' ████', '    █', '████ '],
        ' ': ['     ', '     ', '     ', '     ', '     '],
        '!': ['  █  ', '  █  ', '  █  ', '     ', '  █  '],
        '.': ['     ', '     ', '     ', '     ', '  █  '],
        '-': ['     ', '     ', '█████', '     ', '     '],
        '_': ['     ', '     ', '     ', '     ', '█████'],
        '?': [' ███ ', '█   █', '  ██ ', '     ', '  █  '],
    };

    window.DevTools.initAsciiArt = function () {
        const input = document.getElementById('ascii-input');
        const outputEl = document.getElementById('ascii-output');
        const copyBtn = document.getElementById('ascii-copy');
        if (!input) return;

        function generate() {
            const text = input.value.toUpperCase();
            if (!text) { outputEl.textContent = ''; return; }

            const lines = ['', '', '', '', ''];
            for (const ch of text) {
                const glyph = FONT[ch] || FONT['?'];
                for (let row = 0; row < 5; row++) {
                    lines[row] += glyph[row] + '  ';
                }
            }
            outputEl.textContent = lines.join('\n');
        }

        input.addEventListener('input', generate);

        copyBtn.addEventListener('click', () => {
            const text = outputEl.textContent;
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => copyBtn.textContent = 'Copy', 1500);
                });
            }
        });

        generate();
    };
})();
