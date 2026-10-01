(function () {
  function pageUrl() {
    return window.location.href.split('#')[0];
  }

  document.querySelectorAll('[data-blog-share]').forEach(function (link) {
    var base = link.getAttribute('href') || '';
    link.setAttribute('href', base + encodeURIComponent(pageUrl()));
  });

  var copyBtn = document.querySelector('[data-blog-copy]');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = pageUrl();
      var done = function () {
        var prev = null;
        copyBtn.childNodes.forEach(function (n) {
          if (n.nodeType === 3 && n.textContent.trim()) prev = n;
        });
        copyBtn.classList.add('is-copied');
        if (prev) prev.textContent = ' Copiado';
        window.setTimeout(function () {
          copyBtn.classList.remove('is-copied');
          if (prev) prev.textContent = ' Copiar enlace';
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done).catch(function () {
          window.prompt('Copia el enlace:', url);
        });
      } else {
        window.prompt('Copia el enlace:', url);
      }
    });
  }

  /* ── Más notas carousel ───────────────────────────────────── */
  var viewport = document.getElementById('blogMoreViewport');
  var track = document.getElementById('blogMoreTrack');
  var prevBtn = document.getElementById('blogMorePrev');
  var nextBtn = document.getElementById('blogMoreNext');
  if (!viewport || !track) return;

  function cardStep() {
    var card = track.querySelector('.blog-more-card');
    if (!card) return 320;
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap) || 20;
    return card.getBoundingClientRect().width + gap;
  }

  function updateNav() {
    var max = viewport.scrollWidth - viewport.clientWidth - 2;
    if (prevBtn) prevBtn.disabled = viewport.scrollLeft <= 2;
    if (nextBtn) nextBtn.disabled = viewport.scrollLeft >= max;
  }

  function scrollByDir(dir) {
    viewport.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
  }

  prevBtn?.addEventListener('click', function () { scrollByDir(-1); });
  nextBtn?.addEventListener('click', function () { scrollByDir(1); });
  viewport.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();
})();
