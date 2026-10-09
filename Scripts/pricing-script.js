// ====== FUNCIONALIDADE DO FAQ (ACCORDION) ======
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todos os itens do FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Para cada item do FAQ
    faqItems.forEach(item => {
        // Seleciona a pergunta dentro do item
        const question = item.querySelector('.faq-question');
        
        // Adiciona um evento de clique na pergunta
        question.addEventListener('click', () => {
            // Fecha outros itens que estejam abertos
            faqItems.forEach(otherItem => {
                // Se não é o item atual e está aberto
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active'); // Fecha
                }
            });
            
            // Abre/fecha o item atual
            item.classList.toggle('active');
        });
    });
    
    // ====== ANIMAÇÃO DE SCROLL ======
    // Função para animar elementos quando aparecem na tela
    const animateOnScroll = () => {
        // Seleciona todos os elementos que devem ser animados
        const elements = document.querySelectorAll('.pricing-info-container, .pricing-table-container, .pricing-cards-container, .faq-container');
        
        // Para cada elemento
        elements.forEach(element => {
            // Obtém a posição do elemento em relação à janela
            const elementPosition = element.getBoundingClientRect().top;
            // Define a posição da tela para ativar a animação
            const screenPosition = window.innerHeight / 1.2;
            
            // Se o elemento está visível na tela
            if (elementPosition < screenPosition) {
                // Torna o elemento visível e na posição normal
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // ====== CONFIGURAÇÃO INICIAL DOS ELEMENTOS ANIMADOS ======
    // Seleciona todos os elementos que serão animados
    const animatedElements = document.querySelectorAll('.pricing-info-container, .pricing-table-container, .pricing-cards-container, .faq-container');
    
    // Para cada elemento animado
    animatedElements.forEach(el => {
        // Define o estado inicial (invisível e deslocado para baixo)
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        // Adiciona transição CSS para suavizar a animação
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Verifica os elementos na carga inicial da página
    animateOnScroll();
    
    // Verifica os elementos sempre que ocorre scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // ====== ANIMAÇÃO DOS BOTÕES "ORDER NOW" ======
    // Seleciona todos os botões de pedido
    const orderButtons = document.querySelectorAll('.order-now-btn, .price-btn.primary');
    
    // Para cada botão
    orderButtons.forEach(button => {
        // Animação quando o mouse entra no botão
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        // Animação quando o mouse sai do botão
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});