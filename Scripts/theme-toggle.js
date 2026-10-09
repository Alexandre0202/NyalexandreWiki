document.addEventListener('DOMContentLoaded', () => {
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
            button.innerHTML = `
                <i class="${isDark ? 'fas fa-sun' : 'fas fa-moon'}"></i>
                <span class="theme-toggle-label">${isDark ? 'Light mode' : 'Dark mode'}</span>
            `;
        });
    }
});
