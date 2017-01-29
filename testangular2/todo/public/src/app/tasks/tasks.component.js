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
      this.newTask = {
        name: '',
        date: ''
      };
      this.validateTask = validateTask;
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
    },
    convertNewTaskToJSON: function() {
      var dateParts = this.newTask.date.split('/');
      return {
        name: this.newTask.name,
        month: parseInt(dateParts[0]),
        day: parseInt(dateParts[1]),
        year: parseInt(dateParts[2])
      }
    },
    addTask: function() {
      this.service.add(this.convertNewTaskToJSON()).subscribe(this.updateMessage.bind(this), this.updateError.bind(this));
    },
    updateMessage: function(message) {
      this.message = message;
      this.getTasks();
    },
    disableAddTask: function() {
      return !this.validateTask(this.convertNewTaskToJSON());
    }
  })
})(window.app || (window.app = {}));
