(function(app) {
  document.addEventListener('DOMContentLoaded', function() {
    ng.platformBrowserDynamic.bootstrap(app.TasksComponent);
  });
})(window.app || (window.app = {}));
