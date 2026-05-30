// ============================================
// minesweeper.js — Retro Minesweeper game
// ============================================

(function () {
    'use strict';

    window.BoredGames = window.BoredGames || {};

    window.BoredGames.mineCleanup = null;

    window.BoredGames.initMinesweeper = function () {
        if (window.BoredGames.mineCleanup) window.BoredGames.mineCleanup();

        const boardEl = document.getElementById('mine-board');
        const statusEl = document.getElementById('mine-status');
        const mineCountEl = document.getElementById('mine-count');
        const restartBtn = document.getElementById('mine-restart');
        if (!boardEl) return;

        const ROWS = 9;
        const COLS = 9;
        const MINES = 10;

        let grid, revealed, flagged, mineLocations, gameOver, firstClick, flagCount;

        function init() {
            grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
            revealed = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
            flagged = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
            mineLocations = new Set();
            gameOver = false;
            firstClick = true;
            flagCount = 0;
            if (statusEl) statusEl.textContent = 'Click to start. Right-click to flag.';
            if (mineCountEl) mineCountEl.textContent = MINES;
            render();
        }

        function placeMines(safeR, safeC) {
            while (mineLocations.size < MINES) {
                const r = Math.floor(Math.random() * ROWS);
                const c = Math.floor(Math.random() * COLS);
                // Keep safe zone around first click
                if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
                const key = `${r},${c}`;
                if (!mineLocations.has(key)) {
                    mineLocations.add(key);
                    grid[r][c] = -1;
                }
            }
            // Calculate numbers
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (grid[r][c] === -1) continue;
                    let count = 0;
                    for (let dr = -1; dr <= 1; dr++)
                        for (let dc = -1; dc <= 1; dc++) {
                            const nr = r + dr, nc = c + dc;
                            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && grid[nr][nc] === -1) count++;
                        }
                    grid[r][c] = count;
                }
            }
        }

        function getNumberColor(num) {
            const colors = {
                1: '#5964F2', 2: '#A0F200', 3: '#F92841', 4: '#9b59b6',
                5: '#e67e22', 6: '#1abc9c', 7: '#FEFEFF', 8: 'rgba(254,254,255,0.5)'
            };
            return colors[num] || '#FEFEFF';
        }

        function render() {
            boardEl.innerHTML = '';
            boardEl.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const cell = document.createElement('div');
                    cell.className = 'mine-cell';
                    cell.dataset.row = r;
                    cell.dataset.col = c;

                    if (revealed[r][c]) {
                        cell.classList.add('mine-revealed');
                        if (grid[r][c] === -1) {
                            cell.textContent = '💣';
                            cell.classList.add('mine-bomb');
                        } else if (grid[r][c] > 0) {
                            cell.textContent = grid[r][c];
                            cell.style.color = getNumberColor(grid[r][c]);
                        }
                    } else {
                        if (flagged[r][c]) {
                            cell.textContent = '🚩';
                            cell.classList.add('mine-flagged');
                        }
                        cell.addEventListener('click', () => handleClick(r, c));
                        cell.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            handleFlag(r, c);
                        });
                    }
                    boardEl.appendChild(cell);
                }
            }
        }

        function handleClick(r, c) {
            if (gameOver || flagged[r][c]) return;
            if (firstClick) {
                placeMines(r, c);
                firstClick = false;
                if (statusEl) statusEl.textContent = 'Game on! 💣';
            }
            if (grid[r][c] === -1) {
                // Hit a mine
                revealAll();
                gameOver = true;
                if (statusEl) statusEl.textContent = '💥 BOOM! Game over.';
                render();
                return;
            }
            reveal(r, c);
            render();
            checkWin();
        }

        function handleFlag(r, c) {
            if (gameOver || revealed[r][c]) return;
            flagged[r][c] = !flagged[r][c];
            flagCount += flagged[r][c] ? 1 : -1;
            if (mineCountEl) mineCountEl.textContent = MINES - flagCount;
            render();
        }

        function reveal(r, c) {
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
            if (revealed[r][c] || flagged[r][c]) return;
            revealed[r][c] = true;
            if (grid[r][c] === 0) {
                // Flood fill empty cells
                for (let dr = -1; dr <= 1; dr++)
                    for (let dc = -1; dc <= 1; dc++)
                        reveal(r + dr, c + dc);
            }
        }

        function revealAll() {
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS; c++)
                    revealed[r][c] = true;
        }

        function checkWin() {
            let unrevealedSafe = 0;
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS; c++)
                    if (!revealed[r][c] && grid[r][c] !== -1) unrevealedSafe++;
            if (unrevealedSafe === 0) {
                gameOver = true;
                if (statusEl) statusEl.textContent = '🎉 You win! All mines cleared!';
            }
        }

        restartBtn.addEventListener('click', init);

        window.BoredGames.mineCleanup = function () {
            // No global listeners to clean up
        };

        init();
    };
})();
