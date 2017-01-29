var expect = require('chai').expect;
require('chai').use(require('chai-as-promised'));

describe('Google search page tests', function() {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.get('/');
  });

  afterEach(function() {
    browser.ignoreSynchronization = false;
  });

  it('home page has the Feeling Lucky button', function() {
    var inputElement = element(by.xpath('//input[@value="I\'m Feeling Lucky"]'));
    expect(inputElement.isPresent()).to.eventually.be.true;
  });

  it('search brings back and expected result', function() {
    var inputField = element(by.id('lst-ib'));

    inputField.sendKeys('agilelearner.com');
    inputField.sendKeys(protractor.Key.ENTER);
    var link = element(by.xpath("//a[@href='https://www.agilelearner.com/']"));
    browser.wait(function() {
      return link.isPresent();
    });
    expect(link.isDisplayed()).to.eventually.eql(true);
  })
})
