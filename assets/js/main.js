/**
 * Sophia Chen Portfolio - Shared JavaScript
 * Common functionality for all pages
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeSearchFunctionality();
    initializeLanguageSwitcher();
    initializeThemeToggle();
});

/**
 * Initialize navigation highlighting
 */
function initializeNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Handle home page
        if (currentPath === '/' || currentPath === '/index.html') {
            if (href === '/' || href === '/index.html' || href.startsWith('#')) {
                link.classList.add('active');
            }
        }
        // Handle other pages
        else if (href && currentPath.includes(href.replace('./', ''))) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize mobile menu functionality
 */
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', function () {
            navMenu.classList.toggle('show-mobile');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!mobileMenuButton.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('show-mobile');
            }
        });
    }
}

/**
 * Initialize scroll effects
 */
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header background opacity on scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function () {
            const scrolled = window.pageYOffset;
            const opacity = Math.min(scrolled / 100, 0.95);

            // Use CSS variable instead of hardcoded color
            const computedStyle = getComputedStyle(document.documentElement);
            const bgColor = computedStyle.getPropertyValue('--background-color').trim();

            // Parse RGB values from the background color
            let r, g, b;
            if (bgColor.startsWith('#')) {
                // Handle hex colors
                const hex = bgColor.substring(1);
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
            } else {
                // Default to dark theme colors if parsing fails
                r = 13; g = 17; b = 23;
            }

            header.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${0.8 + opacity * 0.2})`;
        });
    }
}

/**
 * Initialize search functionality
 */
function initializeSearchFunctionality() {
    const searchButton = document.querySelector('.search-button');

    if (searchButton) {
        searchButton.addEventListener('click', function () {
            // Placeholder for search functionality
            console.log('Search functionality to be implemented');
            // You can implement a search modal or redirect to search page
        });
    }
}

/**
 * Initialize language switcher
 */
function initializeLanguageSwitcher() {
    // Wait for i18n system to be available
    const waitForI18n = () => {
        if (window.i18n && window.i18n.isReady && window.i18n.isReady()) {
            // I18n system handles its own button setup now
            console.log('Language switcher functionality initialized');
        } else if (window.i18n) {
            // Wait for i18n to be ready
            window.i18n.waitForReady().then(() => {
                console.log('Language switcher functionality initialized (after wait)');
            });
        } else {
            // Retry after a short delay
            setTimeout(waitForI18n, 50);
        }
    };

    waitForI18n();
}

/**
 * Utility function to create breadcrumb navigation
 */
function createBreadcrumb(items) {
    const breadcrumbContainer = document.querySelector('.breadcrumb-container');

    if (!breadcrumbContainer || !items || items.length === 0) {
        return;
    }

    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');

    items.forEach((item, index) => {
        if (index > 0) {
            const separator = document.createElement('span');
            separator.className = 'breadcrumb-separator';
            separator.textContent = '/';
            breadcrumb.appendChild(separator);
        }

        if (index === items.length - 1) {
            // Current page
            const current = document.createElement('span');
            current.className = 'breadcrumb-current';
            current.textContent = item.text;
            breadcrumb.appendChild(current);
        } else {
            // Link
            const link = document.createElement('a');
            link.className = 'breadcrumb-link';
            link.href = item.href;
            link.textContent = item.text;
            breadcrumb.appendChild(link);
        }
    });

    breadcrumbContainer.appendChild(breadcrumb);
}

/**
 * Utility function to format dates
 */
function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Utility function to truncate text
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength).trim() + '...';
}

/**
 * Utility function to handle image loading errors
 */
function handleImageError(img) {
    img.style.display = 'none';

    // Create placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    placeholder.style.cssText = `
        width: 100%;
        height: 200px;
        background-color: var(--card-color);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        font-size: 0.875rem;
    `;
    placeholder.textContent = 'Image not available';

    img.parentNode.insertBefore(placeholder, img);
}

/**
 * Initialize image error handling
 */
function initializeImageErrorHandling() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            handleImageError(this);
        });
    });
}

/**
 * Utility function to copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (err) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--card-color);
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Initialize theme toggle functionality
 */
function initializeThemeToggle() {
    // Wait for theme manager to be available
    const waitForThemeManager = () => {
        if (window.themeManager) {
            // Listen for theme changes to update any theme-dependent elements
            window.themeManager.onThemeChange((event) => {
                const { theme, isLight } = event.detail;

                // Update any theme-dependent elements here
                updateThemeDependentElements(theme);

                // Log theme change for debugging
                console.log(`Theme changed to: ${theme}`);
            });

            console.log('Theme toggle functionality initialized');
        } else {
            // Retry after a short delay
            setTimeout(waitForThemeManager, 50);
        }
    };

    waitForThemeManager();
}

/**
 * Update elements that depend on the current theme
 */
function updateThemeDependentElements(theme) {
    // Force update header background to use current theme colors
    const header = document.querySelector('.header');
    if (header) {
        // Clear any inline styles that might override CSS variables
        header.style.backgroundColor = '';

        // Re-trigger scroll event to update header background with correct colors
        const scrollEvent = new Event('scroll');
        window.dispatchEvent(scrollEvent);
    }

    // Update any other theme-dependent elements
    console.log(`Updated theme-dependent elements for ${theme} theme`);
}

// Initialize image error handling when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeImageErrorHandling);
