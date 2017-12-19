setTimeout(function () {
  if (!window.es6Loaded) {

  let element = document.querySelector('#game');

  element.innerHTML = '<div class="board-wrapper">' +
    '<div class="waiting-message">' +
    '<h2>Welcome to Onitama!</h2>' +
    '<h4>Unfortunately bad news! ' +
    'Onitama does not yet work in your browser.</h4>' +
    '<p>Easiest way to fix is to <a href="https://www.google.nl/chrome" target="_blank">download the newest chrome.</a><br><br>' +
    'Firefox user? Set <b>dom.moduleScripts.enabled</b> to true in about:config.</p>' +
    '</div>' +
    '</div>';
  }
}, 1000);
