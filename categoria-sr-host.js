(function () {
  const IMG = 'robots/hosteleria/';

  const heroImgs = {
    hoteles: IMG + 'srhost-corridor-hotel-01.png',
    aeropuertos: IMG + 'srhost-airport-wide.png'
  };

  const models = [
    { name: 'SR-HOST Compact', tagline: 'Hoteles boutique', tier: 'Entrada', img: IMG + 'srhost-compact-studio.png' },
    { name: 'SR-HOST Pro', tagline: 'Entrega y atención al huésped', tier: 'Avanzado', img: IMG + 'srhost-pro-studio.png' },
    { name: 'SR-HOST Industrial', tagline: 'Convenciones y catering', tier: 'Insignia', img: IMG + 'srhost-industrial-studio.png' }
  ];

  const specsByUseCase = {
    boutique: [
      { label: 'Altura', values: ['1.15 m', '1.35 m', '1.55 m'] },
      { label: 'Compartimentos', values: ['1', '2', '4'] },
      { label: 'Autonomía', values: ['6 h', '8 h', '10 h'] },
      { label: 'Uso principal', values: ['Amenidades y mensajería', 'Room service y equipaje ligero', 'Carga de banquetes'] }
    ],
    resorts: [
      { label: 'Altura', values: ['1.15 m', '1.35 m', '1.55 m'] },
      { label: 'Compartimentos', values: ['1', '2', '4'] },
      { label: 'Autonomía', values: ['5.5 h', '8 h', '9.5 h'] },
      { label: 'Uso principal', values: ['Entregas a habitación', 'Atención en lobby y alberca', 'Traslado de suministros'] }
    ],
    convenciones: [
      { label: 'Altura', values: ['1.15 m', '1.35 m', '1.55 m'] },
      { label: 'Compartimentos', values: ['1', '2', '4'] },
      { label: 'Autonomía', values: ['5 h', '7.5 h', '10 h'] },
      { label: 'Uso principal', values: ['Guía de asistentes', 'Entrega de documentación', 'Catering y montaje de salones'] }
    ]
  };

  const state = { heroLine: 'hoteles', useCase: 'boutique' };

  const heroImg = document.getElementById('catHeroImg');
  const heroTabs = document.getElementById('catHeroTabs');
  const useCaseTabs = document.getElementById('catUseCaseTabs');
  const compareBody = document.getElementById('catCompareBody');

  function renderHeroTabs() {
    if (!heroTabs) return;
    heroTabs.innerHTML = [
      { value: 'hoteles', label: 'Línea Hoteles' },
      { value: 'aeropuertos', label: 'Línea Aeropuertos' }
    ].map(function (t) {
      return '<button type="button" class="cat-pill' + (state.heroLine === t.value ? ' is-on' : '') + '" data-hero-line="' + t.value + '">' + t.label + '</button>';
    }).join('');
    heroTabs.querySelectorAll('[data-hero-line]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.heroLine = btn.dataset.heroLine;
        if (heroImg) heroImg.src = heroImgs[state.heroLine];
        renderHeroTabs();
      });
    });
  }

  function renderUseCaseTabs() {
    if (!useCaseTabs) return;
    useCaseTabs.innerHTML = [
      { value: 'boutique', label: 'Hoteles boutique' },
      { value: 'resorts', label: 'Hoteles y resorts' },
      { value: 'convenciones', label: 'Convenciones y catering' }
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
        '<img src="' + m.img + '" alt="' + m.name + '" loading="lazy">' +
        '<strong>' + m.name + '</strong>' +
        '<a href="ficha-sr-host.html">Más información</a>' +
      '</div>';
    }).join('');
  }

  function renderCompare() {
    if (!compareBody) return;
    const rows = specsByUseCase[state.useCase] || specsByUseCase.boutique;
    compareBody.innerHTML = rows.map(function (row) {
      return '<div class="cat-compare-label">' + row.label + '</div>' +
        row.values.map(function (v) {
          return '<div class="cat-compare-value">' + v + '</div>';
        }).join('');
    }).join('');
  }

  renderHeroTabs();
  renderUseCaseTabs();
  renderCompareHead();
  renderCompare();
})();
