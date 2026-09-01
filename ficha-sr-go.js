(function () {
  const IMG = 'robots/entrega 2/';

  const specSets = {
    ruta: [
      { label: 'Velocidad máx.', value: '6 km/h', note: 'Desplazamiento seguro por aceras y vialidades internas.' },
      { label: 'Mapeo', value: 'En tiempo real', note: 'Ruteo dinámico por aceras y vialidades del campus.' },
      { label: 'Terreno', value: 'Vialidad controlada', note: 'Aceras, andadores y vialidades internas pavimentadas.' }
    ],
    entrega: [
      { label: 'Compartimentos', value: '1 principal', note: 'Ventana de acceso controlado, visible desde el exterior.' },
      { label: 'Capacidad', value: '20 kg', note: 'Carga máxima por trayecto.' },
      { label: 'Confirmación', value: 'Notificación + código', note: 'Apertura remota al llegar con el destinatario.' }
    ],
    deteccion: [
      { label: 'Sensores frontales', value: '360°', note: 'Detección de obstáculos y peatones en tiempo real.' },
      { label: 'Evasión', value: 'Automática', note: 'Ajuste de ruta ante obstáculos sin detener la entrega.' },
      { label: 'Indicador visual', value: 'Matriz de puntos', note: 'Comunica estado de operación a quien se acerca.' }
    ],
    recarga: [
      { label: 'Autonomía', value: '10 h', note: 'Ruta de entrega prolongada por carga.' },
      { label: 'Recarga', value: 'Automática', note: 'Retorno a estación de carga al detectar batería baja.' },
      { label: 'Monitoreo', value: 'SaimonIQ', note: 'Ubicación y estado de la flota en tiempo real.' }
    ]
  };

  const opsPosters = {
    ruta: { poster: IMG + 'srgo-warehouse-wide.png', alt: 'Ruta autónoma' },
    entrega: { poster: IMG + 'srgo-studio-front-package.png', alt: 'Entrega segura' },
    deteccion: { poster: IMG + 'srgo-eyes-closeup.jpg', alt: 'Detección de obstáculos' },
    recarga: { poster: IMG + 'srgo-dusk-street.png', alt: 'Recarga automática' }
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
    const rows = specSets[key] || specSets.ruta;
    specsEl.innerHTML = rows.map(function (s) {
      return '<div class="ficha-spec">' +
        '<span class="ficha-spec-label">' + s.label + '</span>' +
        '<span class="ficha-spec-value">' + s.value + '</span>' +
        '<span class="ficha-spec-note">' + s.note + '</span>' +
      '</div>';
    }).join('');
  }
  renderSpecs('ruta');

  const videoWrap = document.getElementById('fichaVideo');
  const video = videoWrap?.querySelector('video');
  const videoSource = video?.querySelector('source');
  const poster = document.getElementById('fichaVideoPoster');
  const playBtn = videoWrap?.querySelector('.ficha-video-play');
  const label = document.getElementById('fichaVideoLabel');

  function loadOpsPoster(key) {
    const clip = opsPosters[key] || opsPosters.ruta;
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
    if (label) label.textContent = 'VIDEO · 01:32';
  }
  loadOpsPoster('ruta');

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
