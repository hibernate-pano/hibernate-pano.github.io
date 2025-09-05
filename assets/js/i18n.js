/**
 * Internationalization (i18n) System
 * Simple i18n implementation for static HTML websites
 */

class I18n {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.fallbackLanguage = 'en';
        this.storageKey = 'sophia-portfolio-language';

        // Initialize
        this.init();
    }

    async init() {
        // Load saved language preference
        const savedLanguage = localStorage.getItem(this.storageKey);
        if (savedLanguage && ['en', 'zh'].includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        } else {
            // Detect browser language
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang.startsWith('zh')) {
                this.currentLanguage = 'zh';
            }
        }

        // Load translations
        await this.loadTranslations();

        // Apply translations to current page
        this.translatePage();

        // Update language selector
        this.updateLanguageSelector();
    }

    async loadTranslations() {
        try {
            // Determine the correct base path
            const basePath = this.getBasePath();

            // Load current language
            const response = await fetch(`${basePath}assets/locales/${this.currentLanguage}.json`);
            if (response.ok) {
                this.translations[this.currentLanguage] = await response.json();
            }

            // Load fallback language if different
            if (this.currentLanguage !== this.fallbackLanguage) {
                const fallbackResponse = await fetch(`${basePath}assets/locales/${this.fallbackLanguage}.json`);
                if (fallbackResponse.ok) {
                    this.translations[this.fallbackLanguage] = await fallbackResponse.json();
                }
            }
        } catch (error) {
            console.error('Failed to load translations:', error);
        }
    }

    getBasePath() {
        const path = window.location.pathname;

        // For root path or index.html
        if (path === '/' || path.endsWith('/index.html') || path.endsWith('/')) {
            return './';
        }

        // Count directory depth
        const segments = path.split('/').filter(segment => segment && !segment.endsWith('.html'));
        const depth = segments.length - 1;

        if (depth <= 0) {
            return './';
        } else {
            return '../'.repeat(depth);
        }
    }

    t(key, params = {}) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];

        // Navigate through nested keys
        for (const k of keys) {
            if (translation && typeof translation === 'object' && k in translation) {
                translation = translation[k];
            } else {
                // Fallback to default language
                translation = this.translations[this.fallbackLanguage];
                for (const k of keys) {
                    if (translation && typeof translation === 'object' && k in translation) {
                        translation = translation[k];
                    } else {
                        return key; // Return key if translation not found
                    }
                }
                break;
            }
        }

        // Handle string interpolation
        if (typeof translation === 'string' && Object.keys(params).length > 0) {
            return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
                return params[param] || match;
            });
        }

        return translation || key;
    }

    async changeLanguage(language) {
        if (!['en', 'zh'].includes(language) || language === this.currentLanguage) {
            return;
        }

        this.currentLanguage = language;
        localStorage.setItem(this.storageKey, language);

        // Load new translations if not already loaded
        if (!this.translations[language]) {
            await this.loadTranslations();
        }

        // Re-translate the page
        this.translatePage();

        // Update language selector
        this.updateLanguageSelector();

        // Update document language attribute
        document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';

        // Update page title
        this.updatePageTitle();
    }

    translatePage() {
        // Translate elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate elements with data-i18n-html attribute (for HTML content)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.t(key);
            element.innerHTML = translation;
        });

        // Translate title and meta description
        this.updatePageTitle();
    }

    updatePageTitle() {
        const titleElement = document.querySelector('title');
        const titleKey = titleElement?.getAttribute('data-i18n');
        if (titleKey) {
            titleElement.textContent = this.t(titleKey);
        }

        const metaDescription = document.querySelector('meta[name="description"]');
        const descKey = metaDescription?.getAttribute('data-i18n');
        if (descKey) {
            metaDescription.setAttribute('content', this.t(descKey));
        }
    }

    updateLanguageSelector() {
        const languageButtons = document.querySelectorAll('.language-btn');
        languageButtons.forEach(btn => {
            const lang = btn.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return ['en', 'zh'];
    }
}

// Initialize i18n system
const i18n = new I18n();

// Export for global use
window.i18n = i18n;
