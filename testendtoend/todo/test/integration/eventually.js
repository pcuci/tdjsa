var expect = require('chai').expect;
require('chai').use(require('chai-as-promised'));

module.exports = function(object) {
  return expect(object).to.be.eventually;
}
