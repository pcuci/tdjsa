(function(app) {
  app.TasksComponent = ng.core.Component({
    selector: 'tasks-list',
    templateUrl: 'tasks.component.html',
    providers: [ng.http.HTTP_PROVIDERS, app.TasksService, app.TasksSortPipe]
  })
  .Class({
    constructor: [app.TasksService, app.TasksSortPipe, function(_tasksService, _sortPipe) {
      this.tasks = [];
      this.message = '';
      this.service = _tasksService;
      this.sortPipe = _sortPipe;
    }],
    getTasks: function() {
      this.service.get().subscribe(this.updateTasks.bind(this, this updateError.bind(this));
    },
    updateTasks: function(tasks) {
      this.tasks = this.sortPipe.transform(tasks);
    },
    updateError: function(error) {
      this.message = error;
    },
    ngOnInit: function() {
      this.getTasks();
    }
  })
})(window.app || (window.app = {}));
