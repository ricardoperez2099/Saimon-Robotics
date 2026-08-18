(function () {
  const pins = Array.from(document.querySelectorAll('[data-scale-pin]'));
  if (!pins.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  var GROW_END = 0.48;
  var COPY_IN = 0.1;

  function scaleProgress(p) {
    if (p >= GROW_END) return 1;
    return p / GROW_END;
  }

  function copyOpacity(p) {
    if (p < GROW_END) return 0;
    var t = (p - GROW_END) / COPY_IN;
    if (t >= 1) return 1;
    return easeInOut(Math.max(0, t));
  }

  function progress(el) {
    const rect = el.getBoundingClientRect();
    const travel = el.offsetHeight - window.innerHeight;
    if (travel <= 0) return 1;
    return Math.min(1, Math.max(0, -rect.top / travel));
  }

  function setAutoplay(el, p) {
    if (el.dataset.autoplay !== 'video') return;
    const video = el.querySelector('video');
    if (!video) return;
    const wrap = el.querySelector('.feature-video') || el;
    if (p >= GROW_END) {
      wrap.classList.add('is-playing');
      if (video.paused) {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      }
    } else if (!video.paused) {
      video.pause();
      wrap.classList.remove('is-playing');
    }
  }

  let ticking = false;

  function update() {
    ticking = false;
    const reduced = reduce.matches;
    pins.forEach(function (el) {
      const p = progress(el);
      const visual = reduced ? 1 : scaleProgress(p);
      el.style.setProperty('--pin-p', visual.toFixed(4));
      if (el.hasAttribute('data-scale-copy')) {
        el.style.setProperty('--pin-copy', reduced ? '1' : copyOpacity(p).toFixed(4));
      }
      const media = el.querySelector('.ficha-bleed-media');
      if (media && el.classList.contains('ficha-bleed--c')) {
        if (reduced) {
          media.style.transform = '';
        } else {
          media.style.transform = 'translate3d(0,' + ((visual - 1) * 56).toFixed(1) + 'px,0) scale(1.08)';
        }
      }
      setAutoplay(el, p);
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  if (typeof reduce.addEventListener === 'function') {
    reduce.addEventListener('change', update);
  }
  update();
})();
