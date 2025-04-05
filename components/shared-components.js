/**
 * PaceWise Shared Components
 * This file contains functions to insert the header and footer HTML
 */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  // Insert header
  const headerPlaceholder = document.querySelector('site-header');
  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = createHeader();
    initThemeToggle(); // Initialize theme toggle functionality
  }
  
  // Insert footer
  const footerPlaceholder = document.querySelector('site-footer');
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = createFooter();
  }
  
  // Apply initial theme to all images
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Special handling for CTA Apple badge to ensure it's included
  const ctaAppleBadge = document.querySelector('.cta-content .app-store-badge img');
  if (ctaAppleBadge) {
    console.log('CTA Apple badge found:', ctaAppleBadge);
  } else {
    console.log('CTA Apple badge not found - this is unexpected');
  }
  
  updateImages(initialTheme);
});

// Create header HTML
function createHeader() {
  return `
    <header>
      <div class="container">
        <div class="logo">
          <img src="logo.svg" alt="PaceWise">
          <span>PaceWise</span>
        </div>
        <div class="header-cta">
          <button id="theme-toggle" class="theme-toggle" aria-label="Toggle dark mode" aria-pressed="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun-icon">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          </button>
          <a href="https://apps.apple.com/app/id6743449540" class="app-store-badge">
            <img src="Apple_Badge_Black.svg" alt="Download on the App Store" data-dark-src="Apple_Badge_White.svg">
          </a>
        </div>
      </div>
    </header>
  `;
}

// Create footer HTML
function createFooter() {
  const year = new Date().getFullYear();
  return `
    <footer>
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <img src="logo.svg" alt="PaceWise">
            <span>PaceWise</span>
          </div>
          <p>&copy; ${year} PaceWise. All rights reserved.</p>
        </div>
        <div class="footer-links">
          <a href="privacy.html">Privacy Policy</a>
          <a href="support.html">Support</a>
        </div>
      </div>
    </footer>
  `;
}

// Theme toggle functionality
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;
  
  const body = document.body;
  // Set initial state
  const currentTheme = body.getAttribute('data-theme') || 'light';
  themeToggle.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    console.log('Theme toggle clicked: changing from', currentTheme, 'to', newTheme);
    
    // Set the new theme with animation
    body.classList.add('theme-transitioning');
    body.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update aria-pressed for accessibility
    themeToggle.setAttribute('aria-pressed', newTheme === 'dark' ? 'true' : 'false');
    
    // Remove transition class after animation completes
    setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 300);
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update all theme-dependent images (including Apple badges)
    updateImages(newTheme);
  });
}

// Update images based on theme
function updateImages(theme) {
  document.querySelectorAll('img[data-dark-src]').forEach(img => {
    const darkSrc = img.getAttribute('data-dark-src');
    if (!darkSrc) return;
    
    // Handle different file naming patterns
    let lightSrc;
    if (darkSrc.includes('-dark')) {
      // For files with -dark suffix
      lightSrc = darkSrc.replace('-dark', '');
    } else if (darkSrc === 'Apple_Badge_White.svg') {
      // Special case for Apple badge
      lightSrc = 'Apple_Badge_Black.svg';
    } else {
      // Default case
      return;
    }
    
    // Update the image based on theme
    const newSrc = theme === 'dark' ? darkSrc : lightSrc;
    
    // Log for debugging
    console.log('Updating image:', img.alt, 'Current src:', img.src, 'New src:', newSrc);
    
    // Extract just the filename from the full path
    const currentSrcFilename = img.src.split('/').pop();
    
    // Don't change if it's already the correct source
    if (currentSrcFilename === newSrc) {
      console.log('Skipping update - already correct');
      return;
    }
    
    // Simple, clean fade transition for all images
    const oldOpacity = img.style.opacity || "1";
    
    // Smooth, slower fade out
    img.style.transition = 'opacity 800ms cubic-bezier(0.4, 0.0, 0.2, 1)';
    img.style.opacity = '0';
    
    // Change source and fade back in
    setTimeout(() => {
      img.src = newSrc;
      setTimeout(() => {
        img.style.opacity = oldOpacity;
      }, 50);
    }, 400);
  });
}
