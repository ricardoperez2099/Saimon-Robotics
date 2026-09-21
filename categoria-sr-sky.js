(function () {
  const IMG = 'robots/dron/';

  const heroImgs = {
    seguridad: IMG + 'srsky-navy-studio.png',
    inspeccion: IMG + 'srsky-navy-threequarter.png'
  };

  const models = [
    { name: 'SR-SKY Compact', tagline: 'Inspección ligera', tier: 'Entrada', img: IMG + 'srsky-model-compact.png' },
    { name: 'SR-SKY Pro', tagline: 'Seguridad y vigilancia', tier: 'Avanzado', img: IMG + 'srsky-model-pro.png' },
    { name: 'SR-SKY Max', tagline: 'Agrícola e industrial', tier: 'Insignia', img: IMG + 'srsky-model-max-tactical.png' }
  ];

  const specsByUseCase = {
    inspeccion: [
      { label: 'Autonomía', values: ['25 min', '40 min', '55 min'] },
      { label: 'Alcance', values: ['3 km', '7 km', '10 km'] },
      { label: 'Cámara/sensor', values: ['Gran angular', 'Gran angular + zoom', 'Gran angular + zoom + térmica'] },
      { label: 'Uso principal', values: ['Inspección ligera', 'Apoyo en inspección extendida', 'Inspección industrial de precisión'] }
    ],
    seguridad: [
      { label: 'Autonomía', values: ['25 min', '40 min', '55 min'] },
      { label: 'Alcance', values: ['3 km', '7 km', '10 km'] },
      { label: 'Cámara/sensor', values: ['Gran angular', 'Gran angular + zoom', 'Gran angular + zoom + térmica'] },
      { label: 'Uso principal', values: ['No recomendado', 'Seguridad y vigilancia', 'Vigilancia perimetral extendida'] }
    ],
    agricola: [
      { label: 'Autonomía', values: ['25 min', '40 min', '55 min'] },
      { label: 'Alcance', values: ['3 km', '7 km', '10 km'] },
      { label: 'Cámara/sensor', values: ['Gran angular', 'Gran angular + zoom', 'Gran angular + zoom + térmica'] },
      { label: 'Uso principal', values: ['Monitoreo básico de parcela', 'Monitoreo agrícola e industrial', 'Agrícola e industrial de gran escala'] }
    ]
  };

  const state = { heroLine: 'seguridad', useCase: 'inspeccion' };

  const heroImg = document.getElementById('catHeroImg');
  const heroTabs = document.getElementById('catHeroTabs');
  const useCaseTabs = document.getElementById('catUseCaseTabs');
  const compareBody = document.getElementById('catCompareBody');

  function renderHeroTabs() {
    if (!heroTabs) return;
    heroTabs.innerHTML = [
      { value: 'seguridad', label: 'Línea Seguridad' },
      { value: 'inspeccion', label: 'Línea Inspección' }
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
      { value: 'inspeccion', label: 'Inspección ligera' },
      { value: 'seguridad', label: 'Seguridad y vigilancia' },
      { value: 'agricola', label: 'Agrícola e industrial' }
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
        '<a href="ficha-sr-sky.html">Más información</a>' +
      '</div>';
    }).join('');
  }

  function renderCompare() {
    if (!compareBody) return;
    const rows = specsByUseCase[state.useCase] || specsByUseCase.inspeccion;
    compareBody.innerHTML = rows.map(function (row) {
      return '<div class="cat-compare-label">' + row.label + '</div>' +
        row.values.map(function (v) {
          return '<div class="cat-compare-value">' + v + '</div>';
        }).join('');
    }).join('');
  }

  if (heroImg) heroImg.src = encodeURI(heroImgs.seguridad);
  renderHeroTabs();
  renderUseCaseTabs();
  renderCompareHead();
  renderCompare();
})();
