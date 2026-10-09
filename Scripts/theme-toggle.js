document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.ms-bottom-bar .theme-toggle-btn');
    const desktopToggle = document.querySelector('.ms-nav .theme-toggle-btn');
    const floatingToggle = mobileToggle || desktopToggle;

    [mobileToggle, desktopToggle].forEach((button) => {
        if (button && button !== floatingToggle) {
            button.closest('li')?.remove();
        }
    });

    if (floatingToggle) {
        floatingToggle.classList.add('theme-toggle-btn--floating');
        floatingToggle.closest('li')?.remove();
        document.body.appendChild(floatingToggle);
    }

    const toggleButtons = Array.from(document.querySelectorAll('.theme-toggle-btn'));

    const savedTheme = localStorage.getItem('theme');
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || preferredTheme;

    applyTheme(initialTheme);

    toggleButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
        });
    });

    function applyTheme(theme) {
        document.body.dataset.theme = theme;
        localStorage.setItem('theme', theme);

        const isDark = theme === 'dark';

        toggleButtons.forEach((button) => {
            button.setAttribute('aria-pressed', String(isDark));
            button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            button.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            button.innerHTML = `
                <i class="${isDark ? 'fas fa-sun' : 'fas fa-moon'}"></i>
                <span class="theme-toggle-label">${isDark ? 'Light mode' : 'Dark mode'}</span>
            `;
        });
    }
});
