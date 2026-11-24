/* БрендUa: YouTube і Google Maps підключаються лише після дії користувача.
   Початкове завантаження сторінки не звертається до сторонніх iframe. */
(function () {
  'use strict';

  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-embed-activate]');
    if (!button) return;
    const container = button.closest('[data-deferred-embed]');
    if (!container || container.dataset.loaded === 'true') return;

    const url = container.dataset.embedSrc;
    const type = container.dataset.embedKind;
    if (!url || !(
      (type === 'video' && url.startsWith('https://www.youtube-nocookie.com/embed/')) ||
      (type === 'map' && url.startsWith('https://www.google.com/maps?'))
    )) return;

    const frame = document.createElement('iframe');
    frame.src = url;
    frame.title = container.dataset.embedTitle || 'Вбудований вміст';
    frame.className = type === 'map'
      ? 'w-full h-full min-h-[350px] border-0'
      : 'w-full h-full border-0';
    frame.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.setAttribute('allowfullscreen', '');
    frame.style.display = 'block';
    container.dataset.loaded = 'true';
    container.replaceChildren(frame);
    frame.focus();
  });
})();
