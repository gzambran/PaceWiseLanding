// PaceWise Landing Page Scripts
document.addEventListener('DOMContentLoaded', function() {    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize lightbox
    initLightbox();
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize scroll animations for feature sections
    initFeatureSections();
});

function initLightbox() {
    // Get the lightbox and its elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    
    // Get all images with the lightbox-trigger class
    const triggers = document.querySelectorAll('.lightbox-trigger');
    
    // Add click event to each trigger image
    triggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            // Set the lightbox image source to the clicked image's source
            // Replace the thumbnail version with the full-size version if needed
            lightboxImg.src = this.src;
            
            // Display the lightbox
            lightbox.style.display = 'block';
            
            // Prevent scrolling on the body while lightbox is open
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox when clicking the close button
    closeBtn.addEventListener('click', function() {
        lightbox.style.display = 'none';
        // Re-enable scrolling
        document.body.style.overflow = '';
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            // Re-enable scrolling
            document.body.style.overflow = '';
        }
    });
    
    // Close lightbox with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
            // Re-enable scrolling
            document.body.style.overflow = '';
        }
    });
}

function initSmoothScroll() {
    // Get all links that have hash links (anchor links)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        // Skip links with no actual destination (e.g., just '#')
        if (link.getAttribute('href') === '#') return;
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get the header height to offset the scroll position
                const headerHeight = document.querySelector('header').offsetHeight;
                
                // Calculate scroll position with header offset
                const scrollPosition = targetElement.offsetTop - headerHeight;
                
                // Improved smooth scrolling with better easing
                const startPosition = window.pageYOffset;
                const distance = scrollPosition - startPosition;
                const duration = 1000; // Slightly longer duration
                
                // Start time for animation
                let startTime = null;
                
                // Animation function with improved easing
                function animate(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Improved easing function - Sine easing
                    // This provides a much gentler deceleration that won't snap
                    const easing = 0.5 - 0.5 * Math.cos(progress * Math.PI);
                    
                    window.scrollTo(0, startPosition + distance * easing);
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animate);
                    } else {
                        // Ensure we end exactly at the right position
                        window.scrollTo(0, scrollPosition);
                        
                        // Update URL hash after animation completes
                        history.pushState(null, null, targetId);
                    }
                }
                
                // Start the animation
                requestAnimationFrame(animate);
            }
        });
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Ensure the body has a data-theme attribute set
    if (!body.hasAttribute('data-theme')) {
        body.setAttribute('data-theme', 'light');
    }
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        // Apply saved theme
        body.setAttribute('data-theme', savedTheme);
        updateScreenshots(savedTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        body.setAttribute('data-theme', initialTheme);
        updateScreenshots(initialTheme);
    }
    
    // Listen for system preference changes if no saved preference
    if (!savedTheme) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateScreenshots(newTheme);
        });
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Set the new theme with animation
        body.classList.add('theme-transitioning');
        body.setAttribute('data-theme', newTheme);
        
        // Remove transition class after animation completes
        setTimeout(() => {
            body.classList.remove('theme-transitioning');
        }, 300); // Match var(--animation-medium)
        
        // Save preference to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Update screenshots based on theme
        updateScreenshots(newTheme);
    });
}

function updateScreenshots(theme) {
    // Get all app screenshots including the hero screenshot
    const screenshots = document.querySelectorAll('.app-screenshot');
    
    screenshots.forEach(screenshot => {
        const src = screenshot.getAttribute('src');
        let needsUpdate = false;
        let newSrc = '';
        
        // Check if we need to update this image
        if (theme === 'dark' && !src.includes('-dark')) {
            needsUpdate = true;
            newSrc = src.replace('.png', '-dark.png');
        } else if (theme === 'light' && src.includes('-dark')) {
            needsUpdate = true;
            newSrc = src.replace('-dark.png', '.png');
        }
        
        // If we need to update the image, do it with preloading
        if (needsUpdate) {
            // Create a new Image to preload
            const img = new Image();
            img.onload = function() {
                // Only swap the src after the new image has loaded
                screenshot.classList.add('screenshot-fading');
                
                // Set a timeout to match the fade-out transition
                setTimeout(() => {
                    screenshot.setAttribute('src', newSrc);
                    
                    // Wait a bit before fading back in
                    setTimeout(() => {
                        screenshot.classList.remove('screenshot-fading');
                    }, 150);
                }, 150);
            };
            img.onerror = function() {
                // If dark image doesn't exist yet (like for hero image initially),
                // revert to the original image and don't show fading effect
            };
            img.src = newSrc;
        }
    });
}

function initFeatureSections() {
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const featureSections = document.querySelectorAll('.feature-section');
        
        // Remove any existing animate-in classes to allow the observer to add them
        featureSections.forEach(section => {
            section.classList.remove('animate-in');
        });
        
        const options = {
            root: null, // viewport
            rootMargin: '-50px', // Only trigger when element is 50px into the viewport
            threshold: 0.25 // 25% of the element must be visible (increased from 15%)
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, options);
        
        // Observe each feature section
        featureSections.forEach(section => {
            observer.observe(section);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('.feature-section').forEach(section => {
            section.classList.add('animate-in');
        });
    }
}