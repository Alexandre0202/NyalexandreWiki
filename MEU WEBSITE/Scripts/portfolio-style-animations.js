// portfolio-style-animations.js
document.addEventListener('DOMContentLoaded', function() {
    // Observador para animações ao scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observar elementos para animação no scroll
    document.querySelectorAll('.style-block, .feature-item, .example-tag').forEach(el => {
        observer.observe(el);
    });

    // Animação para o badge "Most Popular"
    const popularBadge = document.querySelector('.style-badge.popular');
    if (popularBadge) {
        setInterval(() => {
            popularBadge.style.transform = 'scale(1.05)';
            setTimeout(() => {
                popularBadge.style.transform = 'scale(1)';
            }, 300);
        }, 3000);
    }

    // Efeito de digitação para o título (opcional)
    const heroTitle = document.querySelector('.arttypes-hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Iniciar após um delay
        setTimeout(typeWriter, 500);
    }
});