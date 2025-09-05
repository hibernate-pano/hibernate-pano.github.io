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
        this.isLoading = false;
        this.isInitialized = false;
        this.loadingPromise = null;
        this.languageButtons = [];

        // Bind methods to preserve context
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
        this.handleDOMContentLoaded = this.handleDOMContentLoaded.bind(this);

        // Initialize
        this.init();
    }

    async init() {
        if (this.isInitialized || this.isLoading) {
            return this.loadingPromise;
        }

        this.isLoading = true;
        this.loadingPromise = this._performInit();

        try {
            await this.loadingPromise;
            this.isInitialized = true;
            console.log('I18n system initialized successfully');
        } catch (error) {
            console.error('Failed to initialize i18n:', error);
        } finally {
            this.isLoading = false;
        }

        return this.loadingPromise;
    }

    /**
     * Handle DOM content loaded event
     */
    handleDOMContentLoaded() {
        this.setupLanguageButtons();
        // Remove the event listener after setup
        document.removeEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
    }

    async _performInit() {
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

        // Setup language buttons when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.handleDOMContentLoaded);
        } else {
            this.setupLanguageButtons();
        }

        // Dispatch initialization complete event
        window.dispatchEvent(new CustomEvent('i18nInitialized', {
            detail: { language: this.currentLanguage }
        }));
    }

    async loadTranslations() {
        try {
            // Determine the correct base path
            const basePath = this.getBasePath();

            // Load current language
            const response = await fetch(`${basePath}assets/locales/${this.currentLanguage}.json`);
            if (response.ok) {
                this.translations[this.currentLanguage] = await response.json();
            } else {
                throw new Error(`Failed to load ${this.currentLanguage} translations: ${response.status}`);
            }

            // Load fallback language if different
            if (this.currentLanguage !== this.fallbackLanguage) {
                const fallbackResponse = await fetch(`${basePath}assets/locales/${this.fallbackLanguage}.json`);
                if (fallbackResponse.ok) {
                    this.translations[this.fallbackLanguage] = await fallbackResponse.json();
                } else {
                    console.warn(`Failed to load fallback language ${this.fallbackLanguage}: ${fallbackResponse.status}`);
                }
            }
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback to embedded translations
            this.loadEmbeddedTranslations();
        }
    }

    loadEmbeddedTranslations() {
        // Embedded translations for file:// protocol compatibility
        this.translations = {
            en: {
                navigation: {
                    home: "Home",
                    about: "About",
                    projects: "Projects",
                    articles: "Articles",
                    videos: "Videos",
                    contact: "Contact"
                },
                test: {
                    pageTitle: "I18n Test",
                    mainTitle: "I18n System Test Page",
                    statusTitle: "I18n Status",
                    systemStatus: "I18n System: Not loaded",
                    buttonsStatus: "Language Buttons: Not found",
                    currentLang: "Current Language: Unknown",
                    controlsTitle: "Test Controls",
                    runDebug: "Run Debug Check",
                    switchToChinese: "Switch to Chinese",
                    switchToEnglish: "Switch to English",
                    testButton: "Test Button Click",
                    reinitialize: "Reinitialize",
                    demoTitle: "Translation Demo",
                    demoDescription: "These elements should change language when you switch languages.",
                    consoleTitle: "Console Output",
                    consoleDescription: "Check the browser console (F12) for detailed debug information.",
                    waitingOutput: "Waiting for debug output...",
                    debugPanel: "Debug Panel",
                    loading: "Loading..."
                }
            },
            zh: {
                navigation: {
                    home: "首页",
                    about: "关于我",
                    projects: "项目",
                    articles: "文章",
                    videos: "视频",
                    contact: "联系我"
                },
                test: {
                    pageTitle: "国际化测试",
                    mainTitle: "国际化系统测试页面",
                    statusTitle: "国际化状态",
                    systemStatus: "国际化系统：未加载",
                    buttonsStatus: "语言按钮：未找到",
                    currentLang: "当前语言：未知",
                    controlsTitle: "测试控制",
                    runDebug: "运行调试检查",
                    switchToChinese: "切换到中文",
                    switchToEnglish: "切换到英文",
                    testButton: "测试按钮点击",
                    reinitialize: "重新初始化",
                    demoTitle: "翻译演示",
                    demoDescription: "当您切换语言时，这些元素应该会改变语言。",
                    consoleTitle: "控制台输出",
                    consoleDescription: "查看浏览器控制台（F12）获取详细的调试信息。",
                    waitingOutput: "等待调试输出...",
                    debugPanel: "调试面板",
                    loading: "加载中..."
                }
            }
        };

        console.log('Using embedded translations for file:// protocol');
    }

    getBasePath() {
        const path = window.location.pathname;

        // Handle file:// protocol specially
        if (window.location.protocol === 'file:') {
            // For file protocol, we need to determine the base path differently
            const fileName = path.split('/').pop();
            const directory = path.substring(0, path.lastIndexOf('/') + 1);

            // If we're in the root directory or the file is in root
            if (fileName === 'index.html' || !directory.includes('/hibernate-pano.github.io/')) {
                return './';
            }

            // Count how many levels deep we are from the project root
            const projectRootIndex = directory.indexOf('/hibernate-pano.github.io/');
            if (projectRootIndex !== -1) {
                const relativePath = directory.substring(projectRootIndex + '/hibernate-pano.github.io/'.length);
                const depth = relativePath.split('/').filter(segment => segment).length;
                return depth > 0 ? '../'.repeat(depth) : './';
            }

            return './';
        }

        // For HTTP/HTTPS protocols (original logic)
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

        console.log('Language changed to:', language);
    }

    /**
     * Handle language change button click
     */
    handleLanguageChange(event) {
        try {
            event.preventDefault();
            event.stopPropagation();

            const targetLanguage = event.target.getAttribute('data-lang');
            if (targetLanguage && targetLanguage !== this.currentLanguage) {
                this.changeLanguage(targetLanguage);
                console.log('Language change triggered:', targetLanguage);
            }
        } catch (error) {
            console.error('Failed to handle language change:', error);
        }
    }

    /**
     * Setup language toggle buttons
     */
    setupLanguageButtons() {
        try {
            // Find all language buttons
            const buttons = document.querySelectorAll('.language-btn');

            if (buttons.length === 0) {
                console.warn('No language buttons found in DOM');
                // Retry after a short delay
                setTimeout(() => {
                    if (this.languageButtons.length === 0) {
                        this.setupLanguageButtons();
                    }
                }, 100);
                return;
            }

            // Remove existing event listeners
            this.languageButtons.forEach(button => {
                button.removeEventListener('click', this.handleLanguageChange);
            });

            // Setup new event listeners
            this.languageButtons = Array.from(buttons);
            this.languageButtons.forEach(button => {
                button.addEventListener('click', this.handleLanguageChange);
            });

            // Update button states
            this.updateLanguageSelector();

            console.log(`Language buttons setup successfully (${buttons.length} buttons)`);
        } catch (error) {
            console.error('Failed to setup language buttons:', error);
        }
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
        try {
            const languageButtons = document.querySelectorAll('.language-btn');

            if (languageButtons.length === 0) {
                console.warn('No language buttons found for selector update');
                return;
            }

            languageButtons.forEach(btn => {
                const lang = btn.getAttribute('data-lang');
                if (lang === this.currentLanguage) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });

            console.log('Language selector updated, current language:', this.currentLanguage);
        } catch (error) {
            console.error('Failed to update language selector:', error);
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return ['en', 'zh'];
    }

    isReady() {
        return this.isInitialized && !this.isLoading;
    }

    async waitForReady() {
        if (this.isReady()) {
            return Promise.resolve();
        }

        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        return new Promise((resolve) => {
            const checkReady = () => {
                if (this.isReady()) {
                    resolve();
                } else {
                    setTimeout(checkReady, 50);
                }
            };
            checkReady();
        });
    }

    // Utility method to get language display name
    getLanguageDisplayName(lang) {
        const names = {
            'en': 'English',
            'zh': '中文'
        };
        return names[lang] || lang;
    }
}

// Initialize i18n system safely
function initializeI18nSystem() {
    try {
        if (!window.i18n) {
            const i18n = new I18n();
            window.i18n = i18n;
            console.log('Global I18n system created');
        }
    } catch (error) {
        console.error('Failed to create I18n system:', error);
        // Retry after a short delay
        setTimeout(initializeI18nSystem, 100);
    }
}

// Initialize immediately if possible, otherwise wait for DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeI18nSystem);
} else {
    initializeI18nSystem();
}

// Also ensure initialization on window load as fallback
window.addEventListener('load', () => {
    if (!window.i18n) {
        initializeI18nSystem();
    }
});
