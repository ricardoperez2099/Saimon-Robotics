(function () {
  const IMG = 'robots/Medico/';

  const heroImgs = {
    clinico: IMG + 'srcare-navy-hero.png',
    laboratorio: IMG + 'srcare-navy-joint-detail.png'
  };

  const models = [
    { name: 'SR-Care Compact', tagline: 'Consultorio y clínica', tier: 'Entrada', img: IMG + 'srcare-white-studio.png' },
    { name: 'SR-Care Pro', tagline: 'Laboratorio clínico', tier: 'Avanzado', img: IMG + 'srcare-navy-threequarter.png' },
    { name: 'SR-Care Lab', tagline: 'Investigación y quirúrgico', tier: 'Insignia', img: IMG + 'srcare-lab-vial.png' }
  ];

  const specsByUseCase = {
    clinico: [
      { label: 'Alcance', values: ['620 mm', '850 mm', '850 mm'] },
      { label: 'Precisión', values: ['±0.3 mm', '±0.1 mm', '±0.05 mm'] },
      { label: 'Carga útil', values: ['1.5 kg', '3 kg', '3 kg'] },
      { label: 'Uso principal', values: ['Consultorio y clínica', 'Asistencia en procedimiento', 'Investigación y quirúrgico'] }
    ],
    laboratorio: [
      { label: 'Alcance', values: ['620 mm', '850 mm', '850 mm'] },
      { label: 'Precisión', values: ['±0.3 mm', '±0.1 mm', '±0.05 mm'] },
      { label: 'Carga útil', values: ['1.5 kg', '3 kg', '4 kg'] },
      { label: 'Uso principal', values: ['Manejo ligero de muestras', 'Manejo de instrumental y muestras', 'Manipulación de precisión en laboratorio'] }
    ],
    investigacion: [
      { label: 'Alcance', values: ['620 mm', '850 mm', '900 mm'] },
      { label: 'Precisión', values: ['±0.3 mm', '±0.1 mm', '±0.05 mm'] },
      { label: 'Carga útil', values: ['1.5 kg', '3 kg', '4 kg'] },
      { label: 'Uso principal', values: ['No recomendado', 'Apoyo en procedimiento', 'Investigación y quirúrgico'] }
    ]
  };

  const state = { heroLine: 'clinico', useCase: 'clinico' };

  const heroImg = document.getElementById('catHeroImg');
  const heroTabs = document.getElementById('catHeroTabs');
  const useCaseTabs = document.getElementById('catUseCaseTabs');
  const compareBody = document.getElementById('catCompareBody');

  function renderHeroTabs() {
    if (!heroTabs) return;
    heroTabs.innerHTML = [
      { value: 'clinico', label: 'Línea Clínica' },
      { value: 'laboratorio', label: 'Línea Laboratorio' }
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
      { value: 'clinico', label: 'Consultorio y clínica' },
      { value: 'laboratorio', label: 'Laboratorio clínico' },
      { value: 'investigacion', label: 'Investigación y quirúrgico' }
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
        '<a href="ficha-sr-care.html">Más información</a>' +
      '</div>';
    }).join('');
  }

  function renderCompare() {
    if (!compareBody) return;
    const rows = specsByUseCase[state.useCase] || specsByUseCase.clinico;
    compareBody.innerHTML = rows.map(function (row) {
      return '<div class="cat-compare-label">' + row.label + '</div>' +
        row.values.map(function (v) {
          return '<div class="cat-compare-value">' + v + '</div>';
        }).join('');
    }).join('');
  }

  if (heroImg) heroImg.src = encodeURI(heroImgs.clinico);
  renderHeroTabs();
  renderUseCaseTabs();
  renderCompareHead();
  renderCompare();
})();
