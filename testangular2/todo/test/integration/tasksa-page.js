var fetchModelById = function(modelId) {
  return element(by.id(modelId));
};

var fetchBindingById = function(bindingID) {
  return element(by.id(bindingID));
};

var fetchClickById = function(clickId) {
  return element(by.id(clickId));
};

var sendKey = function(element, text) {
  element.sendKeys(text);
};

var TasksAPage = function() {
  browser.get('/');
};

TasksAPage.prototype = {
  get tasksCount() {
    return fetchBindingById('length').getText();
  },
  get tasksAsText() {
    return element(by.css('table')).getText();
  },
  get message() {
    return fetchBindingById('message').getText();
  },
  deleteAt: function(index) {
    return element.all(by.css('table tr')).get(index).element(by.tagName('a'));
  },
  set name(text) {
    sendKey(fetchModelById('name'), text);
  },
  set date(text) {
    var textSplit = text.split('/');
    var dateElement = fetchModelById('date');
    sendKey(dateElement, textSplit[0]);
    sendKey(dateElement, '/' + textSplit[1]);
    sendKey(dateElement, '/' + textSplit[2]);
  },
  submit: function() {
    fetchClickById('submit').click();
  },
  get submitDisabled() {
    return fetchClickById('submit').getAttribute('disabled');
  }
};

module.exports = TasksAPage;
