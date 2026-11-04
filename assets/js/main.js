// NextCart: mobile menu + home page slideshow
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

  // Slideshow: each photo zooms out for 4 seconds, then the next slide slides in
  var root = document.querySelector('[data-carousel]');
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll('.slide'));
  var tabs = Array.prototype.slice.call(root.querySelectorAll('.hero-tab'));
  if (slides.length < 2) return;

  var INTERVAL = 4000;
  var SLIDE_MS = 800;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var current = 0;
  var timer = null;
  var leaveTimer = null;
  var held = false; // paused while a keyboard user is in the slideshow or the browser tab is hidden

  root.style.setProperty('--interval', INTERVAL + 'ms');
  root.style.setProperty('--slide-ms', SLIDE_MS + 'ms');

  function show(index, moveFocus) {
    var next = (index + slides.length) % slides.length;
    if (next !== current) {
      var prev = slides[current];
      slides.forEach(function (s) { s.classList.remove('is-leaving'); });
      prev.classList.add('is-leaving');
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(function () { prev.classList.remove('is-leaving'); }, SLIDE_MS + 50);
    }
    current = next;
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
      t.classList.remove('is-running');
      if (on && playing()) { void t.offsetWidth; t.classList.add('is-running'); }
    });
    if (moveFocus) tabs[current].focus();
    schedule();
  }

  function playing() { return !reduceMotion && !held; }

  function schedule() {
    clearTimeout(timer);
    if (playing()) timer = setTimeout(function () { show(current + 1); }, INTERVAL);
  }

  function hold(on) {
    if (held === on) return;
    held = on;
    root.classList.toggle('is-holding', on);
    tabs.forEach(function (t) { t.classList.toggle('is-running', false); });
    if (!on && tabs[current] && playing()) { void tabs[current].offsetWidth; tabs[current].classList.add('is-running'); }
    schedule();
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

  root.addEventListener('focusin', function () { hold(true); });
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) hold(false); });
  document.addEventListener('visibilitychange', function () { hold(document.hidden); });

  // Swipe on touch screens (but let the Black Friday product strip scroll sideways)
  var startX = null;
  root.addEventListener('touchstart', function (e) {
    startX = e.target.closest('.bf-grid') ? null : e.touches[0].clientX;
  }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  root.classList.add('is-ready');
  show(0);
})();
