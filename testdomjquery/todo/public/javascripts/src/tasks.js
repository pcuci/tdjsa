

var callService = function(options, callback) {
  var xhr = new XMLHttpRequest();

  xhr.open(options.method, options.url);

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      callback(xhr.status, xhr.response);
    }
  };

  xhr.setRequestHeader('Content-Type', options.contentType);
  xhr.send(options.data);
}

var updateTasks = function(status, response) {
  if (status === 200) {
    var tasks = JSON.parse(response);
    document.getElementById('taskscount').innerHTML = tasks.length;
    var row = function(task) {
      return '<tr><td>'
        + task.name
        + '</td>'
        + '<td>'
        + task.month + '/' + task.day + '/' + task.year
        + '</td>'
        + '<td>'
        + '<a onclick="deleteTask(\'' + task._id + '\');">delete</a>'
        + '</td>'
        + '</tr>';
    }
    var table = '<table>' + tasks.map(row).join('') + '</table>';
    document.getElementById('tasks').innerHTML = table;
  } else {
    var message = response + ' (status: ' + status + ')';
    document.getElementById('message').innerHTML = message;
  }
};

var deleteTask = function(taskId) {
  var params = {
    method: 'DELETE',
    url: '/tasks/' + taskId
  }
  callService(params, updateMessage);
}

var getTasks = function() {
  var params = {
    method: 'GET',
    url: '/tasks'
  }
  callService(params, updateTasks);
};

var updateMessage = function(status, response) {
  document.getElementById('message').innerHTML = response + ' (status: ' + status + ')';

  getTasks();
};

var addTask = function() {
  var date = new Date(document.getElementById('date').value);

  var newTask = {
    name: document.getElementById('name').value,
    month: date.getMonth() + 1,
    day: date.getDate(),
    year: date.getFullYear()
  }

  if (validateTask(newTask)) {
    callService({
      method: 'POST',
      url: '/tasks',
      contentType: 'application/json',
      data: JSON.stringify(newTask)
    }, updateMessage);
  } else {
    updateMessage(0, 'invalid task');
  }

  return false;
};


var initpage = function() {
  getTasks();
  document.getElementById('submit').onclick = addTask;
}

window.onload = initpage;
