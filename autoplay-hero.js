(function () {
  var SELECTOR = 'video.hero-video, video.ficha-hero-media, video.cat-support-bg';

  function play(video) {
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    var p = video.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  function playAll() {
    document.querySelectorAll(SELECTOR).forEach(play);
  }

  function bind(video) {
    ['loadeddata', 'canplay', 'canplaythrough'].forEach(function (ev) {
      video.addEventListener(ev, function () { play(video); });
    });
    play(video);
  }

  function init() {
    document.querySelectorAll(SELECTOR).forEach(bind);
    playAll();
  }

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) playAll();
  });
  window.addEventListener('pageshow', playAll);
  window.addEventListener('saimon:intro-done', playAll);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
