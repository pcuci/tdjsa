var expect = require('chai').expect;
var isPalindrome = require('../src/palindrome');

describe('palindrome-test', function () {
  it('canary test', function () {
    expect(true).to.be.true;
  });

  it('mom is a palindrome', function () {
    var word = 'mom';

    var result = isPalindrome(word);

    expect(result).to.be.true;
  });

  it('dad is a palindrome', function () {
    expect(isPalindrome('dad')).to.be.true;
  });

  it('dude is not a palindrome', function () {
    expect(isPalindrome('dude')).to.be.false;
  });

  it('"mom mom" is a palindrome', function () {
    expect(isPalindrome('mom mom')).to.be.true;
  });

  it('"mom dad" is not a palindrome', function () {
    expect(isPalindrome('mom dad')).to.be.false;
  });

  it('"" empty string is not a palindrome', function () {
    expect(isPalindrome('')).to.be.false;
  });

  it('"  " two spaces string is not a palindrome', function () {
    expect(isPalindrome('  ')).to.be.false;
  });

  it('throws an exception for missing argument', function () {
    var call = function() { isPalindrome(); };
    expect(call).to.throw(Error, 'Invalid argument');
  });
});
