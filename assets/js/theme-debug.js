/**
 * Theme Debug Helper
 * Provides debugging information for theme switching issues
 */

window.ThemeDebugger = {
    /**
     * Check if theme system is working properly
     */
    checkThemeSystem() {
        console.log('=== Theme System Debug ===');
        
        // Check if ThemeManager exists
        console.log('1. ThemeManager exists:', !!window.themeManager);
        
        if (window.themeManager) {
            console.log('   - Current theme:', window.themeManager.getCurrentTheme());
            console.log('   - Is initialized:', window.themeManager.isInitialized);
        }
        
        // Check if theme button exists
        const themeButton = document.querySelector('.theme-toggle-button');
        console.log('2. Theme button found:', !!themeButton);
        
        if (themeButton) {
            console.log('   - Button classes:', themeButton.className);
            console.log('   - Button aria-label:', themeButton.getAttribute('aria-label'));
            console.log('   - Button has click listener:', themeButton.onclick !== null);
        }
        
        // Check body classes
        const body = document.body;
        console.log('3. Body classes:', body.className);
        console.log('   - Has light-theme class:', body.classList.contains('light-theme'));
        
        // Check CSS variables
        const computedStyle = getComputedStyle(document.documentElement);
        console.log('4. CSS Variables:');
        console.log('   - --background-color:', computedStyle.getPropertyValue('--background-color'));
        console.log('   - --text-primary:', computedStyle.getPropertyValue('--text-primary'));
        
        // Check localStorage
        const savedTheme = localStorage.getItem('sophia-portfolio-theme');
        console.log('5. LocalStorage theme:', savedTheme);
        
        console.log('=== End Debug ===');
    },
    
    /**
     * Manually toggle theme for testing
     */
    manualToggle() {
        if (window.themeManager) {
            window.themeManager.toggleTheme();
            console.log('Theme manually toggled to:', window.themeManager.getCurrentTheme());
        } else {
            console.error('ThemeManager not available');
        }
    },
    
    /**
     * Force reinitialize theme system
     */
    reinitialize() {
        console.log('Reinitializing theme system...');
        
        // Remove existing instance
        if (window.themeManager) {
            delete window.themeManager;
        }
        
        // Create new instance
        try {
            window.themeManager = new ThemeManager();
            console.log('Theme system reinitialized successfully');
        } catch (error) {
            console.error('Failed to reinitialize theme system:', error);
        }
    },
    
    /**
     * Test theme button click
     */
    testButtonClick() {
        const themeButton = document.querySelector('.theme-toggle-button');
        if (themeButton) {
            console.log('Simulating button click...');
            themeButton.click();
        } else {
            console.error('Theme button not found');
        }
    }
};

// Auto-run debug check after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        console.log('Auto-running theme debug check...');
        window.ThemeDebugger.checkThemeSystem();
    }, 1000);
});

// Add debug commands to console
console.log('Theme Debug Helper loaded. Available commands:');
console.log('- ThemeDebugger.checkThemeSystem() - Check theme system status');
console.log('- ThemeDebugger.manualToggle() - Manually toggle theme');
console.log('- ThemeDebugger.reinitialize() - Reinitialize theme system');
console.log('- ThemeDebugger.testButtonClick() - Test button click');
