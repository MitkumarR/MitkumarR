(function () {
    'use strict';

    window.BoredGames = window.BoredGames || {};

    window.BoredGames.initTypingTest = function() {
        const textEl = document.getElementById('typing-text');
        const input = document.getElementById('typing-input');
        const timeEl = document.getElementById('typing-time');
        const wpmEl = document.getElementById('typing-wpm');
        const accEl = document.getElementById('typing-accuracy');
        const restartBtn = document.getElementById('typing-restart');
        if (!textEl || !input) return;

        const sentences = [
            "the quick brown fox jumps over the lazy dog near the river bank",
            "docker containers provide isolated environments for running applications",
            "python is a versatile programming language used in web development",
            "linux systems offer powerful command line tools for automation tasks",
            "cybersecurity involves protecting systems from digital attacks and threats",
            "git version control helps developers collaborate on software projects",
            "cloud computing enables scalable and reliable deployment of services",
            "backend development focuses on server logic and database management",
            "microservices architecture breaks applications into smaller components",
            "continuous integration automates testing and deployment pipelines",
            "encryption algorithms protect sensitive data during network transmission",
            "database indexing significantly improves query performance at scale",
            "load balancing distributes traffic across multiple server instances",
            "api design patterns help build maintainable and scalable services",
            "open source software drives innovation across the technology industry",
        ];

        let currentText = '';
        let startTime = null;
        let timerInterval = null;
        let finished = false;

        function pickText() {
            const shuffled = [...sentences].sort(() => Math.random() - 0.5);
            currentText = shuffled.slice(0, 2).join(' ');
        }

        function renderText() {
            const typed = input.value;
            let html = '';
            for (let i = 0; i < currentText.length; i++) {
                const ch = currentText[i] === ' ' ? '&nbsp;' : currentText[i];
                if (i < typed.length) {
                    html += typed[i] === currentText[i]
                        ? `<span class="typing-correct">${ch}</span>`
                        : `<span class="typing-wrong">${ch}</span>`;
                } else if (i === typed.length) {
                    html += `<span class="typing-cursor-char">${ch}</span>`;
                } else {
                    html += `<span class="typing-pending">${ch}</span>`;
                }
            }
            textEl.innerHTML = html;
        }

        function updateStats() {
            const typed = input.value;
            let correct = 0;
            for (let i = 0; i < typed.length; i++) {
                if (typed[i] === currentText[i]) correct++;
            }
            if (typed.length > 0) {
                accEl.textContent = Math.round((correct / typed.length) * 100);
            }

            if (startTime) {
                const mins = (Date.now() - startTime) / 60000;
                if (mins > 0) {
                    const words = typed.trim().split(/\s+/).filter(w => w).length;
                    wpmEl.textContent = Math.round(words / mins) || 0;
                }
            }
        }

        function startTimer() {
            startTime = Date.now();
            timerInterval = setInterval(() => {
                timeEl.textContent = Math.floor((Date.now() - startTime) / 1000);
                updateStats();
            }, 500);
        }

        function finish() {
            finished = true;
            clearInterval(timerInterval);
            input.disabled = true;

            const mins = (Date.now() - startTime) / 60000;
            const words = currentText.trim().split(/\s+/).length;
            wpmEl.textContent = Math.round(words / mins);
            updateStats();

            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            timeEl.textContent = elapsed;
        }

        function reset() {
            clearInterval(timerInterval);
            finished = false;
            startTime = null;
            input.value = '';
            input.disabled = false;
            timeEl.textContent = '0';
            wpmEl.textContent = '0';
            accEl.textContent = '100';
            pickText();
            renderText();
            input.focus();
        }

        input.addEventListener('input', () => {
            if (!startTime && input.value.length === 1) startTimer();
            renderText();
            updateStats();
            if (input.value.length >= currentText.length) finish();
        });

        input.addEventListener('paste', e => e.preventDefault());
        restartBtn.addEventListener('click', reset);

        reset();
    };
})();
