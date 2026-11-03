// NextCart: mobile menu + home page category slideshow
(function () {
  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('site-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });
  }

  // Slideshow
  var root = document.querySelector('[data-carousel]');
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.hero-tab'));
  var pauseBtn = root.querySelector('[data-pause]');
  if (slides.length < 2) return;

  var INTERVAL = 6500;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = 0;
  var timer = null;
  var userPaused = reduceMotion; // no autoplay when the visitor prefers less motion
  var hoverPaused = false;

  root.style.setProperty('--interval', INTERVAL + 'ms');

  function show(index, moveFocus) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      var on = i === current;
      s.classList.toggle('is-active', on);
      if (on) { s.removeAttribute('aria-hidden'); s.inert = false; }
      else { s.setAttribute('aria-hidden', 'true'); s.inert = true; }
    });
    tabs.forEach(function (t, i) {
      var on = i === current;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      // restart the progress bar animation
      t.classList.remove('is-running');
      if (on && isPlaying()) { void t.offsetWidth; t.classList.add('is-running'); }
    });
    if (moveFocus) tabs[current].focus();
    schedule();
  }

  function isPlaying() { return !userPaused && !hoverPaused; }

  function schedule() {
    clearTimeout(timer);
    if (isPlaying()) timer = setTimeout(function () { show(current + 1); }, INTERVAL);
  }

  function setPaused(paused) {
    userPaused = paused;
    root.classList.toggle('is-paused', paused);
    pauseBtn.setAttribute('aria-label', paused ? 'Play slideshow' : 'Pause slideshow');
    show(current);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { show(i); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1, true); }
      if (e.key === 'Home') { e.preventDefault(); show(0, true); }
      if (e.key === 'End') { e.preventDefault(); show(slides.length - 1, true); }
    });
  });
  root.querySelector('[data-prev]').addEventListener('click', function () { show(current - 1); });
  root.querySelector('[data-next]').addEventListener('click', function () { show(current + 1); });
  pauseBtn.addEventListener('click', function () { setPaused(!userPaused); });

  // Pause while the visitor is reading or using the slideshow
  root.addEventListener('mouseenter', function () { hoverPaused = true; show(current); });
  root.addEventListener('mouseleave', function () { hoverPaused = false; show(current); });
  root.addEventListener('focusin', function () { hoverPaused = true; show(current); });
  root.addEventListener('focusout', function (e) {
    if (!root.contains(e.relatedTarget)) { hoverPaused = false; show(current); }
  });
  document.addEventListener('visibilitychange', function () {
    hoverPaused = document.hidden; show(current);
  });

  // Swipe on touch screens
  var startX = null;
  root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  root.classList.add('is-ready');
  setPaused(userPaused);
})();
