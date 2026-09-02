(function () {
  const STORAGE_KEY = 'saimon-quote';
  const THUMBS = {
    'SR-K9': 'robots/perro robot/tres-cuartos-frontal.png',
    'DBS02-X': 'robots/humanoide/dbs02x-navy-front-full.jpg',
    'SR-GO': 'robots/entrega 2/srgo-navy-studio.png',
    'SR-HOST': 'robots/hosteleria/srhost-corridor-hotel-01.png',
    'SR-ARM': 'robots/alta carga/srarm-navy-hero.png',
    'SR-LIFT': 'robots/alta carga/srarm-navy-hero.png',
    'SR-MED': 'robots/Medico/hf_20260812_225840_5d03719b-bfd8-471c-83bd-145b258dfe6d.png'
  };

  function loadCart() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function itemKey(item) {
    return item.model + '::' + item.type;
  }

  function normalize(nameOrItem, price) {
    if (nameOrItem && typeof nameOrItem === 'object') {
      const model = String(nameOrItem.model || '').trim();
      return {
        model,
        type: nameOrItem.type === 'rent' ? 'rent' : 'buy',
        price: nameOrItem.price || '',
        image: nameOrItem.image || THUMBS[model] || '',
        qty: 1
      };
    }

    const raw = String(nameOrItem || '');
    const isRent = /\(\s*Renta\s*\)/i.test(raw);
    const model = raw.replace(/\s*\((Renta|Compra)\)\s*/gi, '').trim();
    return {
      model,
      type: isRent ? 'rent' : 'buy',
      price: price || '',
      image: THUMBS[model] || '',
      qty: 1
    };
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function parsePrice(value) {
    const match = String(value || '').replace(/,/g, '').match(/(\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : 0;
  }

  function formatUSD(amount) {
    return '$' + Math.round(amount).toLocaleString('en-US') + ' USD';
  }

  function cartTotals(cart) {
    return cart.reduce((acc, item) => {
      const line = parsePrice(item.price) * (item.qty || 0);
      if (item.type === 'rent') acc.rent += line;
      else acc.buy += line;
      return acc;
    }, { buy: 0, rent: 0 });
  }

  function render() {
    const cart = loadCart();
    const badge = document.getElementById('cartBadge');
    const empty = document.getElementById('cartEmpty');
    const items = document.getElementById('cartItems');
    const footer = document.getElementById('cartFooter');
    const note = document.getElementById('cartCountNote');
    const totalsEl = document.getElementById('cartTotals');
    const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

    if (badge) {
      badge.textContent = String(totalQty);
      badge.classList.toggle('has-items', totalQty > 0);
    }
    if (!items || !empty || !footer) return;

    if (!cart.length) {
      empty.style.display = 'block';
      footer.classList.remove('is-on');
      items.innerHTML = '';
      return;
    }

    empty.style.display = 'none';
    footer.classList.add('is-on');
    if (note) {
      note.textContent = cart.length === 1
        ? '1 modelo en tu cotización'
        : cart.length + ' modelos en tu cotización';
    }
    if (totalsEl) {
      const totals = cartTotals(cart);
      const rows = [];
      if (totals.buy > 0 && totals.rent > 0) {
        rows.push('<div class="cart-totals-row"><span>Total compra</span><strong>' + formatUSD(totals.buy) + '</strong></div>');
        rows.push('<div class="cart-totals-row"><span>Total renta</span><strong>' + formatUSD(totals.rent) + '/mes</strong></div>');
      } else if (totals.rent > 0) {
        rows.push('<div class="cart-totals-row"><span>Total</span><strong>' + formatUSD(totals.rent) + '/mes</strong></div>');
      } else {
        rows.push('<div class="cart-totals-row"><span>Total</span><strong>' + formatUSD(totals.buy) + '</strong></div>');
      }
      totalsEl.innerHTML = rows.join('');
    }

    items.innerHTML = cart.map((item) => {
      const typeClass = item.type === 'rent' ? 'is-rent' : 'is-buy';
      const typeLabel = item.type === 'rent' ? 'Renta' : 'Compra';
      const img = item.image || THUMBS[item.model] || '';
      return (
        '<article class="cart-item" data-model="' + escapeHtml(item.model) + '" data-type="' + escapeHtml(item.type) + '">' +
          (img ? '<img class="cart-item-thumb" src="' + escapeHtml(img) + '" alt="' + escapeHtml(item.model) + '">' : '<div class="cart-item-thumb"></div>') +
          '<div class="cart-item-info">' +
            '<div class="cart-item-top">' +
              '<span class="cart-item-name">' + escapeHtml(item.model) + '</span>' +
              '<span class="cart-type ' + typeClass + '">' + typeLabel + '</span>' +
            '</div>' +
            '<div class="cart-qty">' +
              '<button type="button" data-cart-qty="-1" aria-label="Quitar uno">−</button>' +
              '<span>' + item.qty + '</span>' +
              '<button type="button" data-cart-qty="1" aria-label="Agregar uno">+</button>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="cart-item-remove" data-cart-remove>Quitar</button>' +
        '</article>'
      );
    }).join('');
  }

  function openCart() {
    document.getElementById('cartOverlay')?.classList.add('open');
    document.getElementById('cartSidebar')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    document.getElementById('cartOverlay')?.classList.remove('open');
    document.getElementById('cartSidebar')?.classList.remove('open');
    if (!document.querySelector('.modal-overlay.open, .contact-modal.open')) {
      document.body.style.overflow = '';
    }
  }

  window.addToCart = function (nameOrItem, price) {
    const next = normalize(nameOrItem, price);
    if (!next.model) return;
    const cart = loadCart();
    const existing = cart.find((item) => itemKey(item) === itemKey(next));
    if (existing) existing.qty += 1;
    else cart.push(next);
    saveCart(cart);
    render();
    openCart();
  };

  window.removeFromCart = function (model, type) {
    saveCart(loadCart().filter((item) => !(item.model === model && item.type === type)));
    render();
  };

  window.changeCartQty = function (model, type, delta) {
    const cart = loadCart();
    const item = cart.find((row) => row.model === model && row.type === type);
    if (!item) return;
    item.qty = Math.max(1, (item.qty || 1) + delta);
    saveCart(cart);
    render();
  };

  window.openCart = openCart;
  window.closeCart = closeCart;

  window.openCheckout = function () {
    closeCart();
    const modal = document.getElementById('checkoutModal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      return;
    }
    const cart = loadCart();
    const summary = cart.map((item) => {
      const kind = item.type === 'rent' ? 'renta' : 'compra';
      return item.model + ' (' + kind + ') × ' + item.qty;
    }).join(', ');
    const ta = document.querySelector('#contactForm textarea, .contact-form textarea');
    if (ta) ta.value = 'Quiero solicitar una cotización formal: ' + summary + '.';
    if (typeof window.openContactModal === 'function') window.openContactModal();
  };

  window.closeCheckoutModal = function () {
    document.getElementById('checkoutModal')?.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.submitCheckout = function (e) {
    e.preventDefault();
    window.closeCheckoutModal();
    saveCart([]);
    render();
    alert('¡Solicitud enviada! Nuestro equipo te contactará en menos de 24 horas.');
  };

  document.getElementById('cartOpenBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  });
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('checkoutModal')?.addEventListener('click', function (e) {
    if (e.target === this) window.closeCheckoutModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (document.getElementById('cartSidebar')?.classList.contains('open')) closeCart();
  });

  document.getElementById('cartItems')?.addEventListener('click', (e) => {
    const row = e.target.closest('.cart-item');
    if (!row) return;
    const model = row.dataset.model;
    const type = row.dataset.type;
    if (e.target.closest('[data-cart-remove]')) {
      window.removeFromCart(model, type);
      return;
    }
    const qtyBtn = e.target.closest('[data-cart-qty]');
    if (qtyBtn) window.changeCartQty(model, type, Number(qtyBtn.dataset.cartQty));
  });

  document.querySelectorAll('[data-quote]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.quote;
      const model = document.body.dataset.model;
      if (!model || (type !== 'rent' && type !== 'buy')) return;
      window.addToCart({
        model,
        type,
        price: type === 'rent' ? document.body.dataset.rentPrice : document.body.dataset.buyPrice,
        image: document.body.dataset.modelImage
      });
    });
  });

  render();
})();
