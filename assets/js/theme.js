/**
 * Theme Manager for Sophia Chen Portfolio
 * Handles light/dark theme switching with persistence
 */

class ThemeManager {
    constructor() {
        this.storageKey = 'sophia-portfolio-theme';
        this.currentTheme = 'dark'; // default theme
        this.themeButton = null;

        this.init();
    }

    /**
     * Initialize theme manager
     */
    init() {
        // Load saved theme or detect system preference
        this.loadTheme();

        // Apply theme immediately
        this.applyTheme();

        // Set up theme button when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupThemeButton());
        } else {
            this.setupThemeButton();
        }

        // Listen for system theme changes
        this.setupSystemThemeListener();
    }

    /**
     * Load theme from localStorage or detect system preference
     */
    loadTheme() {
        const savedTheme = localStorage.getItem(this.storageKey);

        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            // Detect system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                this.currentTheme = 'light';
            } else {
                this.currentTheme = 'dark';
            }
        }
    }

    /**
     * Apply current theme to the document
     */
    applyTheme() {
        const body = document.body;

        if (this.currentTheme === 'light') {
            body.classList.add('light-theme');
        } else {
            body.classList.remove('light-theme');
        }

        // Update theme button icon if it exists
        this.updateThemeButtonIcon();

        // Dispatch theme change event
        this.dispatchThemeChangeEvent();
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.saveTheme();
        this.applyTheme();
    }

    /**
     * Set specific theme
     * @param {string} theme - 'light' or 'dark'
     */
    setTheme(theme) {
        if (!['light', 'dark'].includes(theme)) {
            console.warn('Invalid theme:', theme);
            return;
        }

        this.currentTheme = theme;
        this.saveTheme();
        this.applyTheme();
    }

    /**
     * Save current theme to localStorage
     */
    saveTheme() {
        localStorage.setItem(this.storageKey, this.currentTheme);
    }

    /**
     * Get current theme
     * @returns {string} Current theme ('light' or 'dark')
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Setup theme toggle button
     */
    setupThemeButton() {
        this.themeButton = document.querySelector('.theme-toggle-button');

        if (this.themeButton) {
            this.themeButton.addEventListener('click', () => this.toggleTheme());
            this.updateThemeButtonIcon();
        }
    }

    /**
     * Update theme button icon based on current theme
     */
    updateThemeButtonIcon() {
        if (!this.themeButton) return;

        const icon = this.themeButton.querySelector('.material-symbols-outlined');
        if (icon) {
            icon.textContent = this.currentTheme === 'light' ? 'dark_mode' : 'light_mode';
        }

        // Update aria-label for accessibility
        this.themeButton.setAttribute('aria-label',
            this.currentTheme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
        );
    }

    /**
     * Setup system theme change listener
     */
    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                const savedTheme = localStorage.getItem(this.storageKey);
                if (!savedTheme) {
                    this.currentTheme = e.matches ? 'light' : 'dark';
                    this.applyTheme();
                }
            });
        }
    }

    /**
     * Dispatch custom theme change event
     */
    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: this.currentTheme,
                isLight: this.currentTheme === 'light'
            }
        });

        document.dispatchEvent(event);

        // Update third-party components
        this.updateThirdPartyComponents();
    }

    /**
     * Update third-party components for theme changes
     */
    updateThirdPartyComponents() {
        // Update Prism.js theme
        this.updatePrismTheme();
    }

    /**
     * Update Prism.js code highlighting theme
     */
    updatePrismTheme() {
        const prismLink = document.querySelector('link[href*="prism"]');
        if (prismLink) {
            const baseUrl = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/';
            const lightTheme = 'prism.min.css';
            const darkTheme = 'prism-tomorrow.min.css';

            const newTheme = this.currentTheme === 'light' ? lightTheme : darkTheme;
            prismLink.href = baseUrl + newTheme;
        }
    }

    /**
     * Add theme change listener
     * @param {Function} callback - Callback function to execute on theme change
     */
    onThemeChange(callback) {
        document.addEventListener('themechange', callback);
    }

    /**
     * Remove theme change listener
     * @param {Function} callback - Callback function to remove
     */
    offThemeChange(callback) {
        document.removeEventListener('themechange', callback);
    }
}

// Create global theme manager instance
window.themeManager = new ThemeManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}
