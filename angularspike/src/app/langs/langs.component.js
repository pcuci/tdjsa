(function(app) {
  app.LangsComponent = ng.core.Component({
    selector: 'lang-names',
    templateUrl: 'langs.component.html',
    providers: [ng.http.HTTP_PROVIDERS, app.LangsService],
    pipes: [app.SortPipe]
  }).Class({
    constructor: [app.LangsService, function(_langsService) {
      this.langsService = _langsService;
      this.langs = [];
      this.message = '';
    }],
    getLangs: function() {
      this.langsService.get().subscribe(this.updateLangs.bind(this), this.updateError.bind(this));
    },
    updateLangs: function(langs) {
      this.message = '';
      this.langs = langs.split('\n');
    },
    updateError: function(error) {
      this.message = error;
      this.langs = [];
    },
    ngOnInit: function() {
      this.getLangs();
    }
  });
})(window.app || (window.app = {}));
