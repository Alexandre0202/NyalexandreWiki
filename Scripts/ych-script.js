// ===========================================
// YCH PAGE SCRIPT - Nyale Commissions
// Funcionalidades específicas para página YCH
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
   
   // ====== CONTADOR DE SLOTS ======
   // Atualiza os contadores de slots disponíveis
   function updateSlotCounters() {
      const availableYchs = document.querySelectorAll('.style-badge:not(.ych-soldout):not(.ych-waitlist)').length;
      const activeYchsElement = document.getElementById('activeYchs');
      const availableSlotsElement = document.getElementById('availableSlots');
      
      if (activeYchsElement) {
         activeYchsElement.textContent = availableYchs;
      }
      
      // Calcula slots disponíveis (simulação)
      let totalSlots = 0;
      const slotElements = document.querySelectorAll('.feature-item h4, .feature-item2 h4, .feature-item3 h4, .feature-item4 h4');
      
      slotElements.forEach(element => {
         const text = element.textContent;
         if (text.includes('slots')) {
            const match = text.match(/(\d+)\/(\d+)/);
            if (match) {
               totalSlots += parseInt(match[1]);
            }
         }
      });
      
      if (availableSlotsElement) {
         availableSlotsElement.textContent = totalSlots;
      }
   }
   
   // Inicializa contadores
   updateSlotCounters();
   
   // ====== EXPANSÃO DE IMAGENS ======
   // Abre imagem no modal ao clicar
   const ychImages = document.querySelectorAll('.ych-static-image img');
   const modal = document.getElementById('ych-modal');
   const modalImage = modal?.querySelector('.modal-image');
   const modalClose = modal?.querySelector('.modal-close');

   if (modal && modalImage && modalClose) {
      ychImages.forEach(img => {
         img.addEventListener('click', function() {
            modalImage.src = this.dataset.full || this.src;
            modalImage.alt = this.alt;
            modal.querySelector('.reset-zoom')?.click();
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
         });
      });

      const closeModal = () => {
         modal.classList.remove('visible');
         document.body.style.overflow = '';
      };

      modalClose.addEventListener('click', closeModal);
      modal.addEventListener('click', function(e) {
         if (e.target === modal) closeModal();
      });
   }
   
   // ====== CONTROLE DE VÍDEO ======
   // Pausa vídeos quando não estão visíveis
   const videos = document.querySelectorAll('.ych-video');
   
   videos.forEach(video => {
      // Volume baixo por padrão
      video.volume = 0.3;
      
      // Pausa ao sair do vídeo
      video.addEventListener('mouseleave', function() {
         if (!this.paused) {
            this.pause();
         }
      });
   });
   
   // ====== BOTÃO VOLTAR AO TOPO ======
   const backToTopButton = document.getElementById('backToTop');
   
   window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
         backToTopButton.classList.add('visible');
      } else {
         backToTopButton.classList.remove('visible');
      }
   });
   
   backToTopButton.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   });
   
   // ====== ANIMAÇÃO DOS PREÇOS ======
   // Adiciona efeito hover nas tags de preço
   const priceTags = document.querySelectorAll('.ych-price-tag');
   
   priceTags.forEach(tag => {
      tag.addEventListener('mouseenter', function() {
         if (!this.classList.contains('ych-soldout-price')) {
            this.style.transform = 'scale(1.1)';
         }
      });
      
      tag.addEventListener('mouseleave', function() {
         this.style.transform = 'scale(1)';
      });
   });
   
   // ====== ATUALIZAÇÃO DE STATUS DINÂMICA ======
   // Simula atualização de status (para demonstração)
   function simulateStatusUpdate() {
      const badges = document.querySelectorAll('.style-badge');
      const randomIndex = Math.floor(Math.random() * badges.length);
      const randomBadge = badges[randomIndex];
      
      // Apenas para demonstração - muda status aleatoriamente
      if (Math.random() > 0.7 && !randomBadge.classList.contains('popular')) {
         const classes = ['ych-limited', 'ych-waitlist', 'ych-soldout'];
         const currentClass = Array.from(randomBadge.classList).find(cls => 
            cls.startsWith('ych-') && cls !== 'ych-price-tag'
         );
         
         if (currentClass) {
            randomBadge.classList.remove(currentClass);
         }
         
         const newClass = classes[Math.floor(Math.random() * classes.length)];
         randomBadge.classList.add(newClass);
         
         // Atualiza texto do badge
         switch(newClass) {
            case 'ych-limited':
               randomBadge.textContent = 'Limited';
               break;
            case 'ych-waitlist':
               randomBadge.textContent = 'Waitlist';
               break;
            case 'ych-soldout':
               randomBadge.textContent = 'Sold Out';
               break;
         }
         
         // Atualiza contadores
         updateSlotCounters();
      }
   }
   
   // Simula atualização a cada 30 segundos (comentar se não quiser)
   // setInterval(simulateStatusUpdate, 30000);
   
   console.log('YCH page script loaded successfully!');
});