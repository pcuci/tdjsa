var validateTask = function(task) {
  if (task && task.name && task.month && !isNaN(task.month) && task.day && !isNaN(task.day) && task.year && !isNaN(task.year)) {
    return true;
  }

  return false;
};

(typeof module !== 'undefined') && (module.exports = validateTask);
