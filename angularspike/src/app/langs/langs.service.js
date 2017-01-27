(function(app) {
  app.LangsService = ng.core.Class({
    constructor: [ng.http.Http, function(_http) {
      this.http = _http;
    }],
    get: function() {
      return this.http.get('/languages').map(this.extractData).catch(this.returnError);
    },
    extractData: function(response) {
      if (response.status !== 200) {
        throw new Error('error getting data, status: ' + response.status);
      }
      return response.text();
    },
    returnError: function(error) {
      return Rx.Observable.throw(error.message || "error, status: " + error.status);
    }
  })
})(window.app || (window.app = {}));
