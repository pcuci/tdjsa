var expect = require('chai').expect;
var db = require('../../db');

describe('db tests', function() {
  it('canary test', function() {
    expect(true).to.be.true;
  });

  it('get returns null connection by default', function() {
    expect(db.get()).to.be.null;
  });

  it('close ends current connection', function(done) {
    db.connection = {
      close: function() {
        done();
      }
    };
    db.close();
    expect(db.connection).to.be.null;
  });

  it('connect sets connection given valid database name', function(done) {
    var callback = function(err) {
      expect(err).to.be.null;
      expect(db.get().databaseName).to.be.eql('todotest');
      db.close();
      done();
    }
    db.connect('mongodb://localhost/todotest', callback);
  });
});
