(function () {
    'use strict';

    window.BoredGames = window.BoredGames || {};

    window.BoredGames.initTicTacToe = function() {
        const board = document.getElementById('ttt-board');
        const status = document.getElementById('ttt-status');
        const restartBtn = document.getElementById('ttt-restart');
        if (!board) return;

        let cells = Array(9).fill(null);
        let playerTurn = true;
        let active = true;

        const WINS = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        function render() {
            board.innerHTML = '';
            cells.forEach((val, i) => {
                const cell = document.createElement('div');
                cell.className = 'ttt-cell';
                cell.dataset.index = i;
                if (val) {
                    cell.textContent = val;
                    cell.classList.add(val === 'X' ? 'ttt-x' : 'ttt-o');
                }
                cell.addEventListener('click', () => handleClick(i));
                board.appendChild(cell);
            });
        }

        function checkWin(p) {
            return WINS.find(c => c.every(i => cells[i] === p));
        }

        function isFull() {
            return cells.every(c => c !== null);
        }

        function handleClick(i) {
            if (!active || !playerTurn || cells[i]) return;
            cells[i] = 'X';
            playerTurn = false;

            const win = checkWin('X');
            if (win) {
                active = false;
                render();
                highlightWin(win);
                status.textContent = 'You win! 🎉';
                return;
            }
            if (isFull()) {
                active = false;
                render();
                status.textContent = "It's a draw!";
                return;
            }

            render();
            status.textContent = 'AI thinking...';

            setTimeout(() => {
                aiMove();
                render();

                const aiWin = checkWin('O');
                if (aiWin) {
                    active = false;
                    highlightWin(aiWin);
                    status.textContent = 'AI wins! 🤖';
                    return;
                }
                if (isFull()) {
                    active = false;
                    status.textContent = "It's a draw!";
                    return;
                }

                playerTurn = true;
                status.textContent = 'Your turn (X)';
            }, 350);
        }

        function aiMove() {
            // Try to win
            for (let i = 0; i < 9; i++) {
                if (!cells[i]) { cells[i] = 'O'; if (checkWin('O')) return; cells[i] = null; }
            }
            // Try to block
            for (let i = 0; i < 9; i++) {
                if (!cells[i]) { cells[i] = 'X'; if (checkWin('X')) { cells[i] = 'O'; return; } cells[i] = null; }
            }
            // Center
            if (!cells[4]) { cells[4] = 'O'; return; }
            // Corners
            const corners = [0, 2, 6, 8].filter(i => !cells[i]);
            if (corners.length) { cells[corners[Math.floor(Math.random() * corners.length)]] = 'O'; return; }
            // Edges
            const edges = [1, 3, 5, 7].filter(i => !cells[i]);
            if (edges.length) { cells[edges[Math.floor(Math.random() * edges.length)]] = 'O'; }
        }

        function highlightWin(combo) {
            combo.forEach(i => {
                if (board.children[i]) board.children[i].classList.add('ttt-win');
            });
        }

        function restart() {
            cells = Array(9).fill(null);
            playerTurn = true;
            active = true;
            status.textContent = 'Your turn (X)';
            render();
        }

        restartBtn.addEventListener('click', restart);
        restart();
    };
})();
