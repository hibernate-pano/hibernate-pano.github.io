/**
 * I18n Debug Helper
 * Provides debugging information for internationalization issues
 */

window.I18nDebugger = {
    /**
     * Check if i18n system is working properly
     */
    checkI18nSystem() {
        console.log('=== I18n System Debug ===');
        
        // Check if I18n exists
        console.log('1. I18n system exists:', !!window.i18n);
        
        if (window.i18n) {
            console.log('   - Current language:', window.i18n.getCurrentLanguage());
            console.log('   - Is initialized:', window.i18n.isInitialized);
            console.log('   - Is ready:', window.i18n.isReady());
            console.log('   - Supported languages:', window.i18n.getSupportedLanguages());
        }
        
        // Check if language buttons exist
        const languageButtons = document.querySelectorAll('.language-btn');
        console.log('2. Language buttons found:', languageButtons.length);
        
        if (languageButtons.length > 0) {
            languageButtons.forEach((button, index) => {
                const lang = button.getAttribute('data-lang');
                const isActive = button.classList.contains('active');
                console.log(`   - Button ${index + 1}: ${lang} (active: ${isActive})`);
            });
        }
        
        // Check translations loaded
        if (window.i18n && window.i18n.translations) {
            const loadedLangs = Object.keys(window.i18n.translations);
            console.log('3. Loaded translations:', loadedLangs);
            
            loadedLangs.forEach(lang => {
                const count = this.countTranslations(window.i18n.translations[lang]);
                console.log(`   - ${lang}: ${count} translations`);
            });
        }
        
        // Check translatable elements
        const translatableElements = document.querySelectorAll('[data-i18n]');
        console.log('4. Translatable elements found:', translatableElements.length);
        
        if (translatableElements.length > 0) {
            const sampleElements = Array.from(translatableElements).slice(0, 5);
            sampleElements.forEach((element, index) => {
                const key = element.getAttribute('data-i18n');
                const text = element.textContent.trim();
                console.log(`   - Element ${index + 1}: ${key} = "${text}"`);
            });
        }
        
        // Check localStorage
        const savedLanguage = localStorage.getItem('sophia-portfolio-language');
        console.log('5. LocalStorage language:', savedLanguage);
        
        // Check document language
        console.log('6. Document language:', document.documentElement.lang);
        
        console.log('=== End Debug ===');
    },
    
    /**
     * Count translations in an object recursively
     */
    countTranslations(obj, count = 0) {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                count = this.countTranslations(obj[key], count);
            } else {
                count++;
            }
        }
        return count;
    },
    
    /**
     * Manually change language for testing
     */
    manualChangeLanguage(language) {
        if (window.i18n) {
            console.log(`Manually changing language to: ${language}`);
            window.i18n.changeLanguage(language);
        } else {
            console.error('I18n system not available');
        }
    },
    
    /**
     * Test language button click
     */
    testButtonClick(language) {
        const button = document.querySelector(`.language-btn[data-lang="${language}"]`);
        if (button) {
            console.log(`Simulating click on ${language} button...`);
            button.click();
        } else {
            console.error(`Language button for ${language} not found`);
        }
    },
    
    /**
     * Force reinitialize i18n system
     */
    reinitialize() {
        console.log('Reinitializing i18n system...');
        
        // Remove existing instance
        if (window.i18n) {
            delete window.i18n;
        }
        
        // Create new instance
        try {
            const I18n = window.I18n || class {}; // Fallback if class not available
            window.i18n = new I18n();
            console.log('I18n system reinitialized successfully');
        } catch (error) {
            console.error('Failed to reinitialize i18n system:', error);
        }
    },
    
    /**
     * Test translation key
     */
    testTranslation(key) {
        if (window.i18n) {
            const translation = window.i18n.t(key);
            console.log(`Translation for "${key}":`, translation);
            return translation;
        } else {
            console.error('I18n system not available');
            return null;
        }
    },
    
    /**
     * Show all available translation keys
     */
    showAllKeys() {
        if (window.i18n && window.i18n.translations) {
            const currentLang = window.i18n.getCurrentLanguage();
            const translations = window.i18n.translations[currentLang];
            
            if (translations) {
                console.log(`All translation keys for ${currentLang}:`);
                this.printKeys(translations);
            } else {
                console.log(`No translations loaded for ${currentLang}`);
            }
        } else {
            console.error('I18n system or translations not available');
        }
    },
    
    /**
     * Print translation keys recursively
     */
    printKeys(obj, prefix = '') {
        for (const key in obj) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.printKeys(obj[key], fullKey);
            } else {
                console.log(`  ${fullKey}: "${obj[key]}"`);
            }
        }
    },
    
    /**
     * Check translation file loading
     */
    async testTranslationLoading() {
        console.log('Testing translation file loading...');
        
        const languages = ['en', 'zh'];
        for (const lang of languages) {
            try {
                const response = await fetch(`assets/locales/${lang}.json`);
                if (response.ok) {
                    const data = await response.json();
                    const count = this.countTranslations(data);
                    console.log(`✓ ${lang}.json loaded successfully (${count} translations)`);
                } else {
                    console.error(`✗ Failed to load ${lang}.json: ${response.status}`);
                }
            } catch (error) {
                console.error(`✗ Error loading ${lang}.json:`, error);
            }
        }
    }
};

// Auto-run debug check after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('Auto-running i18n debug check...');
        window.I18nDebugger.checkI18nSystem();
    }, 1500);
});

// Add debug commands to console
console.log('I18n Debug Helper loaded. Available commands:');
console.log('- I18nDebugger.checkI18nSystem() - Check i18n system status');
console.log('- I18nDebugger.manualChangeLanguage("zh") - Manually change language');
console.log('- I18nDebugger.testButtonClick("en") - Test button click');
console.log('- I18nDebugger.testTranslation("navigation.home") - Test translation');
console.log('- I18nDebugger.showAllKeys() - Show all translation keys');
console.log('- I18nDebugger.testTranslationLoading() - Test file loading');
