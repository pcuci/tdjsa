var eventually = require('./eventually');
var TasksPage = require('./tasksa-page');

describe('tasks ui test', function() {
  var page;

  beforeEach(function() {
    page = new TasksPage();
  });

  it('correct task count', function() {
    eventually(page.tasksCount).eql('4');
  });

  it('display tasks', function() {
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

  it('disables submit button on page load', function() {
    eventually(page.submitDisabled).eql('true');
  });

  it('enables submit button on data entry', function() {
    page.name = 'Create Quality Code';
    page.date = '12/15/2016';

    eventually(page.submitDisabled).not.eql('true');
  });
});
