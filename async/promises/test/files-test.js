var expect = require('chai').expect;
var linesCount = require('../src/files');
require('chai').use(require('chai-as-promised'));

describe('test promises', function () {
  it('returns correct lines count for valid file', function(done) {
    var checkCount = function(count) {
      expect(count).to.be.eql(16);
      done();
    }
    linesCount('src/files.js').then(checkCount);
  });

  it('returns correct lines count - using return', function() {
    var callback = function(count) {
      expect(count).to.be.eql(16);
    };
    return linesCount('src/files.js').then(callback);
  });

  it('returns correct lines count - using eventually', function() {
    return expect(linesCount('src/files.js')).to.eventually.eql(16);
  });

  it('returns correct lines count - using no return', function(done) {
    expect(linesCount('src/files.js')).to.eventually.eql(16).notify(done);
  });

  it('errors for an invalid file name', function(done) {
    expect(linesCount('src/flies.js')).to.be.rejected.notify(done);
  });

  it('errors for an invalid file name - using with', function(done) {
    expect(linesCount('src/flies.js')).to.be.rejectedWith('unable to open file src/flies.js').notify(done);
  });
});
