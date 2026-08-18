(function () {
  const stack = document.getElementById('siteFabs');
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const showAt = 480;

  function toggle() {
    const visible = window.scrollY > showAt;
    if (stack) stack.classList.toggle('is-visible', visible);
    else btn.classList.toggle('is-visible', visible);
  }

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();
