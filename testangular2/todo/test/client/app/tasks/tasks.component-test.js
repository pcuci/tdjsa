describe('tasks component tests', function() {
  var sandbox;
  var tasksComponent;
  var tasksService;
  var observable = {
    subscribe: function() {}
  };
  var updateTasksBindStub = function() {};
  var updateTasksBindStub = function() {};
  var updateErrorBindStub = function() {};
  var sortPipe = {
    transform: function(data) {
      return data;
    }
  };
  var updateMessageBindStub = function() {};

  beforeEach(function() {
    tasksService = {
      get: function() {},
      add: function() {},
      delete: function() {}
    }

    tasksComponent = new app.TasksComponent(tasksService, sortPipe);

    sandbox = sinon.sandbox.create();
    sandbox.stub(tasksComponent.updateTasks, 'bind').withArgs(tasksComponent).returns(updateErrorBindStub);

    sandbox.stub(tasksComponent.updateError, 'bind').withArgs(tasksComponent).returns(updateErrorBindStub);
    sandbox.stub(tasksService, 'get').withArgs().returns(observable);
    sandbox.stub(tasksComponent.updateMessage, 'bind').withArgs(tasksComponent).returns(updateMessageBindStub);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('sets the selector attribute', function() {
    var componentAnnotations = Reflect.getMetadata('annotations', app.TasksComponent)[0];
    expect(componentAnnotations.selector).to.be.eql('tasks-list');
  });

  it('sets templateUrl attribute', function() {
    var componentAnnotations = Reflect.getMetadata('annotations', app.TasksComponent)[0];
    expect(componentAnnotations.templateUrl).to.be.eql('tasks.component.html');
  });

  it('initializes tasks to an empty array', function() {
    expect(tasksComponent.tasks).to.be.eql([]);
  });

  it('initializes message to an empty string', function() {
    expect(tasksComponent.message).to.be.eql('');
  });

  it('getTasks registers handlers with service', function() {
    var observableMock = sandbox.mock(observable).expects('subscribe').withArgs(updateTasksBindStub, updateErrorBindStub);
    tasksComponent.getTasks();
    observableMock.verify();
  });

  it('updateTasks updates tasks', function() {
    var tasksStub = [{sample: 1}];
    tasksComponent.updateTasks(tasksStub);
    expect(tasksComponent.tasks).to.be.eql(tasksStub);
  });

  it('updateError updates message', function() {
    tasksComponent.updateError('Not Found');
    expect(tasksComponent.message).to.be.eql('Not Found');
  });

  it('getTasks called on init', function() {
    var getTasksMock = sandbox.mock(tasksComponent).expects('getTasks');
    tasksComponent.ngOnInit();
  });

  it('updateTasks calls transform on pipe', function() {
    var tasksStub = '...fake input...';
    var expectedSortedTasks = '...fake output...';
    sandbox.stub(sortPipe, 'transform').withArgs(tasksStub).returns(expectedSortedTasks);
    tasksComponent.updateTasks(tasksStub);
    expect(tasksComponent.tasks).to.be.eql(expectedSortedTasks);
  });

  it('registers necessary providers', function() {
    var componentAnnotations = Reflect.getMetadata('annotations', app.TasksComponent)[0];
    var expectedProviders = [ng.http.HTTP_PROVIDERS, app.TasksService, app.TasksSortPipe];
    expect(componentAnnotations.providers).to.be.eql(expectedProviders);
  });

  it('TasksService injected into component', function() {
    var injectedServices = Reflect.getMetadata('parameters', app.TasksComponent);
    expect(injectedServices[0]).to.be.eql([app.TasksService]);
    expect(injectedServices[1]).to.be.eql([app.TasksSortPipe]);
  });

  it('newTask initialized correctly', function() {
    expect(tasksComponent.newTask.name).to.be.eql('');
    expect(tasksComponent.newTask.date).to.be.eql('');
  });

  it('converts newTask with no data to JSON', function() {
    var newTask = tasksComponent.convertNewTaskToJSON();
    expect(newTask.name).to.be.eql('');
    expect(newTask.month).to.be.NAN;
    expect(newTask.day)to.be.NAN;
    expect(newTask.year).to.be.NAN;
  });

  it('converts newTask with data to JSON', function() {
    var newTask = {
      name: 'task a',
      date: '6/10/2016'
    };
    var newTaskJSON = {
      name: 'task a',
      month: 6,
      day: 10,
      year: 2016
    };
    tasksComponent.newTask = newTask;
    expect(tasksComponent.convertNewTaskToJSON()).to.be.eql(newTaskJSON);
  });

  it('addTask registers service handlers', function() {
    var observableMock = sandbox.mock(observable).expects('subscribe').withArgs(updateMessageBindStub, updateErrorBindStub);

    var taskStub = {};
    tasksComponent.convertNewTaskToJSON = function() {
      return taskStub;
    };

    sandbox.stub(tasksService, 'add').withArgs(taskStub).returns(observable);

    tasksComponent.addTask();
    observableMock.verify();
  });

  it('updateMessage updates message and calls getTasks', function(done) {
    tasksComponent.getTasks = function() {
      done();
    };
    tasksComponent.updateMessage('good');
    expect(tasksComponent.message).to.be.eql('good');
  });

  it('sets validateTask to common function', function() {
    expect(tasksComponent.validateTask).to.be.eql(validateTask);
  });

  it('disableAddTask uses validateTask', function() {
    tasksComponent.newTask = {
      name: 'task a',
      date: '6/10/2016'
    };
    var validateTaskSpy = sinon.spy(tasksComponent, 'validateTask');
    expect(tasksComponent.disableAddTask()).to.be.false;
    expect(validateTaskSpy).to.have.been.calledWith(tasksComponent.convertNewTaskToJSON());
  });

});
