describe('task controller tests', function() {
  // write canary test only if this is the first test for the front-end in this project
  it('canary test', function() {
    expect(true).to.be.true;
  });

  var controller;
  var tasksServiceMock;

  beforeEach(module('todoapp'));

  beforeEach(inject(function($controller) {
    tasksServiceMock = {};

    controller = $controller('TasksController', {
      TasksService: tasksServiceMock
    });
  }));

  it('tasks empty on create', function() {
    expect(controller.tasks).to.be.eql([]);
  });

  it('message empty on create', function() {
    expect(controller.message).to.be.eql('');
  });

  it('getTasks interacts with the service', function(done) {
    controller.updateTasks = function() {};
    controller.updateError = function() {};

    tasksServiceMock.get = function(success, error) {
      expect(success).to.be.eql(controller.updateTasks);
      expect(error).to.be.eql(controller.updateError);
      done();
    };
    controller.getTasks();
  });

  it('updateTasks updates tasks', function() {
    var tasksStub = [{sample: 1}];
    controller.updateTasks(tasksStub);
    expect(controller.tasks).to.be.eql(tasksStub);
  });

  it('updateError updates message', function() {
    controller.updateError('Not Found', 404);
    expect(controller.message).to.be.eql('Not Found (status: 404)');
  });

  it('sortTasks sorts based on year', function() {
    var task1 = { name: 'task a', month: 1, day: 10, year: 2017};
    var task2 = { name: 'task b', month: 1, day: 10, year: 2016};
    var sorted = controller.sortTasks([task1, task2]);
    expect(sorted).to.be.eql([task2, task1]);
  });

  it('sortTasks sorts on year, then month', function() {
    var task1 = { name: 'task a', month: 2, day: 10, year: 2017};
    var task2 = { name: 'task c', month: 1, day: 10, year: 2016};
    var task3 = { name: 'task b', month: 1, day: 10, year: 2017};
    var sorted = controller.sortTasks([task1, task2, task3]);
    expect(sorted).to.be.eql([task2, task3, task1]);
  });

  it('sortTasks should sort on year, month, then day', function() {
    var task1 = { name: 'task a', month: 1, day: 20, year: 2017};
    var task2 = { name: 'task c', month: 1, day: 14, year: 2017};
    var task3 = { name: 'task b', month: 1, day: 9, year: 2017};
    var sorted = controller.sortTasks([task1, task2, task3]);
    expect(sorted).to.be.eql([task3, task2, task1]);
  });

  it('sortTasks should sort on year, month, day, then name', function() {
    var task1 = { name: 'task a', month: 1, day: 14, year: 2017};
    var task2 = { name: 'task c', month: 1, day: 14, year: 2017};
    var task3 = { name: 'task b', month: 1, day: 14, year: 2017};
    var sorted = controller.sortTasks([task1, task2, task3]);
    expect(sorted).to.be.eql([task1, task3, task2]);
  });

  it('updateTasks calls sortTasks', function() {
    var tasksStub = [{sample: 1}];
    controller.sortTasks = function(tasks) {
      expect(tasks).to.be.eql(tasksStub);
      return '..sorted..';
    }

    controller.updateTasks(tasksStub);
    expect(controller.tasks).to.be.eql('..sorted..');
  });

});
