// modal-script.js ATUALIZADO para interface fixa
document.addEventListener('DOMContentLoaded', function () {

    // cria o modal dinamicamente
    const modal = document.createElement('div');
    modal.className = 'portfolio-modal';
    modal.innerHTML = `
        <div class="modal-body" role="dialog" aria-modal="true" aria-label="Visualizador de imagem" tabindex="-1">
            <button class="modal-close" aria-label="Fechar (Esc)">✕</button>

            <div class="image-wrapper">
                <img class="modal-image" src="" alt="">
            </div>

            <div class="modal-controls" aria-hidden="false">
                <div class="modal-controls-bg">
                    <button class="modal-zoom-btn" data-action="zoom-out" aria-label="Diminuir zoom" tabindex="0">−</button>
                    <input id="zoomRange" type="range" min="0.5" max="3" step="0.01" value="1" aria-label="Controle de zoom">
                    <button class="modal-zoom-btn" data-action="zoom-in" aria-label="Aumentar zoom" tabindex="0">+</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalBody = modal.querySelector('.modal-body');
    const modalImg = modal.querySelector('.modal-image');
    const closeBtn = modal.querySelector('.modal-close');
    const zoomRange = modal.querySelector('#zoomRange');
    const btnZoomIn = modal.querySelector('[data-action="zoom-in"]');
    const btnZoomOut = modal.querySelector('[data-action="zoom-out"]');
    const imageWrapper = modal.querySelector('.image-wrapper');

    let currentZoom = 1;
    let isDragging = false;
    let startX, startY;
    let imgOffsetX = 0, imgOffsetY = 0;

    // --- Abrir modal (torna a função global) ---
    window.openModal = function(src, alt = '') {
        // Pré-carrega a imagem
        const tempImg = new Image();
        tempImg.onload = function() {
            modalImg.src = src;
            modalImg.alt = alt;
            zoomRange.value = 1;
            applyZoom(1);
            
            // Reset da posição da imagem
            modalImg.style.left = '0px';
            modalImg.style.top = '0px';
            imgOffsetX = 0;
            imgOffsetY = 0;
            
            modal.classList.add('visible');
            document.body.style.overflow = 'hidden';
            modalBody.focus();
        };
        tempImg.src = src;
    };

    // --- Fechar modal ---
    function closeModal() {
        modal.classList.remove('visible');
        modalImg.src = '';
        zoomRange.value = 1;
        applyZoom(1);

        // Reset completo
        modalImg.style.left = '0px';
        modalImg.style.top = '0px';
        imgOffsetX = 0;
        imgOffsetY = 0;
        modalImg.classList.remove('zoomed');
        modalImg.style.cursor = 'pointer';
        modalImg.style.position = 'static';

        document.body.style.overflow = '';
    }

    // --- Aplicar Zoom (atualizado para interface fixa) ---
    function applyZoom(value) {
        currentZoom = value;
        modalImg.style.transform = `scale(${value})`;

        if (value > 1) {
            modalImg.classList.add('zoomed');
            modalImg.style.cursor = 'grab';
            modalImg.style.position = 'relative';
        } else {
            modalImg.classList.remove('zoomed');
            modalImg.style.cursor = 'pointer';
            modalImg.style.left = '0px';
            modalImg.style.top = '0px';
            modalImg.style.position = 'static';
            imgOffsetX = 0;
            imgOffsetY = 0;
        }
    }

    // --- Zoom pelo slider ---
    zoomRange.addEventListener('input', function () {
        applyZoom(parseFloat(this.value));
    });

    // --- Botões + e - ---
    btnZoomIn.addEventListener('click', function () {
        let val = parseFloat(zoomRange.value);
        val = Math.min(3, val + 0.1);
        zoomRange.value = val.toFixed(2);
        applyZoom(val);
    });

    btnZoomOut.addEventListener('click', function () {
        let val = parseFloat(zoomRange.value);
        val = Math.max(0.5, val - 0.1);
        zoomRange.value = val.toFixed(2);
        applyZoom(val);
    });

    // --- Fechar ---
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
            closeModal();
        }
    });

    // --- Abrir ao clicar na galeria ---
    document.querySelectorAll('.portfolio-card img, .card-expand-btn').forEach(element => {
        element.addEventListener('click', function (e) {
            if (this.classList.contains('card-expand-btn')) {
                e.stopPropagation();
                const img = this.closest('.card-image-container').querySelector('img');
                const full = img.dataset.full || img.src;
                window.openModal(full, img.alt || '');
            } else {
                const full = this.dataset.full || this.src;
                window.openModal(full, this.alt || '');
            }
        });
    });

    // --- Zoom com scroll (no wrapper, não na imagem) ---
    imageWrapper.addEventListener('wheel', function (e) {
        e.preventDefault();
        let val = currentZoom + (e.deltaY < 0 ? 0.1 : -0.1);
        val = Math.min(3, Math.max(0.5, val));
        zoomRange.value = val.toFixed(2);
        applyZoom(val);
    }, { passive: false });

    // --- Bloquear arraste nativo ---
    modalImg.addEventListener('dragstart', e => e.preventDefault());

    // --- Arrastar imagem quando ampliada (atualizado) ---
    modalImg.addEventListener('mousedown', e => {
        if (currentZoom > 1) {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX - imgOffsetX;
            startY = e.clientY - imgOffsetY;
            modalImg.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            modalImg.style.cursor = currentZoom > 1 ? 'grab' : 'pointer';
        }
    });

    document.addEventListener('mousemove', e => {
        if (isDragging && currentZoom > 1) {
            e.preventDefault();
            imgOffsetX = e.clientX - startX;
            imgOffsetY = e.clientY - startY;
            
            // Limitar o arrasto para não sair muito da viewport
            const wrapperRect = imageWrapper.getBoundingClientRect();
            const imgRect = modalImg.getBoundingClientRect();
            const maxX = Math.max(0, (imgRect.width * currentZoom - wrapperRect.width) / 2);
            const maxY = Math.max(0, (imgRect.height * currentZoom - wrapperRect.height) / 2);
            
            imgOffsetX = Math.max(-maxX, Math.min(maxX, imgOffsetX));
            imgOffsetY = Math.max(-maxY, Math.min(maxY, imgOffsetY));
            
            modalImg.style.left = `${imgOffsetX}px`;
            modalImg.style.top = `${imgOffsetY}px`;
        }
    });

    // Suporte para touch devices
    modalImg.addEventListener('touchstart', e => {
        if (currentZoom > 1 && e.touches.length === 1) {
            e.preventDefault();
            isDragging = true;
            startX = e.touches[0].clientX - imgOffsetX;
            startY = e.touches[0].clientY - imgOffsetY;
        }
    });

    document.addEventListener('touchend', () => {
        isDragging = false;
    });

    document.addEventListener('touchmove', e => {
        if (isDragging && currentZoom > 1 && e.touches.length === 1) {
            e.preventDefault();
            imgOffsetX = e.touches[0].clientX - startX;
            imgOffsetY = e.touches[0].clientY - startY;
            
            modalImg.style.left = `${imgOffsetX}px`;
            modalImg.style.top = `${imgOffsetY}px`;
        }
    });
});