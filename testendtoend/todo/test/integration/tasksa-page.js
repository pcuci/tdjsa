var fetchByModel = function(model) {
  return element(by.model(model));
};

var fetchByBinding = function(binding) {
  return element(by.binding(binding));
};

var fetchByNgClick = function(clickFunction) {
  return element(by.css('[data-ng-click="' + clickFunction + '"]'));
};

var sendKey = function(element, text) {
  element.sendKeys(text);
};

var TasksAPage = function() {
  browser.get('/tasksa.html');
};

TasksAPage.prototype = {
  get tasksCount() {
    return  fetchByBinding('controller.tasks.length').getText();
  },
  get tasksAsText() {
    return element.all(by.repeater('task in controller.tasks').column('task.name')).getText();
  },
  get message() {
    return fetchByBinding('controller.message').getText();
  },
  deleteAt: function(index) {
    return element(by.repeater('task in controller.tasks').row(index)).element(by.tagName('a'));
  },
  set name(text) {
    sendKey(fetchByModel('controller.newTask.name'), text);
  },
  set date(text) {
    sendKey(fetchByModel('controller.newTask.date'), text);
  },
  submit: function() {
    fetchByNgClick('controller.addTask();').click();
  },
  get submitDisabled() {
    return fetchByNgClick('controller.addTask();').getAttribute('disabled');
  }
};

module.exports = TasksAPage;
