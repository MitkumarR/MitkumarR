(function () {
    'use strict';

    window.BoredGames = window.BoredGames || {};

    window.BoredGames.snakeCleanup = null;

    window.BoredGames.initSnake = function() {
        // Cleanup previous instance
        if (window.BoredGames.snakeCleanup) window.BoredGames.snakeCleanup();

        const canvas = document.getElementById('snake-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const CELL = 20;
        const COLS = canvas.width / CELL;
        const ROWS = canvas.height / CELL;

        let snake, food, dir, nextDir, score, best, gameLoop, running, dead;

        best = parseInt(localStorage.getItem('snake-best') || '0');
        const bestEl = document.getElementById('snake-best');
        if (bestEl) bestEl.textContent = best;

        function reset() {
            snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
            dir = { x: 1, y: 0 };
            nextDir = { x: 1, y: 0 };
            score = 0;
            dead = false;
            running = false;
            if (gameLoop) clearInterval(gameLoop);
            const scoreEl = document.getElementById('snake-score');
            if (scoreEl) scoreEl.textContent = '0';
            placeFood();
            draw();
        }

        function placeFood() {
            do {
                food = {
                    x: Math.floor(Math.random() * COLS),
                    y: Math.floor(Math.random() * ROWS)
                };
            } while (snake.some(s => s.x === food.x && s.y === food.y));
        }

        function draw() {
            const color = window.BoredGames.utils.getThemeColor();
            const rgb = window.BoredGames.utils.hexToRgb(color);

            // Background
            ctx.fillStyle = '#0D0D0D';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Subtle grid
            ctx.strokeStyle = 'rgba(254,254,255,0.03)';
            ctx.lineWidth = 1;
            for (let i = 0; i <= COLS; i++) {
                ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
            }
            for (let i = 0; i <= ROWS; i++) {
                ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
            }

            // Food (pulsing glow)
            const pulse = 0.6 + Math.sin(Date.now() / 200) * 0.4;
            ctx.shadowColor = color;
            ctx.shadowBlur = 8 * pulse;
            ctx.fillStyle = '#FEFEFF';
            ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
            ctx.shadowBlur = 0;

            // Snake
            snake.forEach((seg, i) => {
                const alpha = 1 - (i / snake.length) * 0.6;
                ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
                ctx.fillRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2);
            });

            // Overlays
            if (dead) {
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.textAlign = 'center';
                ctx.fillStyle = color;
                ctx.font = 'bold 28px "Silkscreen", monospace';
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 15);
                ctx.fillStyle = 'rgba(254,254,255,0.6)';
                ctx.font = '14px "Inter", sans-serif';
                ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 15);
                ctx.fillText('Press Space to retry', canvas.width / 2, canvas.height / 2 + 40);
            } else if (!running) {
                ctx.fillStyle = 'rgba(0,0,0,0.55)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.textAlign = 'center';
                ctx.fillStyle = color;
                ctx.font = 'bold 20px "Silkscreen", monospace';
                ctx.fillText('SNAKE', canvas.width / 2, canvas.height / 2 - 15);
                ctx.fillStyle = 'rgba(254,254,255,0.6)';
                ctx.font = '14px "Inter", sans-serif';
                ctx.fillText('Press Space to start', canvas.width / 2, canvas.height / 2 + 15);
            }
        }

        function step() {
            dir = nextDir;
            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

            // Wall or self collision
            if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
                snake.some(s => s.x === head.x && s.y === head.y)) {
                dead = true;
                running = false;
                clearInterval(gameLoop);
                if (score > best) {
                    best = score;
                    localStorage.setItem('snake-best', best);
                    const bestEl = document.getElementById('snake-best');
                    if (bestEl) bestEl.textContent = best;
                }
                draw();
                return;
            }

            snake.unshift(head);

            if (head.x === food.x && head.y === food.y) {
                score++;
                const scoreEl = document.getElementById('snake-score');
                if (scoreEl) scoreEl.textContent = score;
                placeFood();
            } else {
                snake.pop();
            }

            draw();
        }

        function onKey(e) {
            // Only respond if snake game is visible
            const container = document.getElementById('game-snake');
            if (!container || container.style.display === 'none') return;

            if (e.code === 'Space') {
                e.preventDefault();
                if (dead || !running) {
                    reset();
                    running = true;
                    gameLoop = setInterval(step, 110);
                }
                return;
            }

            const map = {
                'ArrowUp': { x: 0, y: -1 }, 'ArrowDown': { x: 0, y: 1 },
                'ArrowLeft': { x: -1, y: 0 }, 'ArrowRight': { x: 1, y: 0 },
            };
            if (map[e.key]) {
                e.preventDefault();
                const nd = map[e.key];
                if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
            }
        }

        document.addEventListener('keydown', onKey);

        window.BoredGames.snakeCleanup = function () {
            document.removeEventListener('keydown', onKey);
            if (gameLoop) clearInterval(gameLoop);
        };

        reset();
    };
})();
