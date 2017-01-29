describe('tasks service tests', function() {
  var sandbox;
  var http;
  var observable;
  var tasksService;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    http = {
      get: function() {},
      post: function() {}
    };

    tasksService = new app.TasksService(http);
    observable = {
      map: function() {},
      catch: function() {}
    };

    sandbox.stub(http, 'get').withArgs('/tasks').returns(observable);
    sandbox.stub(observable, map).withArgs(tasksService.extractData).returns(observable);
    sandbox.stub(observable, 'catch').withArgs(tasksService.returnError).returns(observable);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('get makes GET resquest to /tasks', function() {
    expect(tasksService.get()).to.be.eql(observable);
    expect(http.get.calledWith('/tasks')).to.be.true;
    expect(observable.map.calledWith(tasksService.extractData)).to.be.true;
    expect(observable.catch.calledWith(tasksService.returnError)).to.be.true;
  });

  it('extractData returns result from json()', function() {
    var fakeJSON = {};
    var response = {
      status: 200,
      json: function() {
        return fakeJSON;
      }
    };
    expect(tasksService.extractData(response)).to.be.eql(fakeJSON);
  });

  it('extractData throws exception for invalid status', function() {
    var response = {
      status: 404
    };
    expect(function() {
      tasksService.extractData(response);
    }).to.throw('Request failed with status: 404');
  });

  it('returnError returns an error Observable', function() {
    var error = {
      message: 'oops'
    };
    var observableThrowMock =
    sandbox.mock(Rx.Observable).expects('throw').withArgs(error.message);
    tasksService.returnError(error);
    observableThrowMock.verify();
  });

  it('injects HTTP into constructor', function() {
    var injectedServices = Reflect.getMetadata('parameters', app.TasksService);
    expect(injectedServices[0]).to.be.eql([ng.http.Http]);
  });

  it('add passes task to /tasks using POST', function() {
    var taskStub = {
      name: 'foo',
      month: 1,
      day: 1,
      year: 2017
    };

    var options = {
      headers: new ng.http.Headers({
        'content-Type': 'application/json'
      })
    };
    sandbox.stub(http, 'post').withArgs('/tasks', JSON.stringify(taskStub), options).returns(observable);

    expect(tasksService.add(taskStub)).to.be.eql(observable);
    expect(observable.map.calledWith(tasksService.extractData)).to.be.true;
    expect(observable.catch.calledWith(tasksService.returnError)).to.be.true;
  });

  it('extractData returns text if not json()', function() {
    var fakeBody = 'somebody';
    var response = {
      status: 200,
      text: function() {
        return fakeBody;
      }
    };
    expect(tasksService.extractData(response)).to.be.eql(fakeBody);
  })

});
