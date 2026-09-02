(function () {
  const IMG = 'robots/entrega 2/';

  const heroImgs = {
    campus: IMG + 'srgo-dusk-street.png',
    corporativo: IMG + 'srgo-navy-studio.png'
  };

  const models = [
    { name: 'SR-GO Compact', tagline: 'Campus y residenciales', tier: 'Entrada', img: IMG + 'srgo-compact-studio.png' },
    { name: 'SR-GO Pro', tagline: 'Entrega de última milla', tier: 'Avanzado', img: IMG + 'srgo-pro-studio.png' },
    { name: 'SR-GO Cargo Max', tagline: 'Alto volumen', tier: 'Insignia', img: IMG + 'srgo-cargo-max-studio.png' }
  ];

  const specsByUseCase = {
    campus: [
      { label: 'Capacidad de carga', values: ['8 kg', '20 kg', '45 kg'] },
      { label: 'Autonomía', values: ['6 h', '8 h', '10 h'] },
      { label: 'Velocidad', values: ['6 km/h', '10 km/h', '12 km/h'] },
      { label: 'Uso principal', values: ['Paquetería ligera en residenciales', 'Entrega de última milla en campus', 'Reparto de múltiples paquetes'] }
    ],
    corporativo: [
      { label: 'Capacidad de carga', values: ['8 kg', '20 kg', '45 kg'] },
      { label: 'Autonomía', values: ['5.5 h', '8 h', '9.5 h'] },
      { label: 'Velocidad', values: ['6 km/h', '10 km/h', '12 km/h'] },
      { label: 'Uso principal', values: ['Mensajería interna', 'Traslado entre edificios corporativos', 'Distribución de suministros de oficina'] }
    ],
    volumen: [
      { label: 'Capacidad de carga', values: ['8 kg', '20 kg', '45 kg'] },
      { label: 'Autonomía', values: ['5 h', '7.5 h', '10 h'] },
      { label: 'Velocidad', values: ['6 km/h', '10 km/h', '12 km/h'] },
      { label: 'Uso principal', values: ['Rutas cortas de bajo volumen', 'Rutas mixtas de reparto', 'Centros de distribución de alto volumen'] }
    ]
  };

  const state = { heroLine: 'campus', useCase: 'campus' };

  const heroImg = document.getElementById('catHeroImg');
  const heroTabs = document.getElementById('catHeroTabs');
  const useCaseTabs = document.getElementById('catUseCaseTabs');
  const compareBody = document.getElementById('catCompareBody');

  function renderHeroTabs() {
    if (!heroTabs) return;
    heroTabs.innerHTML = [
      { value: 'campus', label: 'Línea Campus' },
      { value: 'corporativo', label: 'Línea Corporativo' }
    ].map(function (t) {
      return '<button type="button" class="cat-pill' + (state.heroLine === t.value ? ' is-on' : '') + '" data-hero-line="' + t.value + '">' + t.label + '</button>';
    }).join('');
    heroTabs.querySelectorAll('[data-hero-line]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.heroLine = btn.dataset.heroLine;
        if (heroImg) heroImg.src = encodeURI(heroImgs[state.heroLine]);
        renderHeroTabs();
      });
    });
  }

  function renderUseCaseTabs() {
    if (!useCaseTabs) return;
    useCaseTabs.innerHTML = [
      { value: 'campus', label: 'Campus y residenciales' },
      { value: 'corporativo', label: 'Corporativo' },
      { value: 'volumen', label: 'Alto volumen' }
    ].map(function (t) {
      return '<button type="button" class="cat-pill' + (state.useCase === t.value ? ' is-on' : '') + '" data-use-case="' + t.value + '">' + t.label + '</button>';
    }).join('');
    useCaseTabs.querySelectorAll('[data-use-case]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.useCase = btn.dataset.useCase;
        renderUseCaseTabs();
        renderCompare();
      });
    });
  }

  function renderCompareHead() {
    const head = document.getElementById('catCompareHead');
    if (!head) return;
    head.innerHTML = models.map(function (m) {
      return '<div class="cat-compare-col-head">' +
        '<span class="cat-compare-tier">' + m.tier + '</span>' +
        '<img src="' + encodeURI(m.img) + '" alt="' + m.name + '" loading="lazy">' +
        '<strong>' + m.name + '</strong>' +
        '<a href="ficha-sr-go.html">Más información</a>' +
      '</div>';
    }).join('');
  }

  function renderCompare() {
    if (!compareBody) return;
    const rows = specsByUseCase[state.useCase] || specsByUseCase.campus;
    compareBody.innerHTML = rows.map(function (row) {
      return '<div class="cat-compare-label">' + row.label + '</div>' +
        row.values.map(function (v) {
          return '<div class="cat-compare-value">' + v + '</div>';
        }).join('');
    }).join('');
  }

  if (heroImg) heroImg.src = encodeURI(heroImgs.campus);
  renderHeroTabs();
  renderUseCaseTabs();
  renderCompareHead();
  renderCompare();
})();
