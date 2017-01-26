var TasksService = function($http) {
  var service = this;

  service.get = function(success, error) {
    $http.get('tasks').success(success).error(error);
  }

  service.add = function(task, success, error) {
    $http.post('tasks', task).success(success).error(error);
  }

  service.delete = function(taskId, success, error) {
    $http.delete('tasks/' + taskId).success(success).error(error);
  }

}

angular.module('todoapp').service('TasksService', ['$http', TasksService]);
