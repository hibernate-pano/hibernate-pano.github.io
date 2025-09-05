/**
 * Sophia Chen Portfolio - Shared JavaScript
 * Common functionality for all pages
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeSearchFunctionality();
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
        mobileMenuButton.addEventListener('click', function() {
            navMenu.classList.toggle('show-mobile');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
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
        link.addEventListener('click', function(e) {
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
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const opacity = Math.min(scrolled / 100, 0.95);
            header.style.backgroundColor = `rgba(13, 17, 23, ${0.8 + opacity * 0.2})`;
        });
    }
}

/**
 * Initialize search functionality
 */
function initializeSearchFunctionality() {
    const searchButton = document.querySelector('.search-button');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            // Placeholder for search functionality
            console.log('Search functionality to be implemented');
            // You can implement a search modal or redirect to search page
        });
    }
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
        img.addEventListener('error', function() {
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

// Initialize image error handling when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeImageErrorHandling);
