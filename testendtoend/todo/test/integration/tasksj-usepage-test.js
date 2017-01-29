var eventually = require('./eventually');
var TasksPage = require('./tasksj-page');

describe('tasks ui test', function() {
  var page;

  beforeEach(function() {
    browser.ignoreSynchronization = true;
    page = new TasksPage();
  });

  afterEach(function() {
    browser.ignoreSynchronization = false;
  });

  it('page shows correct task count', function() {
    eventually(page.tasksCount).eql('4');
  });

  it('page displays tasks', function() {
    eventually(page.tasksAsText).contain('Test Models');
    eventually(page.tasksAsText).contain('Test UI');
  });

  it('adds a task', function() {
    page.name = 'Create Quality Code';
    page.date = '12/15/2016';
    page.submit();

    eventually(page.message).contain('task added');
    eventually(page.tasksAsText).contain('Create Quality Code');
  });

  it('deletes a task', function() {
    page.deleteAt(1).click();
    eventually(page.message).contain('task deleted');
    eventually(page.tasksAsText).not.contain('Test Routes');
  });
});
