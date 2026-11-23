/* БрендUa: одна тема для всіх сторінок, без додаткових бібліотек. */
(function () {
  'use strict';
  const key = 'brendua-theme';
  let saved = 'light';
  try { saved = localStorage.getItem(key) === 'dark' ? 'dark' : 'light'; } catch (_) {}
  const root = document.documentElement;
  root.setAttribute('data-theme', saved);
  root.style.colorScheme = saved;

  function updateButtons() {
    const dark = root.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
      button.setAttribute('title', dark ? 'Світла тема' : 'Темна тема');
      const i = button.querySelector('i');
      if (i) i.className = 'fas ' + (dark ? 'fa-sun' : 'fa-moon');
      const caption = button.querySelector('.theme-toggle-label');
      if (caption) caption.textContent = dark ? 'Світла тема' : 'Темна тема';
    });
  }
  function setTheme(theme, persist) {
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    if (persist) {
      try { localStorage.setItem(key, theme); } catch (_) {}
    }
    updateButtons();
  }
  // Делегування: кнопка динамічно додається js/shop.js у шапку.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.theme-toggle');
    if (!button) return;
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
  });
  window.addEventListener('storage', (event) => {
    if (event.key === key) setTheme(event.newValue === 'dark' ? 'dark' : 'light', false);
  });
  document.addEventListener('DOMContentLoaded', updateButtons);
  window.BrendTheme = { refresh: updateButtons };
})();
