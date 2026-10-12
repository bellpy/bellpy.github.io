(function () {
  'use strict';

  var root = document.documentElement;
  var panes = document.querySelectorAll('.pane');
  var title = document.getElementById('title');
  var modeButton = document.getElementById('mode');

  /* ----- Navigation between panes ----- */

  function showPane(id) {
    if (!document.getElementById(id)) id = 'home';

    panes.forEach(function (pane) {
      pane.classList.toggle('on', pane.id === id);
    });

    title.textContent = id;

    try {
      history.replaceState(null, '', '#' + id);
    } catch (e) {
      /* history may be unavailable (e.g. sandboxed frames) */
    }
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-go]');
    if (target) showPane(target.getAttribute('data-go'));
  });

  /* ----- Day / night toggle ----- */

  modeButton.addEventListener('click', function () {
    var goingToDay = root.getAttribute('data-mode') !== 'day';
    root.setAttribute('data-mode', goingToDay ? 'day' : 'night');
    modeButton.setAttribute('aria-pressed', goingToDay);
  });

  /* ----- Viewer for blender + art (images, videos, placeholders) ----- */

  var lb = document.getElementById('lb');
  var stage = document.getElementById('lbstage');
  var lastOpener = null;

  document.querySelectorAll('.open').forEach(function (btn) {
    var name = btn.closest('.tile').querySelector('figcaption').firstChild.textContent.trim();
    btn.setAttribute('aria-label', 'View ' + name);
  });

  function openViewer(btn) {
    var thumb = btn.querySelector('.img');
    var cap = btn.closest('.tile').querySelector('figcaption');
    var src = btn.getAttribute('data-src') || thumb.currentSrc || thumb.src;
    var el;

    if (thumb.tagName === 'VIDEO') {
      el = document.createElement('video');
      el.src = src;
      el.controls = true;
      el.autoplay = true;
      el.playsInline = true;
    } else if (thumb.tagName === 'IMG') {
      el = document.createElement('img');
      el.src = src;
      el.alt = thumb.alt || '';
    } else {
      el = document.createElement('div');
      el.className = thumb.className + ' ph';
    }

    stage.innerHTML = '';
    stage.appendChild(el);
    document.getElementById('lbt').textContent = cap.firstChild.textContent.trim();
    var small = cap.querySelector('small');
    document.getElementById('lbm').textContent = small ? small.textContent : '';

    lastOpener = btn;
    lb.classList.add('on');
    document.getElementById('lbx').focus();
  }

  function closeViewer() {
    lb.classList.remove('on');
    stage.innerHTML = ''; /* also stops any playing video */
    if (lastOpener) lastOpener.focus();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.open');
    if (btn) openViewer(btn);
  });

  lb.addEventListener('click', function (e) {
    if (!e.target.closest('.lb__stage, figcaption')) closeViewer();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('on')) closeViewer();
  });

  /* ----- Init ----- */

  if (location.hash) showPane(location.hash.slice(1));

  document.getElementById('yr').textContent = new Date().getFullYear();
})();