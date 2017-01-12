var expect = require('chai').expect;
var db = require('../../../db');
var ObjectId = require('mongodb').ObjectId;
var task = require('../../../models/task');
var validateTask = require('../../../public/javascripts/common/validate-task');

describe('task model tests', function() {
  var sampleTask;
  var sampleTasks;

  before(function(done) {
    db.connect('mongodb://localhost/todotest', done);
  });

  after(function() {
    db.close();
  });

  var id = function(idValue) {
    return new ObjectId(idValue);
  }

  beforeEach(function(done) {
    sampleTask = {
      name: 'a new task',
      month: 10,
      day: 5,
      year: 2016
    };

    sampleTasks = [{
        _id: id('223412341240'), name: 'task1', month: 10, day: 5, year: 2016
      }, {
        _id: id('223412341241'), name: 'task2', month: 11, day: 2, year: 2016
      }, {
        _id: id('223412341242'), name: 'task3', month: 12, day: 8, year: 2016
      }];

    db.get().collection('tasks').insert(sampleTasks, done);
  });

  afterEach(function(done) {
    db.get().collection('tasks').drop(done);
  });

  xit('all returns all tasks', function() {
    var callback = function(err, tasks) {
      expect(tasks).to.be.eql(sampleTasks);
      done();
    };
    task.all(callback);
  });

  it('get returns task with given id', function(done) {
    var callback = function(err, task) {
      expect(task.name).to.be.eql('task1');
      expect(task.month).to.be.eql(10);
      done();
    };
    task.get('223412341240', callback);
  });

  it('returns null for non-existing task', function(done) {
    var callback = function(err, task) {
      expect(task).to.be.null;
      done();
    };
    task.get(2319, callback);
  });

  it('add returns null for valid task', function(done) {
    var callback = function(err) {
      expect(err).to.be.null;
      task.all(function(err, tasks) {
        expect(tasks[3].name).to.be.eql('a new task');
        done();
      });
    };
    task.add(sampleTask, callback);
  });

  var expectError = function(message, done) {
    return function(err) {
      expect(err.message).to.be.eql(message);
      done();
    };
  };

  it('add returns Error if task already exists', function(done) {
    sampleTask = sampleTasks[0];
    delete sampleTask._id;
    task.add(sampleTask, expectError('duplicate task', done));
  });

  it('task.validate refers to validateTask', function() {
    expect(task.validate).to.be.eql(validateTask);
  });

  xit('add calls validate', function(done) {
    validatedCalled = false;
    task.validate = function(task) {
      expect(task).to.be.eql(sampleTask);
      validateCalled = true;
      return validateTask(task);
    };

    task.add(sampleTask, done);

    epect(validateCalled).to.be.true;

    task.validate = validateTask;
  });

  it('add handles validation failure', function(done) {
    var onError = function(err) {
      expect(err.message).to.be.eql('unable to add task');
      done();
    }
    task.validate = function(task) { return false; };

    task.add(sampleTask, onError);

    task.validate = validateTask;
  });

  xit('delete returns Error if task not found', function(done) {
    var callback = function(err) {
      expect(err).to.be.null;
      task.all(function(err, tasks) {
        expect(tasks.length).to.be.eql(2);
        done();
      });
    };
    task.delete('23412341242', callback);
  });

  xit('delete returns Error if task not found', function(done) {
    task.delete('2342342342342', expectError('unable to delete task with id: 2342342342342', done));
  });

  it('delete returns Error if task id not given', function(done) {
    task.delete(undefined, expectError('unable to delete task with id: undefined', done));
  });
});
