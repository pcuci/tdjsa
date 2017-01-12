var express = require('express');
var task = require('../models/task');

var router = express.Router();

router.get('/', function(req, res, next) {
  task.all(function(err, tasks) {
    res.send(tasks);
  });
});

router.get('/:id', function(req, res, next) {
  task.get(req.params.id, function(err, task) {
    if (task) {
      res.send(task);
    } else {
      res.send({});
    }
  });
});

router.post('/', function(req, res, next) {
  task.add(req.body, function(err) {
    if (err) {
      res.send(err.message);
    } else {
      res.send('task added');
    }
  });
});

router.delete('/:id', function(req, res, next) {
  task.delete(req.params.id, function(err) {
    if (err) {
      res.send(err.message);
    } else {
      res.send('task deleted');
    }
  });
});

module.exports = router;
