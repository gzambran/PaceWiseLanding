// PaceWise Landing Page Scripts
document.addEventListener('DOMContentLoaded', function() {    
    // Apply initial theme as early as possible to prevent flicker
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.body.setAttribute('data-theme', initialTheme);
    
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
    
    // Function to open lightbox
    function openLightbox(src) {
        // Set the lightbox image source
        lightboxImg.src = src;
        
        // Display the lightbox
        lightbox.removeAttribute('hidden');
        lightbox.style.display = 'block';
        
        // Prevent scrolling on the body while lightbox is open
        document.body.style.overflow = 'hidden';
        
        // Focus the close button for accessibility
        setTimeout(() => {
            closeBtn.focus();
        }, 100);
    }
    
    // Function to close lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        // Re-enable scrolling
        document.body.style.overflow = '';
        // Return focus to the trigger that was clicked
        if (lastFocusedTrigger) {
            lastFocusedTrigger.focus();
        }
    }
    
    // Keep track of which trigger was last clicked
    let lastFocusedTrigger = null;
    
    // Add click event to each trigger image
    triggers.forEach(trigger => {
        // Make triggers focusable
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('aria-label', 'Open ' + trigger.alt + ' in lightbox');
        
        // Handle click events
        trigger.addEventListener('click', function() {
            lastFocusedTrigger = this;
            openLightbox(this.src);
        });
        
        // Handle keyboard events
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                lastFocusedTrigger = this;
                openLightbox(this.src);
            }
        });
    });
    
    // Close lightbox when clicking the close button
    closeBtn.addEventListener('click', closeLightbox);
    
    // Handle keyboard for close button
    closeBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            closeLightbox();
        }
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            closeLightbox();
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



function updateScreenshots(theme) {
    // Now handled by the shared components
    // This function is kept for backward compatibility
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