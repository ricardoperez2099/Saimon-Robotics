(function () {
  const IMG = 'robots/humanoide/';

  const specSets = {
    manipulacion: [
      { label: 'GDL por mano', value: '12', note: 'Manipulación bimórfica de objetos irregulares.' },
      { label: 'Torque máx.', value: '360 N·m', note: 'En articulación de hombro, configuración industrial.' },
      { label: 'Precisión', value: '±0.5 mm', note: 'Repetibilidad en tareas de ensamble fino.' }
    ],
    vision: [
      { label: 'Visión', value: 'Estéreo 3D', note: 'Reconocimiento y localización de objetos en tiempo real.' },
      { label: 'Campo visual', value: '120°', note: 'Cobertura frontal ampliada por par estéreo.' },
      { label: 'Latencia', value: '< 40 ms', note: 'De detección a instrucción de agarre.' }
    ],
    aprendizaje: [
      { label: 'Modo', value: 'Por imitación', note: 'Aprende nuevas tareas a partir de demostración humana.' },
      { label: 'Curva', value: '< 10 repeticiones', note: 'Para consolidar una secuencia de manipulación simple.' },
      { label: 'Biblioteca', value: 'Ampliable', note: 'Tareas aprendidas se comparten entre unidades.' }
    ],
    conectividad: [
      { label: 'Actualizaciones', value: 'OTA', note: 'Mejora continua de modelos de percepción y control.' },
      { label: 'Monitoreo', value: 'SaimonIQ', note: 'Telemetría y video en vivo desde la app.' },
      { label: 'Autonomía', value: '2 h', note: 'Batería intercambiable en caliente.' }
    ]
  };

  const opsVideos = {
    manipulacion: {
      src: IMG + 'manipulacion_biomorfica.mp4',
      poster: IMG + 'manipulacion_biomorfica-poster.jpg',
      alt: 'Manipulación bimórfica'
    },
    vision: {
      src: IMG + 'vision-estereo.mp4',
      poster: IMG + 'vision-estereo-poster.jpg',
      alt: 'Visión estéreo'
    },
    aprendizaje: {
      src: IMG + 'aprendizaje-adaptativo.mp4',
      poster: IMG + 'aprendizaje-adaptativo-poster.jpg',
      alt: 'Aprendizaje adaptativo'
    },
    conectividad: {
      src: IMG + 'actualizaciones-remotas.mp4',
      poster: IMG + 'actualizaciones-remotas-poster.jpg',
      alt: 'Actualizaciones remotas'
    }
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
    const rows = specSets[key] || specSets.manipulacion;
    specsEl.innerHTML = rows.map(function (s) {
      return '<div class="ficha-spec">' +
        '<span class="ficha-spec-label">' + s.label + '</span>' +
        '<span class="ficha-spec-value">' + s.value + '</span>' +
        '<span class="ficha-spec-note">' + s.note + '</span>' +
      '</div>';
    }).join('');
  }
  renderSpecs('manipulacion');

  const videoWrap = document.getElementById('fichaVideo');
  const video = videoWrap?.querySelector('video');
  const videoSource = video?.querySelector('source');
  const poster = document.getElementById('fichaVideoPoster');
  const playBtn = videoWrap?.querySelector('.ficha-video-play');
  const label = document.getElementById('fichaVideoLabel');

  function formatDuration(s) {
    if (!isFinite(s) || s <= 0) return 'VIDEO';
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return 'VIDEO · ' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  }

  function loadOpsVideo(key) {
    const clip = opsVideos[key] || opsVideos.manipulacion;
    if (!video || !videoSource) return;
    video.pause();
    videoWrap.classList.remove('is-playing');
    video.currentTime = 0;
    if (poster) {
      poster.src = encodeURI(clip.poster);
      poster.alt = clip.alt;
    }
    video.poster = encodeURI(clip.poster);
    videoSource.src = encodeURI(clip.src);
    video.load();
    if (label) label.textContent = 'VIDEO';
  }
  loadOpsVideo('manipulacion');

  video?.addEventListener('error', function () {
    videoWrap.classList.remove('is-playing');
    if (label) label.textContent = 'VIDEO NO DISPONIBLE';
  });

  video?.addEventListener('loadedmetadata', function () {
    if (label) label.textContent = formatDuration(video.duration);
  });

  video?.addEventListener('ended', function () {
    videoWrap.classList.remove('is-playing');
    video.pause();
    video.currentTime = 0;
  });

  playBtn?.addEventListener('click', function () {
    videoWrap.classList.add('is-playing');
    video.muted = false;
    const p = video.play();
    if (p && p.catch) p.catch(function () { video.muted = true; video.play(); });
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
        loadOpsVideo(key);
        return;
      }
      videoWrap.classList.add('is-fading');
      specsEl.classList.add('is-fading');
      window.setTimeout(function () {
        renderSpecs(key);
        loadOpsVideo(key);
        requestAnimationFrame(function () {
          videoWrap.classList.remove('is-fading');
          specsEl.classList.remove('is-fading');
        });
      }, 160);
    });
  });
})();
