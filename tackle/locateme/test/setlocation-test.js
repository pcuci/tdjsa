// setLocation interacts with the window object, we mock it using a lightweight JSON object with a location property

describe('setLocation test', function() {
  it('sets window.location to URL', function() {
    var windowStub = {};
    var url = 'http://example.com';

    setLocation(windowStub, url);

    expect(windowStub.location).to.be.eql(url);
  })
})
