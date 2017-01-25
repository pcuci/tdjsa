var TasksController = function(tasksService, $filter, $document) {
  var controller = this;
  controller.tasks = [];
  controller.message = '';
  controller.newTask = {
    name: '',
    date: ''
  };

  controller.getTasks = function() {
    tasksService.get(controller.updateTasks, controller.updateError);
  };

  controller.updateTasks = function(tasks) {
    controller.tasks = controller.sortTasks(tasks);
  };

  controller.updateError = function(error, status) {
    controller.message = error + ' (status: ' + status + ')';
  };

  controller.sortTasks = function(tasks) {
    var orderBy = $filter('orderBy');
    return orderBy(tasks, ['year', 'month', 'day', 'name']);
  };

  controller.convertNewTaskToJSON = function() {
    var dateParts = controller.newTask.date.split('/');
    return {
      name: controller.newTask.name,
      month: parseInt(dateParts[0]),
      day: parseInt(dateParts[1]),
      year: parseInt(dateParts[2])
    };
  };

  controller.addTask = function() {
    tasksService.add(
      controller.convertNewTaskToJSON(controller.newTask),
      controller.updateMessage,
      controller.updateError
    );
  };

  controller.updateMessage = function(message) {
    controller.message = message;
    controller.getTasks();
  };

  controller.disableAddTask = function() {
    return !validateTask(controller.convertNewTaskToJSON());
  };

  controller.deleteTask = function(taskId) {
    tasksService.delete(taskId, controller.updateMessage, controller.updateError);
  };

  $document.ready(controller.getTasks);
};

angular.module('todoapp')
.controller('TasksController', ['TasksService', '$filter', '$document', TasksController]);
