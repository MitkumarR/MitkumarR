// ============================================
// 2048.js — Retro 2048 sliding puzzle game
// ============================================

(function () {
    'use strict';

    window.BoredGames = window.BoredGames || {};

    window.BoredGames.g2048Cleanup = null;

    window.BoredGames.init2048 = function () {
        if (window.BoredGames.g2048Cleanup) window.BoredGames.g2048Cleanup();

        const boardEl = document.getElementById('g2048-board');
        const scoreEl = document.getElementById('g2048-score');
        const bestEl = document.getElementById('g2048-best');
        const statusEl = document.getElementById('g2048-status');
        const restartBtn = document.getElementById('g2048-restart');
        if (!boardEl) return;

        const SIZE = 4;
        let grid, score, best, moved, won, lost;

        best = parseInt(localStorage.getItem('2048-best') || '0');
        if (bestEl) bestEl.textContent = best;

        // Tile colors based on value
        function getTileStyle(val) {
            const styles = {
                2: { bg: 'rgba(254,254,255,0.08)', color: '#FEFEFF' },
                4: { bg: 'rgba(254,254,255,0.12)', color: '#FEFEFF' },
                8: { bg: 'rgba(89,100,242,0.3)', color: '#FEFEFF' },
                16: { bg: 'rgba(89,100,242,0.45)', color: '#FEFEFF' },
                32: { bg: 'rgba(249,40,65,0.4)', color: '#FEFEFF' },
                64: { bg: 'rgba(249,40,65,0.6)', color: '#FEFEFF' },
                128: { bg: 'rgba(160,242,0,0.35)', color: '#272727' },
                256: { bg: 'rgba(160,242,0,0.5)', color: '#272727' },
                512: { bg: 'rgba(160,242,0,0.65)', color: '#272727' },
                1024: { bg: 'rgba(249,40,65,0.75)', color: '#FEFEFF' },
                2048: { bg: 'rgba(89,100,242,0.85)', color: '#FEFEFF' },
            };
            if (styles[val]) return styles[val];
            return { bg: 'var(--primary-color)', color: '#272727' };
        }

        function init() {
            grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
            score = 0;
            won = false;
            lost = false;
            if (scoreEl) scoreEl.textContent = '0';
            if (statusEl) statusEl.textContent = '';
            addTile();
            addTile();
            render();
        }

        function addTile() {
            const empty = [];
            for (let r = 0; r < SIZE; r++)
                for (let c = 0; c < SIZE; c++)
                    if (grid[r][c] === 0) empty.push({ r, c });
            if (empty.length === 0) return;
            const spot = empty[Math.floor(Math.random() * empty.length)];
            grid[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4;
        }

        function render() {
            boardEl.innerHTML = '';
            for (let r = 0; r < SIZE; r++) {
                for (let c = 0; c < SIZE; c++) {
                    const tile = document.createElement('div');
                    tile.className = 'g2048-tile';
                    const val = grid[r][c];
                    if (val > 0) {
                        const style = getTileStyle(val);
                        tile.textContent = val;
                        tile.style.backgroundColor = style.bg;
                        tile.style.color = style.color;
                        tile.classList.add('g2048-filled');
                        if (val >= 128) tile.classList.add('g2048-big');
                    }
                    boardEl.appendChild(tile);
                }
            }
        }

        function slide(row) {
            const original = [...row];
            let arr = row.filter(v => v !== 0);
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] === arr[i + 1]) {
                    arr[i] *= 2;
                    score += arr[i];
                    arr.splice(i + 1, 1);
                    if (arr[i] === 2048 && !won) {
                        won = true;
                    }
                }
            }
            while (arr.length < SIZE) arr.push(0);

            // Check if positions changed vs original
            for (let i = 0; i < SIZE; i++) {
                if (arr[i] !== original[i]) moved = true;
            }
            return arr;
        }

        function move(direction) {
            if (lost) return;
            moved = false;

            if (direction === 'left') {
                for (let r = 0; r < SIZE; r++) grid[r] = slide(grid[r]);
            } else if (direction === 'right') {
                for (let r = 0; r < SIZE; r++) grid[r] = slide(grid[r].reverse()).reverse();
            } else if (direction === 'up') {
                for (let c = 0; c < SIZE; c++) {
                    let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
                    col = slide(col);
                    for (let r = 0; r < SIZE; r++) grid[r][c] = col[r];
                }
            } else if (direction === 'down') {
                for (let c = 0; c < SIZE; c++) {
                    let col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
                    col = slide(col);
                    for (let r = 0; r < SIZE; r++) grid[r][c] = col[SIZE - 1 - r];
                }
            }

            if (moved) {
                addTile();
                if (score > best) {
                    best = score;
                    localStorage.setItem('2048-best', best);
                    if (bestEl) bestEl.textContent = best;
                }
                if (scoreEl) scoreEl.textContent = score;
            }

            render();
            checkGameOver();
        }

        function checkGameOver() {
            if (won && statusEl) {
                statusEl.textContent = '🎉 You reached 2048!';
                won = false; // Allow continuing
            }
            // Check for possible moves
            for (let r = 0; r < SIZE; r++)
                for (let c = 0; c < SIZE; c++) {
                    if (grid[r][c] === 0) return;
                    if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return;
                    if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return;
                }
            lost = true;
            if (statusEl) statusEl.textContent = 'Game Over! No moves left.';
        }

        function onKey(e) {
            const container = document.getElementById('game-2048');
            if (!container || container.style.display === 'none') return;

            const map = {
                'ArrowLeft': 'left', 'ArrowRight': 'right',
                'ArrowUp': 'up', 'ArrowDown': 'down',
            };
            if (map[e.key]) {
                e.preventDefault();
                move(map[e.key]);
            }
        }

        // Touch support
        let touchStartX = 0, touchStartY = 0;
        function onTouchStart(e) {
            const container = document.getElementById('game-2048');
            if (!container || container.style.display === 'none') return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
        function onTouchEnd(e) {
            const container = document.getElementById('game-2048');
            if (!container || container.style.display === 'none') return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
            if (Math.abs(dx) > Math.abs(dy)) {
                move(dx > 0 ? 'right' : 'left');
            } else {
                move(dy > 0 ? 'down' : 'up');
            }
        }

        document.addEventListener('keydown', onKey);
        document.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchend', onTouchEnd, { passive: true });

        restartBtn.addEventListener('click', init);

        window.BoredGames.g2048Cleanup = function () {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchend', onTouchEnd);
        };

        init();
    };
})();
