// Hosts the setup and teardown functions for Sinon sandbox

var sandbox;

beforeEach(function() {
  sandbox = sinon.sandbox.create();
});

afterEach(function() {
  sandbox.restore();
});
