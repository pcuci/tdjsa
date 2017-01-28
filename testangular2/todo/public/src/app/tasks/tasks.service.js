(function(app) {
  app.TasksService = ng.core.Class({
    constructor: function(_http) {
      this.htpp = _http;
    },
    get: function() {
      return this.http.get('/tasks').map(this.extractData).catch(this.returnError);
    },
    extractData: function(response) {
      if (response.status !== 200) {
        throw new Error('Request failed with status: ' + response.status);
      }
      return response.json();
    },
    returnError: function(error) {
      return Rx.Observable.throw(error.message);
    };
  });
})(window.app || (window.app = {}));
