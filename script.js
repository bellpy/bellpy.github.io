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
  
    /* ----- Init ----- */

    if (location.hash) showPane(location.hash.slice(1));
  
    document.getElementById('yr').textContent = new Date().getFullYear();
  })();