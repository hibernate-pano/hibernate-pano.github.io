#!/usr/bin/env node

/**
 * Script to add theme toggle buttons to all HTML pages
 * This script will:
 * 1. Add theme toggle button to user-actions sections
 * 2. Add theme.js script reference
 */

const fs = require('fs');
const path = require('path');

// List of HTML files to update (excluding already updated ones)
const filesToUpdate = [
    './articles/index.html',
    './articles/react-hooks-guide.html', 
    './articles/tech-interview-process.html',
    './videos/index.html',
    './videos/day-in-life-engineer.html',
    './videos/tailwind-css-tutorial.html',
    './projects/project-alpha.html',
    './projects/data-insights-dashboard.html',
    './projects/mobile-app-beta.html',
    './contact/index.html',
    './about/index.html',
    './resume/index.html'
];

// Theme button HTML to insert
const themeButtonHTML = `                            <!-- Theme Toggle Button -->
                            <button class="theme-toggle-button" aria-label="Toggle theme">
                                <span class="material-symbols-outlined">light_mode</span>
                            </button>`;

function updateFile(filePath) {
    try {
        console.log(`Updating ${filePath}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Skip if already has theme button
        if (content.includes('theme-toggle-button')) {
            console.log(`  - Already has theme button, skipping`);
            return;
        }
        
        // 1. Add theme button to user-actions section
        const userActionsRegex = /(<div class="user-actions">[\s\S]*?)(\s*<button class="icon-button search-button">)/;
        if (userActionsRegex.test(content)) {
            content = content.replace(userActionsRegex, `$1${themeButtonHTML}
$2`);
            updated = true;
            console.log(`  - Added theme button`);
        }
        
        // 2. Add theme.js script reference
        const scriptRegex = /(\s*<!-- JavaScript -->\s*)(<script src="[^"]*main\.js"><\/script>)/;
        if (scriptRegex.test(content)) {
            const relativePath = filePath.startsWith('./') ? filePath.substring(2) : filePath;
            const depth = (relativePath.match(/\//g) || []).length;
            const jsPath = '../'.repeat(depth);
            
            content = content.replace(scriptRegex, `$1<script src="${jsPath}assets/js/theme.js"></script>
    $2`);
            updated = true;
            console.log(`  - Added theme.js script`);
        }
        
        // Alternative script pattern for files that don't have the comment
        if (!updated && content.includes('assets/js/main.js')) {
            const altScriptRegex = /(<script src="([^"]*?)assets\/js\/main\.js"><\/script>)/;
            if (altScriptRegex.test(content)) {
                content = content.replace(altScriptRegex, (match, fullMatch, pathPrefix) => {
                    return `<script src="${pathPrefix}assets/js/theme.js"></script>
    ${fullMatch}`;
                });
                updated = true;
                console.log(`  - Added theme.js script (alternative pattern)`);
            }
        }
        
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`  ✓ Successfully updated ${filePath}`);
        } else {
            console.log(`  - No updates needed for ${filePath}`);
        }
        
    } catch (error) {
        console.error(`  ✗ Error updating ${filePath}:`, error.message);
    }
}

// Main execution
console.log('Starting theme button update process...\n');

filesToUpdate.forEach(updateFile);

console.log('\nTheme button update process completed!');
