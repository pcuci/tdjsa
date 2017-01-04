describe('onSuccess test', function() {
  it('calls createURL with latitude and longitude', function() {
    var createURLSpy = sandbox.spy(window, 'createURL');
    var position = {coords: {latitude: 40.41, longitude: -105.55}};

    onSuccess(position);

    expect(createURLSpy).to.have.been.calledWith(40.41, -105.55);
  });

  it('calls setLocation with URL returned by createURL', function() {
    var url = 'https://www.example.com';
    sandbox.stub(window, 'createURL').returns(url);

    var setLocationSpy = sandbox.spy(window, 'setLocation');
    var position = {coords: {latitude: 40.41, longitude: -105.55}};
    onSuccess(position);

    expect(setLocationSpy).to.have.been.calledWith(window, url);
  });
});
