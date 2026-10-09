// Portfolio Script - Funcionalidades essenciais COM MULTIPLAS CATEGORIAS
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Sistema de filtros ATUALIZADO para múltiplas categorias
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCategories = document.querySelectorAll('.portfolio-category');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filter categories e cards com múltiplas tags
            portfolioCategories.forEach(category => {
                // Usar data-categories (plural) para múltiplas categorias
                const categoriesAttr = category.getAttribute('data-categories') || 
                                     category.getAttribute('data-category');
                const categoryTypes = categoriesAttr ? categoriesAttr.split(' ') : [];
                
                if (filterValue === 'all' || categoryTypes.includes(filterValue)) {
                    // Mostrar categoria
                    category.style.display = 'block';
                    
                    // Animar entrada
                    setTimeout(() => {
                        category.style.opacity = '1';
                        category.style.transform = 'translateY(0)';
                        category.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    }, 10);
                    
                    // Mostrar todos os cards desta categoria
                    const categoryCards = category.querySelectorAll('.portfolio-card');
                    categoryCards.forEach(card => {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    });
                } else {
                    // Esconder categoria
                    category.style.opacity = '0';
                    category.style.transform = 'translateY(20px)';
                    category.style.transition = 'opacity 0.3s ease, transform 0.3s ease, display 0.3s ease';
                    
                    setTimeout(() => {
                        category.style.display = 'none';
                    }, 300);
                    
                    // Esconder cards desta categoria
                    const categoryCards = category.querySelectorAll('.portfolio-card');
                    categoryCards.forEach(card => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                    });
                }
            });
            
            // Animar cards individualmente para filtros específicos
            if (filterValue !== 'all') {
                portfolioCards.forEach(card => {
                    const cardCategory = card.closest('.portfolio-category');
                    const categoriesAttr = cardCategory.getAttribute('data-categories') || 
                                         cardCategory.getAttribute('data-category');
                    const categoryTypes = categoriesAttr ? categoriesAttr.split(' ') : [];
                    
                    if (categoryTypes.includes(filterValue)) {
                        // Card deve aparecer com delay progressivo
                        const cardIndex = Array.from(card.closest('.portfolio-grid').children).indexOf(card);
                        const delay = (cardIndex * 0.1) + 0.2;
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            card.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
                        }, 10);
                    }
                });
            }
        });
    });
    
    // 2. Botão "Voltar ao topo"
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 3. Integração com o modal-script.js existente
    // Adiciona funcionalidade ao botão de expandir
    document.querySelectorAll('.card-expand-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.closest('.ych-carousel, .ych-carousel2')) return;

            e.stopPropagation(); // Evita que o clique propague para a imagem
            const img = this.closest('.card-image-container, .card-image-container2')?.querySelector('img');
            if (!img) return;
            const full = img.dataset.full || img.src;
            
            // Chama a função openModal do seu script
            if (typeof window.openModal === 'function') {
                window.openModal(full, img.alt || '');
            }
        });
    });
    
    // 4. Animações de entrada melhoradas
    function animateOnScroll() {
        const cards = document.querySelectorAll('.portfolio-card');
        const categories = document.querySelectorAll('.portfolio-category');
        const windowHeight = window.innerHeight;
        
        // Animar categorias
        categories.forEach(category => {
            const categoryPosition = category.getBoundingClientRect().top;
            
            if (categoryPosition < windowHeight - 100) {
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
                category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
        
        // Animar cards com delay progressivo
        cards.forEach((card, index) => {
            const cardPosition = card.getBoundingClientRect().top;
            const grid = card.closest('.portfolio-grid');
            const cardIndexInGrid = grid ? 
                Array.from(grid.querySelectorAll('.portfolio-card')).indexOf(card) : 
                index % 12; // Fallback
            
            if (cardPosition < windowHeight - 100) {
                const delay = (cardIndexInGrid * 0.08) + 0.1;
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
                }, 10);
            }
        });
    }
    
    // Executar animação inicial
    setTimeout(animateOnScroll, 100);
    
    // Executar animação ao rolar
    window.addEventListener('scroll', animateOnScroll);
    
    // 5. Atualizar contadores automaticamente
    function updateCategoryCounts() {
        document.querySelectorAll('.portfolio-category').forEach(category => {
            const grid = category.querySelector('.portfolio-grid');
            if (grid) {
                const count = grid.querySelectorAll('.portfolio-card').length;
                const countElement = category.querySelector('.category-count');
                if (countElement) {
                    countElement.textContent = `${count} artworks`;
                }
            }
        });
    }
    
    updateCategoryCounts();
    
    // 6. Inicializar todas as categorias como visíveis
    portfolioCategories.forEach(category => {
        category.style.display = 'block';
        category.style.opacity = '1';
        category.style.transform = 'translateY(0)';
    });
    
    // 7. Inicializar todos os cards como visíveis
    portfolioCards.forEach((card, index) => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    console.log('Portfolio carregado com sucesso! 🎨 | Múltiplas categorias ativadas');
});

// Função de fallback para o modal
if (typeof openModal === 'undefined') {
    window.openModal = function(src, alt) {
        const modal = document.getElementById('portfolioModal');
        const modalImg = document.getElementById('modalImage');
        
        if (modal && modalImg) {
            modalImg.src = src;
            modalImg.alt = alt;
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }
    };
}