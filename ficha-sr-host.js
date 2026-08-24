(function () {
  const IMG = 'robots/hosteleria/';

  const specSets = {
    navegacion: [
      { label: 'Velocidad máx.', value: '1.1 m/s', note: 'Desplazamiento seguro en áreas concurridas.' },
      { label: 'Detección', value: '360°', note: 'Sensores de proximidad y cámaras de navegación.' },
      { label: 'Terreno', value: 'Interior liso', note: 'Piso pulido, alfombra de bajo pelo, rampas suaves.' }
    ],
    autonomia: [
      { label: 'Autonomía', value: '8 h', note: 'Jornada continua de entregas por carga.' },
      { label: 'Recarga', value: '2 h', note: 'Retorno automático a estación de carga.' },
      { label: 'Espera activa', value: '12 h', note: 'En modo standby entre asignaciones.' }
    ],
    compartimento: [
      { label: 'Capacidad', value: '3 compartimentos', note: 'Apertura independiente por código o app.' },
      { label: 'Carga máx.', value: '15 kg', note: 'Distribuida entre compartimentos.' },
      { label: 'Seguridad', value: 'Cierre asistido', note: 'Confirmación de entrega con notificación al huésped.' }
    ],
    conectividad: [
      { label: 'Enlaces', value: 'WiFi 6 · 4G', note: 'Conmutación automática entre redes del sitio.' },
      { label: 'Monitoreo', value: 'SaimonIQ', note: 'Seguimiento de entregas y flota en tiempo real.' },
      { label: 'Integración', value: 'PMS / API', note: 'Conecta con sistemas de gestión hotelera.' }
    ]
  };

  const opsPosters = {
    navegacion: { poster: IMG + 'srhost-corridor-hotel-02.png', alt: 'Navegación en interiores' },
    autonomia: { poster: IMG + 'srhost-kitchen-charging.png', alt: 'Autonomía de jornada' },
    compartimento: { poster: IMG + 'srhost-guest-compartment.png', alt: 'Compartimento de entrega' },
    conectividad: { poster: IMG + 'srhost-lobby-bellhop.png', alt: 'Conectividad y monitoreo' }
  };

  const features = document.querySelectorAll('.ficha-feature');
  const featObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) entry.target.classList.add('is-in');
    });
  }, { threshold: 0.2 });
  features.forEach(function (el) { featObs.observe(el); });

  const layers = document.querySelectorAll('[data-parallax]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;
  function updateParallax() {
    ticking = false;
    if (reduceMotion.matches) {
      layers.forEach(function (el) { el.style.transform = ''; });
      return;
    }
    layers.forEach(function (el) {
      const factor = parseFloat(el.dataset.parallax) || 0.12;
      const rect = el.parentElement.getBoundingClientRect();
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = 'translate3d(0,' + (mid * factor * -1) + 'px,0)';
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  updateParallax();

  const gallery = document.getElementById('fichaGallery');
  const track = document.getElementById('fichaGalleryTrack');
  const fill = document.getElementById('fichaGalleryProgressFill');
  const prevBtn = document.getElementById('fichaGalleryPrev');
  const nextBtn = document.getElementById('fichaGalleryNext');
  const originals = track ? Array.from(track.children) : [];
  const n = originals.length;

  if (track && n > 1) {
    const head = originals[0].cloneNode(true);
    const tail = originals[n - 1].cloneNode(true);
    head.setAttribute('aria-hidden', 'true');
    tail.setAttribute('aria-hidden', 'true');
    head.classList.remove('is-on');
    tail.classList.remove('is-on');
    track.appendChild(head);
    track.insertBefore(tail, track.firstChild);
  }

  const items = track ? Array.from(track.children) : [];
  let slide = n > 1 ? 1 : 0;
  let jumping = false;
  let timer = 0;

  function primeGalleryImages() {
    items.forEach(function (item) {
      const img = item.querySelector('img');
      if (!img) return;
      const src = img.getAttribute('src');
      if (src) img.src = encodeURI(src);
    });
  }
  primeGalleryImages();

  function galleryMetrics() {
    const item = items[0];
    const slideW = item.getBoundingClientRect().width;
    const styles = getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 20;
    return { slideW: slideW, gap: gap };
  }

  function realIndex() {
    if (n <= 1) return 0;
    if (slide === 0) return n - 1;
    if (slide === n + 1) return 0;
    return slide - 1;
  }

  function goTo(i, instant) {
    if (!track || !items.length) return;
    slide = i;
    const m = galleryMetrics();
    if (instant) track.style.transition = 'none';
    track.style.transform = 'translateX(' + (-slide * (m.slideW + m.gap)) + 'px)';
    items.forEach(function (el, idx) { el.classList.toggle('is-on', idx === slide); });
    if (fill) {
      fill.style.width = (100 / Math.max(n, 1)) + '%';
      fill.style.transform = 'translateX(' + (realIndex() * 100) + '%)';
    }
    if (instant) {
      void track.offsetHeight;
      track.style.transition = '';
    }
  }

  function next() { goTo(slide + 1); }
  function prev() { goTo(slide - 1); }

  function playGallery() {
    stopGallery();
    if (n < 2) return;
    timer = window.setInterval(next, 4200);
  }
  function stopGallery() {
    if (timer) window.clearInterval(timer);
    timer = 0;
  }

  track?.addEventListener('transitionend', function (e) {
    if (e.target !== track || e.propertyName !== 'transform') return;
    if (n <= 1 || jumping) return;
    if (slide === n + 1) {
      jumping = true;
      goTo(1, true);
      jumping = false;
    } else if (slide === 0) {
      jumping = true;
      goTo(n, true);
      jumping = false;
    }
  });

  items.forEach(function (el, i) {
    el.addEventListener('click', function () { if (i !== slide) goTo(i); });
  });
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);
  gallery?.addEventListener('mouseenter', stopGallery);
  gallery?.addEventListener('mouseleave', playGallery);
  gallery?.addEventListener('focusin', stopGallery);
  gallery?.addEventListener('focusout', playGallery);
  window.addEventListener('resize', function () { goTo(slide, true); });
  goTo(slide, true);
  playGallery();

  const specsEl = document.getElementById('fichaSpecs');
  function renderSpecs(key) {
    const rows = specSets[key] || specSets.navegacion;
    specsEl.innerHTML = rows.map(function (s) {
      return '<div class="ficha-spec">' +
        '<span class="ficha-spec-label">' + s.label + '</span>' +
        '<span class="ficha-spec-value">' + s.value + '</span>' +
        '<span class="ficha-spec-note">' + s.note + '</span>' +
      '</div>';
    }).join('');
  }
  renderSpecs('navegacion');

  const videoWrap = document.getElementById('fichaVideo');
  const video = videoWrap?.querySelector('video');
  const videoSource = video?.querySelector('source');
  const poster = document.getElementById('fichaVideoPoster');
  const playBtn = videoWrap?.querySelector('.ficha-video-play');
  const label = document.getElementById('fichaVideoLabel');

  function loadOpsPoster(key) {
    const clip = opsPosters[key] || opsPosters.navegacion;
    if (!video || !videoSource) return;
    video.pause();
    videoWrap.classList.remove('is-playing');
    video.currentTime = 0;
    videoSource.removeAttribute('src');
    video.load();
    if (poster) {
      poster.src = encodeURI(clip.poster);
      poster.alt = clip.alt;
    }
    video.poster = encodeURI(clip.poster);
    if (label) label.textContent = 'VIDEO · 01:48';
  }
  loadOpsPoster('navegacion');

  playBtn?.addEventListener('click', function () {
    if (typeof window.openContactModal === 'function') {
      window.openContactModal();
      return;
    }
    videoWrap.classList.add('is-playing');
  });

  document.querySelectorAll('.ficha-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      if (tab.classList.contains('is-on')) return;
      document.querySelectorAll('.ficha-tab').forEach(function (t) { t.classList.remove('is-on'); });
      tab.classList.add('is-on');
      const key = tab.dataset.tab;
      const fade = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (fade) {
        renderSpecs(key);
        loadOpsPoster(key);
        return;
      }
      videoWrap.classList.add('is-fading');
      specsEl.classList.add('is-fading');
      window.setTimeout(function () {
        renderSpecs(key);
        loadOpsPoster(key);
        requestAnimationFrame(function () {
          videoWrap.classList.remove('is-fading');
          specsEl.classList.remove('is-fading');
        });
      }, 160);
    });
  });
})();
