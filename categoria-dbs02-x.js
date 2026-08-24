(function () {
  const IMG = 'robots/humanoide/';

  const heroImgs = {
    asistencia: IMG + 'bg-hero-category-humanoide.png',
    industrial: IMG + 'bg-hero-category-humanoide.png'
  };

  const models = [
    { name: 'DBS02-X Compact', tagline: 'Atención y asistencia', tier: 'Entrada', img: IMG + 'compact.png' },
    { name: 'DBS02-X Pro', tagline: 'Logística ágil', tier: 'Avanzado', img: IMG + 'pro.png' },
    { name: 'DBS02-X Max', tagline: 'Educación e investigación', tier: 'Avanzado', img: IMG + 'max.png' },
    { name: 'DBS02-X Industrial', tagline: 'Operación de alta demanda', tier: 'Insignia', img: IMG + 'industrial.png' }
  ];

  const specsByUseCase = {
    logistica: [
      { label: 'Altura / peso', values: ['1.65 m · 52 kg', '1.5 m · 42 kg', '1.72 m · 58 kg', '1.75 m · 64 kg'] },
      { label: 'Autonomía', values: ['2 h', '1.5 h', '2.8 h', '3.2 h'] },
      { label: 'Velocidad máx.', values: ['1.6 m/s', '1.2 m/s', '1.8 m/s', '1.5 m/s'] },
      { label: 'Carga en brazos', values: ['8 kg', '4 kg', '12 kg', '18 kg'] },
      { label: 'Grados de libertad', values: ['32', '24', '38', '42'] },
      { label: 'Uso principal', values: ['Preparación de pedidos', 'Recepción y guía', 'Manejo de materiales', 'Carga pesada continua'] }
    ],
    asistencia: [
      { label: 'Altura / peso', values: ['1.65 m · 52 kg', '1.5 m · 42 kg', '1.72 m · 58 kg', '1.75 m · 64 kg'] },
      { label: 'Autonomía', values: ['2.4 h', '1.8 h', '2.6 h', '2.8 h'] },
      { label: 'Velocidad máx.', values: ['1.2 m/s', '1 m/s', '1.4 m/s', '1.1 m/s'] },
      { label: 'Carga en brazos', values: ['5 kg', '3 kg', '8 kg', '10 kg'] },
      { label: 'Grados de libertad', values: ['32', '24', '38', '42'] },
      { label: 'Uso principal', values: ['Recepción a clientes', 'Interacción en interiores', 'Guía y acompañamiento', 'Soporte en piso de planta'] }
    ],
    educacion: [
      { label: 'Altura / peso', values: ['1.65 m · 52 kg', '1.5 m · 42 kg', '1.72 m · 58 kg', '1.75 m · 64 kg'] },
      { label: 'Autonomía', values: ['2.2 h', '1.6 h', '3 h', '3 h'] },
      { label: 'Velocidad máx.', values: ['1.4 m/s', '1 m/s', '1.6 m/s', '1.3 m/s'] },
      { label: 'Carga en brazos', values: ['6 kg', '3 kg', '10 kg', '14 kg'] },
      { label: 'Grados de libertad', values: ['32', '24', '40', '42'] },
      { label: 'Uso principal', values: ['Investigación en laboratorio', 'Prácticas educativas', 'Manipulación experimental', 'Pruebas de carga y control'] }
    ]
  };

  const state = { heroLine: 'asistencia', useCase: 'logistica' };

  const heroImg = document.getElementById('catHeroImg');
  const heroTabs = document.getElementById('catHeroTabs');
  const useCaseTabs = document.getElementById('catUseCaseTabs');
  const compareBody = document.getElementById('catCompareBody');

  function renderHeroTabs() {
    if (!heroTabs) return;
    heroTabs.innerHTML = [
      { value: 'asistencia', label: 'Línea Asistencia' },
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
      { value: 'logistica', label: 'Logística' },
      { value: 'asistencia', label: 'Atención/asistencia' },
      { value: 'educacion', label: 'Educación e investigación' }
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
        '<a href="ficha-dbs02-x.html">Más información</a>' +
      '</div>';
    }).join('');
  }

  function renderCompare() {
    if (!compareBody) return;
    const rows = specsByUseCase[state.useCase] || specsByUseCase.logistica;
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
