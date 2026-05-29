// ============================================
// games.js — Retro mini-games manager
// ============================================

(function () {
    'use strict';

    window.BoredGames = window.BoredGames || {};

    // --- Shared helpers ---
    window.BoredGames.utils = {
        getThemeColor: function() {
            return getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color').trim();
        },
        hexToRgb: function(hex) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        },
        showGame: function(gameId) {
            document.getElementById('games-grid').style.display = 'none';
            const container = document.getElementById('game-' + gameId);
            if (container) container.style.display = 'flex';
        },
        showGrid: function() {
            document.querySelectorAll('.game-container').forEach(c => c.style.display = 'none');
            const grid = document.getElementById('games-grid');
            if (grid) grid.style.display = 'block';
        }
    };

    window.BoredGames.init = function() {
        const grid = document.getElementById('games-grid');
        if (!grid) return;

        // Card click → open game
        grid.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', () => {
                const game = card.dataset.game;
                window.BoredGames.utils.showGame(game);
                if (game === 'snake' && window.BoredGames.initSnake) window.BoredGames.initSnake();
                if (game === 'tictactoe' && window.BoredGames.initTicTacToe) window.BoredGames.initTicTacToe();
                if (game === 'typing' && window.BoredGames.initTypingTest) window.BoredGames.initTypingTest();
            });
        });

        // Back buttons → return to grid
        document.querySelectorAll('.game-back-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.BoredGames.snakeCleanup) { 
                    window.BoredGames.snakeCleanup(); 
                    window.BoredGames.snakeCleanup = null; 
                }
                window.BoredGames.utils.showGrid();
            });
        });
    };
})();
