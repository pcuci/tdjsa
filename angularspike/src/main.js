(function(app) {
  document.addEventListener('DomContentLoaded', function() {
    ng.platformBrowserDynamic.bootstrap(app.LangsComponent);
  });
})(window.app || (window.app = {}));
