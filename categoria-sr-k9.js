(function () {
  const IMG = 'imagenes/categoria-sr-k9/';
  const MODEL_IMG = 'robots/perro robot/';

  const heroImgs = {
    patrullaje: IMG + 'hero-patrullaje.jpg',
    industrial: IMG + 'hero-industrial.jpg'
  };

  const models = [
    { name: 'SR-K9 Pro', tagline: 'Patrullaje ágil', tier: 'Avanzado', img: MODEL_IMG + 'sr-k9-pro.png' },
    { name: 'SR-K9 Compact', tagline: 'Uso en interiores', tier: 'Entrada', img: MODEL_IMG + 'sr-k9-compact.png' },
    { name: 'SR-K9 Max', tagline: 'Inspección industrial', tier: 'Avanzado', img: MODEL_IMG + 'sr-k9-max.png' },
    { name: 'SR-K9 Industrial', tagline: 'Campo extremo', tier: 'Insignia', img: MODEL_IMG + 'sr-k9-industrial.png' }
  ];

  const specsByUseCase = {
    patrullaje: [
      { label: 'Peso', values: ['38 kg', '24 kg', '44 kg', '52 kg'] },
      { label: 'Autonomía', values: ['2 h', '1.2 h', '2.5 h', '3 h'] },
      { label: 'Velocidad máx.', values: ['3.5 m/s', '2.2 m/s', '3.2 m/s', '3 m/s'] },
      { label: 'Carga útil', values: ['8 kg', '3 kg', '10 kg', '14 kg'] },
      { label: 'Terreno / pendiente máx.', values: ['40°', '20°', '35°', '45°'] },
      { label: 'Alcance detección LiDAR', values: ['120 m', '60 m', '100 m', '150 m'] },
      { label: 'Conectividad', values: ['4G · WiFi 6', 'WiFi 6', '4G · WiFi 6', '4G · WiFi 6 · Radio'] }
    ],
    inspeccion: [
      { label: 'Peso', values: ['38 kg', '24 kg', '44 kg', '52 kg'] },
      { label: 'Autonomía', values: ['1.8 h', '1 h', '2.8 h', '3.2 h'] },
      { label: 'Velocidad máx.', values: ['2.8 m/s', '1.8 m/s', '3 m/s', '2.6 m/s'] },
      { label: 'Carga útil', values: ['8 kg', '3 kg', '12 kg', '16 kg'] },
      { label: 'Terreno / pendiente máx.', values: ['35°', '18°', '38°', '45°'] },
      { label: 'Alcance detección LiDAR', values: ['110 m', '50 m', '130 m', '160 m'] },
      { label: 'Conectividad', values: ['4G · WiFi 6', 'WiFi 6', '4G · WiFi 6', '4G · WiFi 6 · Radio'] }
    ],
    interior: [
      { label: 'Peso', values: ['38 kg', '24 kg', '44 kg', '52 kg'] },
      { label: 'Autonomía', values: ['2.2 h', '1.5 h', '2.4 h', '2.8 h'] },
      { label: 'Velocidad máx.', values: ['3 m/s', '2.4 m/s', '2.8 m/s', '2.4 m/s'] },
      { label: 'Carga útil', values: ['6 kg', '3 kg', '9 kg', '12 kg'] },
      { label: 'Terreno / pendiente máx.', values: ['25°', '15°', '28°', '30°'] },
      { label: 'Alcance detección LiDAR', values: ['90 m', '45 m', '95 m', '100 m'] },
      { label: 'Conectividad', values: ['WiFi 6', 'WiFi 6', 'WiFi 6', '4G · WiFi 6'] }
    ]
  };

  const state = { heroLine: 'patrullaje', useCase: 'patrullaje' };

  const heroImg = document.getElementById('catHeroImg');
  const heroTabs = document.getElementById('catHeroTabs');
  const useCaseTabs = document.getElementById('catUseCaseTabs');
  const compareBody = document.getElementById('catCompareBody');

  function renderHeroTabs() {
    if (!heroTabs) return;
    heroTabs.innerHTML = [
      { value: 'patrullaje', label: 'Línea Patrullaje' },
      { value: 'industrial', label: 'Línea Industrial' }
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
      { value: 'patrullaje', label: 'Patrullaje' },
      { value: 'inspeccion', label: 'Inspección industrial' },
      { value: 'interior', label: 'Uso ligero/interior' }
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
        '<a href="ficha-sr-k9.html">Más información</a>' +
      '</div>';
    }).join('');
  }

  function renderCompare() {
    if (!compareBody) return;
    const rows = specsByUseCase[state.useCase] || specsByUseCase.patrullaje;
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
