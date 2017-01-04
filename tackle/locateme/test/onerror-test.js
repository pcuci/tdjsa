// onError test uses a Sinon stub instead of mock

describe('onError test', function() {
  it('sets the error DOM element', function() {
    var domElement = {innerHTML: ''};
    sandbox.stub(document, 'getElementById')
      .withArgs('error')
      .returns(domElement);

    var message = "you're kidding";
    var positionError = {message: message};

    onError(positionError);
    expect(domElement.innerHTML).to.be.eql(message);
  });
});
