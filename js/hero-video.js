/* Hero-відео: завантажується без очікування window.load/idle;
   фото WebP використовується як резервний фон. */
(() => {
  'use strict';
  const hero = document.getElementById('hero-banner');
  const video = document.getElementById('hero-video');
  if (!hero || !video) return;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const showPhoto = () => hero.classList.remove('is-video-playing');
  const showVideo = () => {
    if (!motion.matches && !document.hidden) {
      hero.classList.add('is-video-playing');
    }
  };

  function playVideo() {
    if (motion.matches || document.hidden) return;
    video.muted = true;
    const request = video.play();
    if (request && typeof request.catch === 'function') {
      request.catch(showPhoto);
    }
  }

  function pauseVideo() {
    video.pause();
    showPhoto();
  }

  video.addEventListener('playing', showVideo);
  video.addEventListener('pause', showPhoto);
  video.addEventListener('error', showPhoto);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseVideo();
    else playVideo();
  });
  window.addEventListener('pageshow', (event) => {
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

  if (motion.matches || document.hidden) {
    pauseVideo();
  } else {
    playVideo();
    if (!video.paused && video.readyState >= 2) showVideo();
  }
})();
