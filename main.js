// --- Configuration ---
const CONFIG = {
    apiEndpoint: '/api', // Example config variable
};

class AppLogic {
    constructor() {
        // Load components first, then init router and events
        this.loadcomponents().then(() => {
            this.initRouter();

            // Set dynamic year in footer
            const yearSpan = document.getElementById('current-year');
            if (yearSpan) yearSpan.textContent = new Date().getFullYear();

            // Initialize global pixel effects (particles + trail)
            if (window.PixelEffects) {
                window.PixelEffects.initGlobal();
            }
        });
    }

    async loadcomponents() {
        try {
            // Fetch Header
            const headerRes = await fetch('./components/header.html');
            if (headerRes.ok) {
                const headerHtml = await headerRes.text();
                const headerPlaceholder = document.getElementById('header-placeholder');
                if (headerPlaceholder) headerPlaceholder.outerHTML = headerHtml;
            }

            // Fetch Footer
            const footerRes = await fetch('./components/footer.html');
            if (footerRes.ok) {
                const footerHtml = await footerRes.text();
                const footerPlaceholder = document.getElementById('footer-placeholder');
                if (footerPlaceholder) footerPlaceholder.outerHTML = footerHtml;
            }
        } catch (error) {
            console.error('Failed to load components:', error);
        }
    }

    // --- Router Logic ---
    initRouter() {
        window.addEventListener('hashchange', () => this.handleRoute());
        // Handle initial load
        this.handleRoute();
    }

    async handleRoute() {
        let hash = window.location.hash.substring(1) || 'aboutme';

        // Map hashes to filenames and themes
        const routes = {
            'aboutme': { file: 'AboutMe.html', color: '#F92841' },
            'bored': { file: 'Bored.html', color: '#5964F2' },
            'mywork': { file: 'MyWork.html', color: '#A0F200' }
        };

        const currentRoute = routes[hash] || routes['aboutme'];

        try {
            const contentArea = document.getElementById('content-area');
            if (!contentArea) return;

            // Fade out
            contentArea.style.opacity = '0';

            // Update Theme Color dynamically
            document.documentElement.style.setProperty('--primary-color', currentRoute.color);

            // Update active link in navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${hash}`) {
                    link.classList.add('active');
                }
            });

            // Make sure logo goes to home correctly by marking it active or not
            if (hash === 'aboutme') {
                const logo = document.querySelector('.logo');
                if (logo) logo.classList.add('active');
            }

            const response = await fetch(`./pages/${currentRoute.file}`);
            if (response.ok) {
                const html = await response.text();
                // Wait for fade out, then inject HTML and fade in
                setTimeout(() => {
                    contentArea.innerHTML = html;
                    contentArea.style.opacity = '1';

                    // Initialize scroll reveal animations
                    const revealElements = document.querySelectorAll('.reveal');
                    if (revealElements.length > 0) {
                        const revealObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry, index) => {
                                if (entry.isIntersecting) {
                                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                                    entry.target.classList.add('revealed');
                                    revealObserver.unobserve(entry.target);
                                }
                            });
                        }, { threshold: 0.1 });
                        
                        revealElements.forEach(el => revealObserver.observe(el));
                    }

                    // Initialize page-specific pixel doodles
                    if (window.PixelEffects) {
                        window.PixelEffects.initPage();
                    }
                }, 200);
            } else {
                contentArea.innerHTML = '<div style="text-align: center; margin-top: 4rem;"><h2>404 - Page Not Found</h2></div>';
                contentArea.style.opacity = '1';
            }
        } catch (error) {
            console.error('Error loading page:', error);
        }
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AppLogic();
    console.log("App initialized with config:", CONFIG);
});
