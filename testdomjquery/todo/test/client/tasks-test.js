describe('tasks-with builtin functions-tests', function() {
  var sandbox;
  var domElements;
  var responseStub;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    domElements = {
      name: {
        value: 'a new task'
      },
      date: {
        value: '12/11/2016'
      },
    };

    sandbox.stub(document, 'getElementById', function(id) {
      if(!domElements[id]) {
        domElements[id] = {};
      }
      return domElements[id];
    });

    responseStub = JSON.stringify([
      {_id: '123412341201', name: 'task a', month: 8, day: 1, year: 2016},
{_id: '123412341202', name: 'task b', month: 9, day: 10, year: 2016},
{_id: '123412341203', name: 'task c', month: 10, day: 11, year: 2017}
    ]);
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.requests = [];
    xhr.onCreate = function(req) {
      xhr.requests.push(req);
    };
  });

  afterEach(function() {
    sandbox.restore();
    xhr.restore();
  });

  it('canary test', function() {
    expect(true).to.be.true;
  });

  it('getTasks calls callService', function(done) {
    sandbox.stub(window, 'callService', function(params) {
      expect(params.method).to.be.eql('GET');
      expect(params.url).to.be.eql('/tasks');
      done();
    })
    getTasks();
  });

  it('getTasks registers updateTasks with callService', function() {
    var callServiceMock = sandbox.mock(window).expects('callService').withArgs(sinon.match.any, updateTasks);
    getTasks();
    callServiceMock.verify();
  });

  it('updateTasks updates message if status != 200', function() {
    updateTasks(404, '..err..');
    expect(domElements.message.innerHTML).to.be.eql('..err.. (status: 404)');
  });

  it('updateTasks updates taskscount', function() {
    updateTasks(200, responseStub);
    expect(domElements.taskscount.innerHTML).to.be.eql(3);
  });

  it('updateTasks updates tasks table', function() {
    updateTasks(200, responseStub);
    expect(domElements.tasks.innerHTML).contains('<table>');
    expect(domElements.tasks.innerHTML).contains('<td>task a</td>');
    expect(domElements.tasks.innerHTML).contains('<td>8/1/2016</td>');
    expect(domElements.tasks.innerHTML).contains('<td>task b</td>');
  });

  it('callService calls service', function() {
    callService({
      method: 'GET',
      url: '/tasks'
    }, sandbox.spy());
    expect(xhr.requests[0].method).to.be.eql('GET');
    expect(xhr.requests[0].url).to.be.eql('/tasks');
    expect(xhr.requests[0].sendFlag).to.be.eql.true;
  });

  it('callService sends xhr status code to callback', function() {
    var callback = sandbox.mock().withArgs(200).atLeast(1);
    callService({
      method: 'GET',
      url: '/tasks'
    }, callback);
    xhr.requests[0].respond(200);
    callback.verify();
  });

  it('callService sends response to callback', function() {
    var callback = sandbox.mock().withArgs(200, '..res..').atLeast(1);
    callService({
      method: 'GET',
      url: '/tasks'
    }, callback);
    xhr.requests[0].respond(200, {}, '..res..');
    callback.verify();
  });

  it('callService sends error response to callback', function() {
    var callback = sandbox.mock().withArgs(404, '..err..').atLeast(1);
    callService({
      method: 'GET',
      url: '/tasks'
    }, callback);
    xhr.requests[0].respond(404, {}, '..err..');
    callback.verify();
  });

  it('callService only sends when final response received', function() {
    var callback = sandbox.spy();
    callService({
      method: 'GET',
      url: '/tasks'
    }, callback);
    expect(callback.callCount).to.be.eql(0);
  });

  it('register initpage handler with window onload', function() {
    expect(window.onload).to.be.eql(initpage);
  });

  it('addTask calls callService', function(done) {
    sandbox.stub(window, 'callService', function(params, callback) {
      expect(params.method).to.be.eql('POST');
      expect(params.url).to.be.eql('/tasks');
      expect(params.contentType).to.be.eql('application/json');

      var newTask = '{"name":"a new task","month":12,"day":11,"year":2016}';

      expect(params.data).to.be.eql(newTask);
      expect(callback).to.be.eql(updateMessage);
      done();
    });
    addTask();
  });

  it('callService sends data to the service', function() {
    callService({
      method: 'POST',
      url: '/tasks',
      data: '...some data...'
    });
    expect(xhr.requests[0].requestBody).to.be.eql('...some data...');
  });

  it('callService has default content type', function() {
    callService({
      method: 'POST',
      url: '/tasks',
      data: '...some data...'
    });
    expect(xhr.requests[0].requestHeaders["Content-Type"]).contains('text/plain');
  });

  it('callService sets content type if present', function() {
    callService({
      method: 'POST',
      url: '/tasks',
      data: '...some data...',
      contentType: 'whatever'
    });
    expect(xhr.requests[0].requestHeaders['Content-Type']).contains('whatever');
  });

  it('addTask callback updates message', function() {
    updateMessage(200, 'added');
    expect(domElements.message.innerHTML).to.be.eql('added (status: 200)');
  });

  it('addTask callback calls getTasks', function() {
    var getTasksMock = sandbox.mock(window, 'getTasks');
    updateMessage(200, 'task added');
    getTasksMock.verify();
  });

  it('initpage registers add task click event', function() {
    initpage();
    expect(domElements.submit.onclick).to.be.eql(addTask);
  });

  it('addTask returns false', function() {
    expect(addTask()).to.be.false;
  });

  it('addTask for invalid task: skips callServiceMock call to updateMessage', function() {
    var updateMessageMock = sandbox.mock(window)
      .expects('updateMessage')
      .withArgs(0, 'invalid task');
    var callServiceMock = sandbox.spy(window, 'callService');
    sandbox.stub(window, 'validateTask').returns(false);
    addTask();
    updateMessageMock.verify();
    expect(callServiceMock).to.not.be.called;
  });

  it('updateTasks appends delete link', function() {
    updateTasks(200, responseStub);
    var expected = '<td><a onclick="deleteTask(\'123412341201\');">delete</a></td>';
    expect(domElements.tasks.innerHTML).contains(expected);
  });

  it('deleteTask calls callService', function(done) {
    sandbox.stub(window, 'callService', function(params) {
      expect(params.method).to.be.eql('DELETE');
      expect(params.url).to.be.eql('/tasks/123412341203');
      done();
    });
    deleteTask('123412341203');
  });

  it('deleteTask registers updateMessage', function() {
    var callServiceMock = sandbox.mock(window).expects('callService').withArgs(sinon.match.any, updateMessage);
    deleteTask('123412341203');
    callServiceMock.verify();
  });



});
