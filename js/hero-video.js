/* БрендUa: постійне беззвучне відтворення Hero-відео після завантаження основного вмісту.
   Фото Hero_bg.png завантажується першим та лишається запасним фоном.
   Відео зупиняється тільки в неактивній вкладці або при prefers-reduced-motion. */
(function () {
  'use strict';

  const hero = document.getElementById('hero-banner');
  const video = document.getElementById('hero-video');
  if (!hero || !video) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sources = video.querySelectorAll('source[data-src]');
  let sourcesLoaded = false;

  function showPhoto() {
    hero.classList.remove('is-video-playing');
  }

  function loadSources() {
    if (sourcesLoaded) return;
    sourcesLoaded = true;
    sources.forEach(source => {
      source.src = source.dataset.src;
    });
    video.load();
  }

  function playVideo() {
    if (document.hidden || motion.matches) return;
    loadSources();
    video.muted = true;
    const playRequest = video.play();
    if (playRequest && typeof playRequest.catch === 'function') {
      playRequest.catch(showPhoto);
    }
  }

  function pauseVideo() {
    video.pause();
    showPhoto();
  }

  video.addEventListener('playing', () => {
    if (!motion.matches && !document.hidden) {
      hero.classList.add('is-video-playing');
    }
  });
  video.addEventListener('error', showPhoto);
  video.addEventListener('pause', showPhoto);

  // Спочатку малюємо сторінку й фото; відео починає завантажуватися після window.load.
  // requestIdleCallback не блокує першочергові завдання браузера.
  function startAfterPageLoad() {
    if (document.hidden || motion.matches) return;
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(playVideo, { timeout: 1500 });
    } else {
      window.setTimeout(playVideo, 250);
    }
  }

  if (document.readyState === 'complete') {
    startAfterPageLoad();
  } else {
    window.addEventListener('load', startAfterPageLoad, { once: true });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseVideo();
    else playVideo();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) playVideo();
  });

  function onMotionChange(event) {
    if (event.matches) pauseVideo();
    else playVideo();
  }
  if (typeof motion.addEventListener === 'function') {
    motion.addEventListener('change', onMotionChange);
  } else if (typeof motion.addListener === 'function') {
    motion.addListener(onMotionChange);
  }
})();
