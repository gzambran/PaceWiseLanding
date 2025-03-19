// PaceWise Landing Page Scripts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize carousel
    initCarousel();
});

function initCarousel() {
    // Create the dots first
    const carousel = document.querySelector('.screenshot-carousel');
    if (!carousel) return;
    
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const dotsContainer = document.querySelector('.carousel-dots');
    
    // Create dots based on number of items
    carouselItems.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('data-index', index);
        dotsContainer.appendChild(dot);
    });
    
    // Initialize the slider with tiny-slider
    let slider = tns({
        container: '.screenshot-carousel',
        items: 1,
        slideBy: 'page',
        autoplay: false,
        controls: false,
        nav: false,
        loop: true,
        speed: 400,
        responsive: {
            768: {
                items: 1
            }
        }
    });
    
    // Add click events to previous and next buttons
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    prevBtn.addEventListener('click', () => {
        slider.goTo('prev');
    });
    
    nextBtn.addEventListener('click', () => {
        slider.goTo('next');
    });
    
    // Add click events to dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            slider.goTo(index);
        });
    });
    
    // Update active dot when slide changes
    slider.events.on('indexChanged', info => {
        const currentIndex = info.index % carouselItems.length;
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        dots[currentIndex].classList.add('active');
    });
}
