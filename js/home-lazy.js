/* ЛР12: відкладене завантаження бібліотек для нижніх секцій.
   Без змін у дизайні, DOM і логіці магазину. */
(() => {
  'use strict';
  const loadScript = (url) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Не вдалося завантажити ' + url));
    document.head.appendChild(script);
  });

  function whenNear(selector, callback) {
    const element = document.querySelector(selector);
    if (!element) return;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      callback();
    };
    if (!('IntersectionObserver' in window)) {
      start();
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        start();
      }
    }, { rootMargin: '850px 0px' });
    observer.observe(element);
  }

  whenNear('.reviews-swiper', async () => {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
      if (!window.Swiper) return;
      new window.Swiper('.reviews-swiper', {
        loop: true, spaceBetween: 24, slidesPerView: 1,
        autoplay: { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: { el: '.reviews-pagination', clickable: true },
        navigation: { nextEl: '.reviews-next', prevEl: '.reviews-prev' },
        breakpoints: { 320: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 2 } }
      });
    } catch (error) { console.warn('Swiper недоступний:', error.message); }
  });

  whenNear('[data-fancybox="brand-gallery"]', async () => {
    try {
      await loadScript('https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js');
      if (!window.Fancybox) return;
      window.Fancybox.bind('[data-fancybox="brand-gallery"]', {
        Carousel: { transition: 'fade' },
        Images: { Panzoom: { maxScale: 3 } }
      });
    } catch (error) { console.warn('Fancybox недоступний:', error.message); }
  });

  // Легка заміна Typed.js без сторонньої бібліотеки.
  const typed = document.getElementById('typed-text');
  if (typed) {
    const phrases = [
      'Український стиль для кожного.',
      'Якість та комфорт щодня.',
      'Знайди свій ідеальний образ.'
    ];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typed.textContent = phrases[0];
    } else {
      let phrase = 0, offset = 0, backwards = false;
      typed.textContent = '';
      function advance() {
        const value = phrases[phrase];
        offset += backwards ? -1 : 1;
        typed.textContent = value.slice(0, offset);
        if (!backwards && offset === value.length) {
          backwards = true;
          window.setTimeout(advance, 1500);
          return;
        }
        if (backwards && offset === 0) {
          backwards = false;
          phrase = (phrase + 1) % phrases.length;
          window.setTimeout(advance, 400);
          return;
        }
        window.setTimeout(advance, backwards ? 30 : 50);
      }
      window.setTimeout(advance, 150);
    }
  }
})();
