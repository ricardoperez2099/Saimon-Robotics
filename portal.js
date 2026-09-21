(function () {
  const SESSION_KEY = 'saimon-portal-session';

  const quotes = [
    { date: '12 Sep 2026', models: 'SR-SKY Pro, SR-K9', type: 'Renta', status: 'Propuesta recibida', pdf: true },
    { date: '03 Sep 2026', models: 'SR-GO Cargo Max', type: 'Compra', status: 'En revisión', pdf: false },
    { date: '18 Ago 2026', models: 'DBS02-X', type: 'Renta', status: 'Enviada', pdf: false },
    { date: '02 Ago 2026', models: 'SR-HOST Pro', type: 'Compra', status: 'Cerrada', pdf: true }
  ];

  const orders = [
    { models: 'SR-SKY Pro × 2', type: 'Renta', start: '01 Sep 2026', term: '12 meses', deploy: 'Instalación programada' },
    { models: 'SR-K9 Max', type: 'Compra', start: '20 Ago 2026', term: '—', deploy: 'En tránsito — SaimonDeploy' },
    { models: 'SR-GO Pro × 3', type: 'Renta', start: '10 Jul 2026', term: '24 meses', deploy: 'Operando' }
  ];

  const invoices = [
    { id: 'A-2026-0142', date: '05 Sep 2026', amount: '$48,500.00 USD', status: 'Pagada' },
    { id: 'A-2026-0118', date: '22 Ago 2026', amount: '$12,800.00 USD', status: 'Pendiente' },
    { id: 'A-2026-0091', date: '30 Jul 2026', amount: '$9,450.00 USD', status: 'Pagada' }
  ];

  function getSession() {
    try {
      const data = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      return data && data.loggedIn ? data : null;
    } catch (err) {
      return null;
    }
  }

  function statusClass(status) {
    const map = {
      'Enviada': 'is-sent',
      'En revisión': 'is-review',
      'Propuesta recibida': 'is-proposal',
      'Cerrada': 'is-closed',
      'Pagada': 'is-paid',
      'Pendiente': 'is-pending',
      'Renta': 'is-rent',
      'Compra': 'is-buy'
    };
    return map[status] || 'is-sent';
  }

  function initials(name) {
    return String(name || 'SR')
      .split(/\s+/)
      .slice(0, 2)
      .map(function (p) { return p.charAt(0).toUpperCase(); })
      .join('') || 'SR';
  }

  function showSection(id) {
    document.querySelectorAll('[data-portal-section]').forEach(function (sec) {
      const on = sec.getAttribute('data-portal-section') === id;
      sec.classList.toggle('is-on', on);
      if (on) sec.removeAttribute('hidden');
      else sec.setAttribute('hidden', '');
    });
    document.querySelectorAll('[data-portal-nav]').forEach(function (btn) {
      btn.classList.toggle('is-on', btn.getAttribute('data-portal-nav') === id);
    });
  }

  function renderQuotes() {
    const body = document.getElementById('portalQuotesBody');
    if (!body) return;
    body.innerHTML = quotes.map(function (q) {
      return '<tr>' +
        '<td>' + q.date + '</td>' +
        '<td>' + q.models + '</td>' +
        '<td><span class="portal-badge ' + statusClass(q.type) + '">' + q.type + '</span></td>' +
        '<td><span class="portal-badge ' + statusClass(q.status) + '">' + q.status + '</span></td>' +
        '<td>' + (q.pdf
          ? '<button type="button" class="portal-btn-ghost" data-demo-pdf>Descargar PDF</button>'
          : '<span class="portal-muted">Sin propuesta</span>') +
        '</td>' +
      '</tr>';
    }).join('');
  }

  function renderOrders() {
    const body = document.getElementById('portalOrdersBody');
    if (!body) return;
    body.innerHTML = orders.map(function (o) {
      return '<tr>' +
        '<td>' + o.models + '</td>' +
        '<td><span class="portal-badge ' + statusClass(o.type) + '">' + o.type + '</span></td>' +
        '<td>' + o.start + '</td>' +
        '<td>' + o.term + '</td>' +
        '<td>' + o.deploy + '</td>' +
      '</tr>';
    }).join('');
  }

  function renderInvoices() {
    const body = document.getElementById('portalInvoicesBody');
    if (!body) return;
    body.innerHTML = invoices.map(function (inv) {
      return '<tr>' +
        '<td>' + inv.id + '</td>' +
        '<td>' + inv.date + '</td>' +
        '<td><strong>' + inv.amount + '</strong></td>' +
        '<td><span class="portal-badge ' + statusClass(inv.status) + '">' + inv.status + '</span></td>' +
        '<td><button type="button" class="portal-btn-ghost" data-demo-pdf>CFDI / PDF</button></td>' +
      '</tr>';
    }).join('');
  }

  function fillProfile(session) {
    const set = function (id, val) {
      const el = document.getElementById(id);
      if (el) el.value = val || '';
    };
    set('pfRazon', session.company || 'Industrias Demo SA de CV');
    set('pfRfc', session.rfc || 'IDE860101XXX');
    set('pfBill', session.billing || 'Av. Reforma 222, CDMX');
    set('pfShip', session.shipping || 'Parque Industrial Norte, Bodega 4');
    set('pfEmail', session.email || '');
    set('pfPhone', session.phone || '+52 55 0000 0000');
  }

  function hydrate(session) {
    const name = session.name || 'Usuario';
    const company = session.company || 'Tu empresa';
    const nameEl = document.getElementById('portalUserName');
    const companyEl = document.getElementById('portalUserCompany');
    const hello = document.getElementById('portalHelloName');
    const avatar = document.querySelector('.portal-user-avatar');
    if (nameEl) nameEl.textContent = name;
    if (companyEl) companyEl.textContent = company;
    if (hello) hello.textContent = name.split(' ')[0];
    if (avatar) avatar.textContent = initials(name);
    document.getElementById('kpiQuotes') && (document.getElementById('kpiQuotes').textContent = String(quotes.filter(function (q) { return q.status !== 'Cerrada'; }).length));
    document.getElementById('kpiOrders') && (document.getElementById('kpiOrders').textContent = String(orders.length));
    fillProfile(session);
  }

  function bind() {
    document.querySelectorAll('[data-portal-nav]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showSection(btn.getAttribute('data-portal-nav'));
      });
    });

    document.getElementById('portalLogout')?.addEventListener('click', function () {
      if (typeof window.clearSaimonSession === 'function') window.clearSaimonSession();
      else localStorage.removeItem(SESSION_KEY);
      window.location.href = 'index.html';
    });

    document.getElementById('portalProfileForm')?.addEventListener('submit', function (e) {
      e.preventDefault();
      const session = getSession() || { loggedIn: true };
      session.name = session.name || document.getElementById('pfRazon')?.value;
      session.company = document.getElementById('pfRazon')?.value;
      session.rfc = document.getElementById('pfRfc')?.value;
      session.billing = document.getElementById('pfBill')?.value;
      session.shipping = document.getElementById('pfShip')?.value;
      session.email = document.getElementById('pfEmail')?.value;
      session.phone = document.getElementById('pfPhone')?.value;
      session.loggedIn = true;
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      hydrate(session);
      const note = document.getElementById('portalProfileNote');
      if (note) {
        note.hidden = false;
        window.setTimeout(function () { note.hidden = true; }, 2200);
      }
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('[data-demo-pdf]')) return;
      e.preventDefault();
      alert('Descarga demo: el PDF/CFDI se conectará al backend en una siguiente etapa.');
    });
  }

  // Only gate/run portal UI on portal page
  if (!document.body.classList.contains('portal-page')) return;

  const session = getSession();
  if (!session) {
    window.location.replace('index.html?auth=1');
    return;
  }

  hydrate(session);
  renderQuotes();
  renderOrders();
  renderInvoices();
  bind();
  showSection('resumen');
})();
