// carousel-modal.js - Adiciona funcionalidade de modal às imagens dos carrosséis
// Não interfere com scripts existentes (modal-script.js, portfolio-script.js)

document.addEventListener('DOMContentLoaded', function() {
    
    // Aguarda o modal-script estar carregado
    const waitForOpenModal = setInterval(() => {
        if (typeof window.openModal === 'function') {
            clearInterval(waitForOpenModal);
            initCarouselModal();
        }
    }, 100);
    
    // Timeout de segurança
    setTimeout(() => {
        if (typeof window.openModal === 'function') {
            clearInterval(waitForOpenModal);
            initCarouselModal();
        }
    }, 3000);
    
    function initCarouselModal() {
        // Adiciona estilo ao cursor das imagens do carrossel
        addCarouselImageStyles();
        
        // Adiciona listener a todas as imagens do carrossel
        attachCarouselListeners();
    }
    
    // Adiciona estilos visuais para indicar que a imagem é clicável
    function addCarouselImageStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Estilos para imagens do carrossel clicáveis */
            .carousel-track img {
                cursor: pointer;
                transition: transform 0.3s ease, filter 0.3s ease;
            }
            
            .carousel-track img:hover {
                transform: scale(1.02);
                filter: brightness(1.1);
            }
            
            /* Indicador visual de interatividade */
            .carousel-track img::after {
                content: '';
            }
        `;
        document.head.appendChild(style);
    }
    
    // Anexa listeners de clique a todas as imagens do carrossel
    function attachCarouselListeners() {
        // Seleciona todas as imagens dentro dos carrosséis
        const carouselImages = document.querySelectorAll('.carousel-track img');
        
        carouselImages.forEach(img => {
            img.addEventListener('click', function(e) {
                e.stopPropagation(); // Evita propagação do evento
                
                // Obtém a imagem em alta resolução se existir
                const fullResolution = this.dataset.full || this.src;
                const altText = this.alt || 'Galeria de imagem';
                
                // Abre o modal com a função global
                if (typeof window.openModal === 'function') {
                    window.openModal(fullResolution, altText);
                } else {
                    console.warn('openModal não está disponível');
                }
            });
            
            // Adiciona atributo aria-label para acessibilidade
            if (!img.getAttribute('aria-label')) {
                img.setAttribute('aria-label', 'Clique para expandir a imagem');
            }
            
            // Adiciona tabindex para teclado
            img.setAttribute('tabindex', '0');
            
            // Permite abrir com Enter ou Space
            img.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        console.log(`✓ Modal para carrossel ativado em ${carouselImages.length} imagens`);
    }
    
    // Função para re-inicializar quando novas imagens são adicionadas dinamicamente
    window.reinitCarouselModal = function() {
        attachCarouselListeners();
    };
});
