(function () {
  const fab = document.getElementById('shopFab');
  const trigger = document.getElementById('shopFabBtn');
  if (!fab || !trigger) return;

  const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function setOpen(open) {
    fab.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (hoverFine) return;
    setOpen(!fab.classList.contains('is-open'));
  });

  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  function openContact(message) {
    const ta = document.querySelector('#contactForm textarea, .contact-form textarea');
    if (ta && message) ta.value = message;
    setOpen(false);
    if (typeof window.openContactModal === 'function') window.openContactModal();
  }

  function addQuote(type, price) {
    setOpen(false);
    const model = document.body.dataset.model;
    if (typeof window.addToCart === 'function') {
      window.addToCart({
        model,
        type,
        price,
        image: document.body.dataset.modelImage
      });
      return;
    }
    openContact('Me interesa ' + model + ' (' + (type === 'rent' ? 'renta' : 'compra') + ').');
  }

  fab.querySelectorAll('[data-shop]').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const action = item.getAttribute('data-shop');
      const model = document.body.dataset.model;

      if (action === 'service') {
        openContact(model
          ? 'Hola, quiero hablar con servicio al cliente sobre el ' + model + '.'
          : 'Hola, quiero hablar con servicio al cliente.');
        return;
      }

      if (!model) {
        openContact(action === 'rent'
          ? 'Me interesa rentar un robot para mi operación.'
          : 'Me interesa comprar un robot para mi operación.');
        return;
      }

      if (action === 'rent') {
        addQuote('rent', document.body.dataset.rentPrice || 'Renta mensual');
        return;
      }
      if (action === 'buy') {
        addQuote('buy', document.body.dataset.buyPrice || 'Precio de venta');
      }
    });
  });
})();
