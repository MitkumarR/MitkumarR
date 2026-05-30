// ============================================
// tools.js — Developer tools manager
// ============================================

(function () {
    'use strict';

    window.DevTools = window.DevTools || {};

    // --- Shared helpers ---
    window.DevTools.utils = {
        getThemeColor: function () {
            return getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color').trim();
        },
        showTool: function (toolId) {
            // Hide the tools grid section
            const section = document.getElementById('tools-section');
            if (section) section.style.display = 'none';
            // Hide the about-grid (projects)
            const aboutGrid = document.querySelector('.page-content .about-grid');
            if (aboutGrid) aboutGrid.style.display = 'none';
            // Hide the hero
            const hero = document.querySelector('.page-content .about-hero');
            if (hero) hero.style.display = 'none';
            // Show the tool container
            const container = document.getElementById('tool-' + toolId);
            if (container) container.style.display = 'flex';
        },
        showGrid: function () {
            // Hide all tool containers
            document.querySelectorAll('.tool-container').forEach(c => c.style.display = 'none');
            // Re-show the page sections
            const section = document.getElementById('tools-section');
            if (section) section.style.display = '';
            const aboutGrid = document.querySelector('.page-content .about-grid');
            if (aboutGrid) aboutGrid.style.display = '';
            const hero = document.querySelector('.page-content .about-hero');
            if (hero) hero.style.display = '';
        }
    };

    window.DevTools.init = function () {
        const grid = document.getElementById('tools-grid');
        if (!grid) return;

        // Card click → open tool
        grid.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', () => {
                const tool = card.dataset.tool;
                window.DevTools.utils.showTool(tool);
                // Initialize tools
                if (tool === 'pswdstrength' && window.DevTools.initPswdStrength) window.DevTools.initPswdStrength();
                if (tool === 'pswdgenerator' && window.DevTools.initPswdGenerator) window.DevTools.initPswdGenerator();
                if (tool === 'hashchecker' && window.DevTools.initHashChecker) window.DevTools.initHashChecker();
                if (tool === 'jwtdecoder' && window.DevTools.initJwtDecoder) window.DevTools.initJwtDecoder();
                if (tool === 'base64' && window.DevTools.initBase64) window.DevTools.initBase64();
                if (tool === 'asciiart' && window.DevTools.initAsciiArt) window.DevTools.initAsciiArt();
            });
        });

        // Back buttons → return to grid
        document.querySelectorAll('.tool-back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.DevTools.utils.showGrid();
            });
        });
    };
})();
