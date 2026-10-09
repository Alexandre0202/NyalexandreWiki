// YCH Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all carousels
    initCarousels();
    
    // Modal functionality
    initModal();
});

function initCarousels() {
    // Seleciona ambos os tipos de carrossel
    const carousels = document.querySelectorAll('.ych-carousel, .ych-carousel2');
    
    carousels.forEach((carousel, index) => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = carousel.querySelector('.carousel-btn.next');
        const prevButton = carousel.querySelector('.carousel-btn.prev');
        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        
        // Obtém o número do carrossel do atributo data-carousel
        const carouselId = carousel.getAttribute('data-carousel') || (index + 1);
        
        // Seleciona os botões de exemplo específicos para este carrossel
        const exampleThumbs = document.querySelectorAll(`.example-thumb[data-carousel="${carouselId}"]:not(.empty)`);
        
        let currentSlide = 0;
        const slideCount = slides.length;
        const slideWidth = slides[0].getBoundingClientRect().width;
        
        // Arrange slides next to each other
        slides.forEach((slide, i) => {
            slide.style.left = slideWidth * i + 'px';
        });
        
        // Function to move to a specific slide
        const moveToSlide = (slideIndex) => {
            if (slideIndex < 0) slideIndex = slideCount - 1;
            if (slideIndex >= slideCount) slideIndex = 0;
            
            track.style.transform = 'translateX(-' + (slideWidth * slideIndex) + 'px)';
            currentSlide = slideIndex;
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentSlide);
            });
            
            // Update example thumbs
            exampleThumbs.forEach((thumb, i) => {
                thumb.classList.toggle('active', i === currentSlide);
            });
        };
        
        // Next button click
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                moveToSlide(currentSlide + 1);
            });
        }
        
        // Previous button click
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                moveToSlide(currentSlide - 1);
            });
        }
        
        // Indicator clicks
        indicators.forEach((indicator, i) => {
            indicator.addEventListener('click', () => {
                moveToSlide(i);
            });
        });
        
        // Example thumb clicks
        exampleThumbs.forEach((thumb, i) => {
            thumb.addEventListener('click', () => {
                moveToSlide(i);
            });
        });
        
        // Auto-advance carousel (opcional - descomente se quiser)
        // setInterval(() => {
        //     moveToSlide(currentSlide + 1);
        // }, 5000);
    });
}

function initModal() {
    const modal = document.getElementById('ych-modal');
    const modalImage = modal.querySelector('.modal-image');
    const modalClose = modal.querySelector('.modal-close');
    const expandButtons = document.querySelectorAll('.card-expand-btn');
    const zoomInBtn = modal.querySelector('.zoom-in');
    const zoomOutBtn = modal.querySelector('.zoom-out');
    const resetZoomBtn = modal.querySelector('.reset-zoom');
    const zoomSlider = modal.querySelector('.zoom-slider');
    
    let currentScale = 100;
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;
    
    // Open modal
    expandButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const carousel = this.closest('.ych-carousel, .ych-carousel2');
            const activeSlide = carousel.querySelector('.carousel-indicators button.active');
            const slideIndex = activeSlide ? parseInt(activeSlide.dataset.slide) : 0;
            const slides = carousel.querySelectorAll('.carousel-track img');
            const activeImage = slides[slideIndex];
            const fullSizeSrc = activeImage.getAttribute('data-full') || activeImage.src;
            
            modalImage.src = fullSizeSrc;
            modalImage.alt = activeImage.alt;
            modalImage.style.transform = 'scale(1)';
            currentScale = 100;
            zoomSlider.value = 100;
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Also allow clicking on the image directly to open modal
    document.querySelectorAll('.ych-image').forEach(img => {
        img.addEventListener('click', function() {
            const expandBtn = this.closest('.ych-carousel, .ych-carousel2').querySelector('.card-expand-btn');
            if (expandBtn) {
                expandBtn.click();
            }
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Keyboard close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
            closeModal();
        }
    });
    
    // Zoom functionality
    zoomInBtn.addEventListener('click', () => zoomImage(1.2));
    zoomOutBtn.addEventListener('click', () => zoomImage(0.8));
    resetZoomBtn.addEventListener('click', resetZoom);
    
    zoomSlider.addEventListener('input', function() {
        const scale = this.value / 100;
        modalImage.style.transform = `scale(${scale})`;
        currentScale = this.value;
        
        if (scale > 1) {
            modalImage.classList.add('zoomed');
        } else {
            modalImage.classList.remove('zoomed');
        }
    });
    
    // Image dragging when zoomed
    modalImage.addEventListener('mousedown', startDrag);
    modalImage.addEventListener('touchstart', startDragTouch);
    
    function closeModal() {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
        resetZoom();
    }
    
    function zoomImage(factor) {
        currentScale = Math.max(25, Math.min(300, currentScale * factor));
        zoomSlider.value = currentScale;
        modalImage.style.transform = `scale(${currentScale / 100})`;
        
        if (currentScale > 100) {
            modalImage.classList.add('zoomed');
        } else {
            modalImage.classList.remove('zoomed');
        }
    }
    
    function resetZoom() {
        currentScale = 100;
        zoomSlider.value = 100;
        modalImage.style.transform = 'scale(1)';
        modalImage.classList.remove('zoomed');
        modalImage.parentElement.scrollLeft = 0;
        modalImage.parentElement.scrollTop = 0;
    }
    
    function startDrag(e) {
        if (!modalImage.classList.contains('zoomed')) return;
        
        isDragging = true;
        startX = e.pageX - modalImage.parentElement.offsetLeft;
        startY = e.pageY - modalImage.parentElement.offsetTop;
        scrollLeft = modalImage.parentElement.scrollLeft;
        scrollTop = modalImage.parentElement.scrollTop;
        
        e.preventDefault();
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }
    
    function startDragTouch(e) {
        if (!modalImage.classList.contains('zoomed')) return;
        
        isDragging = true;
        const touch = e.touches[0];
        startX = touch.pageX - modalImage.parentElement.offsetLeft;
        startY = touch.pageY - modalImage.parentElement.offsetTop;
        scrollLeft = modalImage.parentElement.scrollLeft;
        scrollTop = modalImage.parentElement.scrollTop;
        
        e.preventDefault();
        document.addEventListener('touchmove', dragTouch);
        document.addEventListener('touchend', stopDrag);
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - modalImage.parentElement.offsetLeft;
        const y = e.pageY - modalImage.parentElement.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        modalImage.parentElement.scrollLeft = scrollLeft - walkX;
        modalImage.parentElement.scrollTop = scrollTop - walkY;
    }
    
    function dragTouch(e) {
        if (!isDragging) return;
        const touch = e.touches[0];
        const x = touch.pageX - modalImage.parentElement.offsetLeft;
        const y = touch.pageY - modalImage.parentElement.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        modalImage.parentElement.scrollLeft = scrollLeft - walkX;
        modalImage.parentElement.scrollTop = scrollTop - walkY;
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', dragTouch);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

