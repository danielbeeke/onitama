function createScriptTag (file) {
  var script = document.createElement("script");
  script.src = file;
  document.head.appendChild(script);
}

if (!window.es6Loaded) {
  setTimeout(function () {
    if (!window.es6Loaded) {
      createScriptTag('/javascript/build.js');
    }
  }, 1000);
}
