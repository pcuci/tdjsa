(function(app) {
  app.SortPipe = ng.core.Pipe({ name: 'sort' }).Class({
    constructor: function() {},
    transform: function(languages) {
      return languages.slice().sort();
    }
  });
})(window.app || (window.app = {}));
