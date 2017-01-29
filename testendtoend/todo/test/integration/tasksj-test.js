var expect = require('chai').expect;
require('chai').use(require('chai-as-promised'));

describe('tasks ui test', function() {
  beforeEach(function() {
    browser.ignoreSynchronization = true;
    browser.get('/tasksj.html');
  });

  afterEach(function() {
    browser.ignoreSynchronization = false;
  });

  it('shows correct task count', function() {
    expect(element(by.id('taskscount')).getText()).to.be.eventually.eql('4');
  });

  it('display tasks on page', function() {
    expect(element(by.id('tasks')).getText()).to.eventually.contain('Test Models');
    expect(element(by.id('tasks')).getText()).to.eventually.contain('Test UI');
  });

  it('adds a task', function() {
    element(by.id('name')).sendKeys('Create Quality Code');
    element(by.id('date')).sendKeys('12/15/2016');
    element(by.id('submit')).click();

    expect(element(by.id('message')).getText()).to.eventually.contain('task added');
    expect(element(by.id('tasks')).getText()).to.eventually.contain('Create Quality Code');
  });

  it('deletes a task', function() {
    element.all(by.linkText('delete')).get(1).click();

    expect(element(by.id('message')).getText()).to.eventually.contain('task deleted');
    expect(element(by.id('tasks')).getText()).to.eventually.not.contain('Test Routes');
  });
});
