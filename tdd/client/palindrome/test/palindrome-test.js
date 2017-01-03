describe('palindrome-test', function () {
  it('canary test', function () {
    expect(true).to.be.true;
  });

  it('mom is palindrome', function () {
    expect(isPalindrome('mom')).to.be.true;
  });

  it('should return true for argument dad', function() {
    expect(isPalindrome('dad')).to.be.true;
  });

  it('should return false for argument dude', function() {
    expect(isPalindrome('dude')).to.be.false;
  });

  it('should return true for argument mom mom', function() {
    expect(isPalindrome('mom mom')).to.be.true;
  });

  it('should return false for argument mom dad', function() {
    expect(isPalindrome('mom dad')).to.be.false;
  });

  it('should return false when argument is an empty string', function() {
    expect(isPalindrome('')).to.be.false;
  });

  it('should return false for argument with only two spaces', function() {
    expect(isPalindrome(' ')).to.be.false;
  });

  it('should throw an exception if argument is missing', function() {
    var call = function() { isPalindrome(); };
    expect(call).to.throw(Error, 'Invalid argument');
  });
});
