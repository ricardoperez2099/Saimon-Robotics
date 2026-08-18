(function () {
  const buttons = document.querySelectorAll('[data-mega]');
  const menus = document.querySelectorAll('.mega-menu');
  if (!buttons.length || !menus.length) return;

  function closeMega() {
    menus.forEach((menu) => menu.classList.remove('is-open'));
    buttons.forEach((btn) => {
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    document.body.classList.remove('mega-open');
  }

  function openMega(id) {
    const menu = document.getElementById('mega-' + id);
    if (!menu) return;
    const alreadyOpen = menu.classList.contains('is-open');
    closeMega();
    if (alreadyOpen) return;
    menu.classList.add('is-open');
    document.body.classList.add('mega-open');
    buttons.forEach((btn) => {
      const on = btn.dataset.mega === id;
      btn.classList.toggle('is-open', on);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    document.getElementById('mobileMenu')?.classList.remove('open');
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMega(btn.dataset.mega);
    });
  });

  menus.forEach((menu) => {
    menu.addEventListener('click', (e) => e.stopPropagation());
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        window.setTimeout(closeMega, 0);
      });
    });
  });

  document.addEventListener('click', closeMega);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMega();
  });
  window.addEventListener('scroll', () => {
    if (document.body.classList.contains('mega-open')) closeMega();
  }, { passive: true });

  document.getElementById('hamburgerBtn')?.addEventListener('click', closeMega);
  document.querySelectorAll('[data-open-contact]').forEach((el) => {
    el.addEventListener('click', closeMega);
  });
})();
