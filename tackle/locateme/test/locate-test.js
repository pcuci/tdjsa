// Interaction test to verify that locate() calls getCurrentPosition() with the correct callback functions, first we use a mock and then switch to use Sinon mock for more concise and fluent testing

describe('locate test', function() {
  it('registers handleres with getCurrentPosition', function(done) {
    var original = navigator.geolocation.getCurrentPosition;

    navigator.geolocation.getCurrentPosition = function(success, error) {
      expect(success).to.be.eql(onSuccess);
      expect(error).to.be.eql(onError);
      done();
    }

    locate();

    navigator.geolocation.getCurrentPosition = original;
  });

  it('registers handleres with getCurrentPosition - using sinon', function() {
    var getCurrentPositionMock = sandbox.mock(navigator.geolocation)
      .expects('getCurrentPosition')
      .withArgs(onSuccess, onError);

    locate();

    getCurrentPositionMock.verify();
  });
});
