// PaceWise Landing Page Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    initCarousel();
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize lightbox
    initLightbox();
    
    // Initialize smooth scrolling
    initSmoothScroll();
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
                
                // Custom smooth scrolling with animation
                const startPosition = window.pageYOffset;
                const distance = scrollPosition - startPosition;
                const duration = 800; // milliseconds (slower for more noticeable effect)
                let start = null;
                
                // Animation function
                function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Easing function (ease-out cubic)
                    const easing = 1 - Math.pow(1 - percentage, 3);
                    
                    window.scrollTo(0, startPosition + distance * easing);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    } else {
                        // Update URL hash after animation completes
                        history.pushState(null, null, targetId);
                    }
                }
                
                // Start the animation
                window.requestAnimationFrame(step);
            }
        });
    });
}

function initCarousel() {
    // Initialize Swiper with external pagination element
    const swiper = new Swiper('.screenshot-carousel', {
        // Basic settings
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 400,
        centeredSlides: true,
        
        // Add pagination (dots) - using the external element
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Use Swiper's built-in navigation
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Improve performance
        preloadImages: true,
        updateOnImagesReady: true,
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
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
                console.log('Image not found: ' + newSrc);
            };
            img.src = newSrc;
        }
    });
}