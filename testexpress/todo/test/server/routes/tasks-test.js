var expect = require('chai').expect;
var sinon = require('sinon');
var task = require('../../../models/task');
var express = require('express');

describe('tasks routes tests', function() {
  var sandbox;
  var router;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(express, 'Router').returns({
      get: sandbox.spy(),
      post: sandbox.spy(),
      delete: sandbox.spy()
    });
    router = require('../../../routes/tasks');
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('registers URI /for get', function() {
    expect(router.get.calledWith('/', sandbox.match.any)).to.be.true;
  });

  var stubResSend = function(expected, done) {
    return {
      send: function(data) {
        expect(data).to.be.eql(expected);
        done();
      }
    };
  };

  it('get / handler calls model\'s all & returns result', function(done) {
    var sampleTasks = [{
      name: 't1',
      month: 12,
      day: 1,
      year: 2016
    }];
    sandbox.stub(task, 'all', function(callback) {
      callback(null, sampleTasks);
    });

    var req = {};
    var res = stubResSend(sampleTasks, done);
    var registeredCallback = router.get.firstCall.args[1];
    registeredCallback(req, res);
  });
});
