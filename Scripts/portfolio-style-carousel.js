document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".style-block").forEach(block => {
        const track = block.querySelector(".carousel-track");
        const slides = block.querySelectorAll(".carousel-track img");
        const btnPrev = block.querySelector(".prev");
        const btnNext = block.querySelector(".next");
        const indicators = block.querySelectorAll(".carousel-indicators button");

        let index = 0;

        function updateCarousel() {
            track.style.transform = `translateX(-${index * 100}%)`;
            indicators.forEach((btn, i) => {
                btn.classList.toggle("active", i === index);
            });
        }

        btnNext.addEventListener("click", () => {
            index = (index + 1) % slides.length;
            updateCarousel();
        });

        btnPrev.addEventListener("click", () => {
            index = (index - 1 + slides.length) % slides.length;
            updateCarousel();
        });

        indicators.forEach((btn, i) => {
            btn.addEventListener("click", () => {
                index = i;
                updateCarousel();
            });
        });

        // Auto-play opcional
        let autoPlay = setInterval(() => {
            index = (index + 1) % slides.length;
            updateCarousel();
        }, 5000);

        block.addEventListener("mouseenter", () => clearInterval(autoPlay));
        block.addEventListener("mouseleave", () => {
            autoPlay = setInterval(() => {
                index = (index + 1) % slides.length;
                updateCarousel();
            }, 5000);
        });

        updateCarousel();
    });
});
