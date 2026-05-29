// ============================================
// pixels.js — Retro pixel effects engine
// ============================================

(function () {
    'use strict';

    // --- 1. FLOATING PIXEL PARTICLES (Canvas) ---
    function initPixelParticles() {
        const canvas = document.getElementById('pixel-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        const PARTICLE_COUNT = 35;
        const PIXEL_SIZE_MIN = 2;
        const PIXEL_SIZE_MAX = 5;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function getThemeColor() {
            const hex = getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color').trim();
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        }

        function createParticle() {
            const size = Math.floor(Math.random() * (PIXEL_SIZE_MAX - PIXEL_SIZE_MIN + 1)) + PIXEL_SIZE_MIN;
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + size,
                size: size,
                speedY: 0.2 + Math.random() * 0.6,
                speedX: (Math.random() - 0.5) * 0.3,
                opacity: 0.1 + Math.random() * 0.3,
                fadeSpeed: 0.0005 + Math.random() * 0.001,
            };
        }

        function init() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const p = createParticle();
                p.y = Math.random() * canvas.height;
                particles.push(p);
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const color = getThemeColor();

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.y -= p.speedY;
                p.x += p.speedX;

                if (p.y < -p.size || p.x < -p.size || p.x > canvas.width + p.size) {
                    particles[i] = createParticle();
                    continue;
                }

                p.opacity += p.fadeSpeed;
                if (p.opacity > 0.4 || p.opacity < 0.05) {
                    p.fadeSpeed *= -1;
                }

                ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${Math.max(0, p.opacity)})`;
                ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
            }

            requestAnimationFrame(animate);
        }

        resize();
        window.addEventListener('resize', resize);
        init();
        animate();
    }

    // --- 2. MOUSE PIXEL TRAIL ---
    function initPixelTrail() {
        const trail = [];
        const MAX_TRAIL = 12;
        let lastSpawn = 0;

        function getThemeHex() {
            return getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color').trim();
        }

        function spawnPixel(x, y) {
            const el = document.createElement('div');
            el.className = 'pixel-trail';
            const size = 3 + Math.floor(Math.random() * 4);
            el.style.width = size + 'px';
            el.style.height = size + 'px';
            el.style.left = (x - size / 2 + (Math.random() - 0.5) * 10) + 'px';
            el.style.top = (y - size / 2 + (Math.random() - 0.5) * 10) + 'px';
            el.style.backgroundColor = getThemeHex();
            document.body.appendChild(el);

            trail.push(el);
            if (trail.length > MAX_TRAIL) {
                const old = trail.shift();
                if (old.parentNode) old.parentNode.removeChild(old);
            }

            setTimeout(() => {
                if (el.parentNode) el.parentNode.removeChild(el);
                const idx = trail.indexOf(el);
                if (idx > -1) trail.splice(idx, 1);
            }, 600);
        }

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastSpawn > 40) {
                spawnPixel(e.clientX, e.clientY);
                lastSpawn = now;
            }
        });
    }

    // --- 3. PIXEL CRAB CHARACTER ---
    function initPixelCrab() {
        const header = document.querySelector('header');
        if (!header || document.getElementById('crab-canvas')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'crab-canvas';
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;image-rendering:pixelated;';
        header.style.position = 'sticky';
        header.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        const S = 3; // pixel scale: each crab "pixel" = 3x3 screen pixels

        // Crab state
        let crabX = 200;
        let dir = 1;           // 1 = walking right, -1 = walking left
        let speed = 0.4;
        let tick = 0;

        // Animation timers
        let blinkCD = randInt(150, 300);
        let blinkDur = 0;
        let isBlinking = false;

        let waveCD = randInt(200, 400);
        let waveDur = 0;
        let isWaving = false;

        let idleCD = randInt(300, 600);
        let idleDur = 0;
        let isIdle = false;

        // Mouse scare
        let mouseX = -1000;
        let mouseY = -1000;
        let scared = false;
        let scareSpeed = 0;

        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        function resize() {
            canvas.width = header.offsetWidth;
            canvas.height = header.offsetHeight;
        }

        function getColor() {
            return getComputedStyle(document.documentElement)
                .getPropertyValue('--primary-color').trim();
        }

        // Track mouse position over header
        header.addEventListener('mousemove', (e) => {
            const rect = header.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });
        header.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });

        function drawCrab() {
            const color = getColor();
            const eyeColor = isBlinking ? color : '#FEFEFF';
            const legFrame = Math.floor(tick / 10) % 2;
            const waveUp = isWaving ? Math.floor(waveDur / 6) % 2 : 0;
            const flip = dir === -1;

            const crabW = 14;
            const crabH = 10; // total rows used by crab body
            const oy = canvas.height - crabH * S; // sit on the bottom border
            const ox = Math.floor(crabX);

            // Draw a single crab pixel
            function p(cx, cy, c) {
                const fx = flip ? (crabW - 1 - cx) : cx;
                ctx.fillStyle = c || color;
                ctx.fillRect(ox + fx * S, oy + cy * S, S, S);
            }

            // ===== CRAB BODY =====

            // Eye stalks (row 0)
            p(4, 0); p(9, 0);

            // Eyes (row 1) — blink!
            p(4, 1, eyeColor); p(9, 1, eyeColor);
            // Pupils (tiny dark dot inside eye when open)
            if (!isBlinking) {
                p(4, 1, '#272727');
                // Draw eye whites around pupil using a slightly larger area
                ctx.fillStyle = '#FEFEFF';
                ctx.fillRect(ox + (flip ? (crabW - 1 - 4) : 4) * S - 1, oy + 1 * S - 1, S + 2, S + 2);
                ctx.fillStyle = '#272727';
                ctx.fillRect(ox + (flip ? (crabW - 1 - 4) : 4) * S + 1, oy + 1 * S + 1, S - 2, S - 2);

                ctx.fillStyle = '#FEFEFF';
                ctx.fillRect(ox + (flip ? (crabW - 1 - 9) : 9) * S - 1, oy + 1 * S - 1, S + 2, S + 2);
                ctx.fillStyle = '#272727';
                ctx.fillRect(ox + (flip ? (crabW - 1 - 9) : 9) * S + 1, oy + 1 * S + 1, S - 2, S - 2);
            }

            // Head (row 2-3)
            for (let i = 3; i <= 10; i++) p(i, 2);
            for (let i = 2; i <= 11; i++) p(i, 3);

            // Claws (rows 4-5) — wave animation shifts them up
            const clawY = waveUp ? -1 : 0;
            // Left claw (pincer shape)
            p(0, 3 + clawY); p(1, 3 + clawY);
            p(0, 4 + clawY); p(1, 4 + clawY);
            p(1, 5 + clawY);
            // Right claw
            p(12, 3 + clawY); p(13, 3 + clawY);
            p(12, 4 + clawY); p(13, 4 + clawY);
            p(12, 5 + clawY);

            // Body (rows 4-7)
            for (let i = 2; i <= 11; i++) p(i, 4);
            for (let i = 2; i <= 11; i++) p(i, 5);
            for (let i = 3; i <= 10; i++) p(i, 6);
            for (let i = 4; i <= 9; i++) p(i, 7);

            // Shell detail — slightly lighter center
            const hex = color;
            const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 30);
            const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 30);
            const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 30);
            const highlight = `rgb(${r},${g},${b})`;
            p(5, 5, highlight); p(6, 5, highlight); p(7, 5, highlight); p(8, 5, highlight);
            p(6, 6, highlight); p(7, 6, highlight);

            // Legs (rows 8-9) — walk animation
            if (isIdle || legFrame === 0) {
                p(3, 8); p(5, 8); p(8, 8); p(10, 8);
                p(2, 9); p(6, 9); p(7, 9); p(11, 9);
            } else {
                p(2, 8); p(6, 8); p(7, 8); p(11, 8);
                p(3, 9); p(5, 9); p(8, 9); p(10, 9);
            }

            // Mouth (row 7 center — cute little smile)
            p(6, 7, '#272727'); p(7, 7, '#272727');
        }

        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            tick++;

            const crabW = 14 * S;
            const crabCenterX = crabX + crabW / 2;
            const crabCenterY = canvas.height - 5 * S; // bottom position

            // --- Mouse scare detection ---
            const dx = mouseX - crabCenterX;
            const dy = mouseY - crabCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 80) {
                scared = true;
                scareSpeed = 2.5;
                // Run away from mouse
                dir = dx > 0 ? -1 : 1;
                isIdle = false;
                idleDur = 0;
            } else if (dist < 150) {
                scared = true;
                scareSpeed = 1.5;
                dir = dx > 0 ? -1 : 1;
            } else {
                if (scared) {
                    scareSpeed *= 0.95;
                    if (scareSpeed < 0.5) {
                        scared = false;
                        scareSpeed = 0;
                    }
                }
            }

            // --- Idle behavior ---
            if (!scared) {
                idleCD--;
                if (idleCD <= 0 && !isIdle) {
                    isIdle = true;
                    idleDur = randInt(60, 150);
                    // Start waving when idle
                    isWaving = true;
                    waveDur = 0;
                    waveCD = idleDur;
                }
                if (isIdle) {
                    idleDur--;
                    if (idleDur <= 0) {
                        isIdle = false;
                        isWaving = false;
                        idleCD = randInt(300, 600);
                        // Maybe change direction after idle
                        if (Math.random() > 0.5) dir *= -1;
                    }
                }
            }

            // --- Movement ---
            if (!isIdle) {
                const moveSpeed = scared ? scareSpeed : speed;
                crabX += dir * moveSpeed;
            }

            // Boundary bouncing — full header width
            const maxX = canvas.width - crabW;
            const minX = 0;
            if (crabX > maxX) { crabX = maxX; dir = -1; }
            if (crabX < minX) { crabX = minX; dir = 1; }

            // --- Blink timer ---
            blinkCD--;
            if (blinkCD <= 0) {
                isBlinking = true;
                blinkDur++;
                if (blinkDur > 8) {
                    isBlinking = false;
                    blinkDur = 0;
                    blinkCD = randInt(120, 280);
                }
            }

            // --- Wave timer (independent of idle) ---
            if (!isIdle) {
                waveCD--;
                if (waveCD <= 0 && !isWaving) {
                    isWaving = true;
                    waveDur = 0;
                }
                if (isWaving) {
                    waveDur++;
                    if (waveDur > 30) {
                        isWaving = false;
                        waveDur = 0;
                        waveCD = randInt(180, 400);
                    }
                }
            } else if (isWaving) {
                waveDur++;
            }

            // Scared = fast blink
            if (scared && tick % 6 < 3) {
                isBlinking = true;
            }

            drawCrab();
            requestAnimationFrame(update);
        }

        resize();
        window.addEventListener('resize', resize);
        update();
    }

    // --- 4. DYNAMIC CURSOR COLOR ---
    function updateCursorColor() {
        const hex = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color').trim();
        const encoded = hex.replace('#', '%23');

        const pointerSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect x='8' y='0' width='4' height='4' fill='${encoded}'/%3E%3Crect x='8' y='4' width='4' height='4' fill='${encoded}'/%3E%3Crect x='8' y='8' width='4' height='4' fill='${encoded}'/%3E%3Crect x='0' y='12' width='4' height='4' fill='${encoded}'/%3E%3Crect x='4' y='8' width='4' height='4' fill='${encoded}'/%3E%3Crect x='4' y='12' width='4' height='4' fill='${encoded}'/%3E%3Crect x='8' y='12' width='4' height='4' fill='%23FEFEFF'/%3E%3Crect x='12' y='8' width='4' height='4' fill='${encoded}'/%3E%3Crect x='12' y='12' width='4' height='4' fill='%23FEFEFF'/%3E%3Crect x='16' y='8' width='4' height='4' fill='${encoded}'/%3E%3Crect x='16' y='12' width='4' height='4' fill='%23FEFEFF'/%3E%3Crect x='0' y='16' width='4' height='4' fill='${encoded}'/%3E%3Crect x='4' y='16' width='4' height='4' fill='${encoded}'/%3E%3Crect x='8' y='16' width='4' height='4' fill='%23FEFEFF'/%3E%3Crect x='12' y='16' width='4' height='4' fill='%23FEFEFF'/%3E%3Crect x='16' y='16' width='4' height='4' fill='${encoded}'/%3E%3Crect x='4' y='20' width='4' height='4' fill='${encoded}'/%3E%3Crect x='8' y='20' width='4' height='4' fill='${encoded}'/%3E%3Crect x='12' y='20' width='4' height='4' fill='${encoded}'/%3E%3Crect x='16' y='20' width='4' height='4' fill='${encoded}'/%3E%3C/svg%3E") 6 0, pointer`;

        const selectors = 'a, button, .tag, .hero-tag, .tech-logo-wrapper, .nav-links a, .logo';
        document.querySelectorAll(selectors).forEach(el => {
            el.style.cursor = pointerSvg;
        });
    }

    // --- INITIALIZATION ---
    window.PixelEffects = {
        initParticles: initPixelParticles,
        initTrail: initPixelTrail,
        initCrab: initPixelCrab,
        updateCursor: updateCursorColor,

        // Call once on app load (particles + trail + crab are global)
        initGlobal: function () {
            initPixelParticles();
            initPixelTrail();
            initPixelCrab();
        },

        // Call after each page load (cursor update)
        initPage: function () {
            updateCursorColor();
        }
    };
})();
