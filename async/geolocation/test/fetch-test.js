describe('fetch location test', function () {
  it('get lat and lon from fetchLocation', function(done) {
    var onSuccess = function(location) {
      expect(location).to.have.property('lat');
      expect(location).to.have.property('lon');
      done();
    }

    var onError = function(err) {
      throw 'not expected';
    }
    this.timeout(10000);
    fetchLocation(onSuccess, onError);
  });
});
