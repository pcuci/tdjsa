var jGetTasks = function() {
  jCallService({method: 'GET', url: '/tasks'}, jUpdateTasks);
};

var jCallService = function(options, callback) {
  $.ajax({
    type: options.method,
    url: options.url,
    headers: {
      'Content-Type': options.contentType || 'text/plain'
    },
    data: options.data,
    dataType: 'text',
    contentType: options.contentType,
    success: function(data, status, xhr) {
      callback(200, data);
    },
    error: function(xhr, status, errorThrown) {
      callback(xhr.status, errorThrown);
    }
  });
};

var jUpdateTasks = function(status, response) {
  if(status === 200) {
    var tasks = $.parseJSON(response);

    $('#taskscount').html(tasks.length);

    var row = function(task) {
      return '<tr><td>' + task.name + '</td>'
        + '<td>' + task.month + '/' + task.day + '/' +task.year + '</td>'
        + '<td><a onclick="jDeleteTask(\'' + task._id + '\');">delete</a></td>'
        + '</tr>';
    };
    var table = '<table>' + tasks.map(row).join('') + '</table>';
    $('#tasks').html(table);
  } else {
      var message = response + ' (status: ' + status + ')';
      $('#message').html(message);
  }
};

var jInitpage = function() {
  jGetTasks();
  $('#submit').click(jAddTask);
};

var jAddTask = function() {
  var date = new Date($('#date').val());
  var newTask = {
    name: $('#name').val(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    year: date.getFullYear()
  };

  if(validateTask(newTask)) {
    jCallService({method: 'POST', url: '/tasks',
      contentType: 'application/json',
      data: JSON.stringify(newTask)}, jUpdateMessage);
  } else {
    jUpdateMessage(0, 'invalid task');
  }

  return false;
};

var jUpdateMessage = function(status, response) {
  $('#message').html(response + ' (status: ' + status + ')');
  jGetTasks();
};

var jDeleteTask = function(taskId) {
  jCallService({method: 'DELETE', url: '/tasks/' + taskId}, jUpdateMessage);
};

$(document).ready(jInitpage);
