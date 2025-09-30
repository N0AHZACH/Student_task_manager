const router = require('express').Router();
let Task = require('../models/Task');

// GET all tasks
router.route('/').get((req, res) => {
  Task.find()
    .then(tasks => res.json(tasks))
    .catch(err => res.status(400).json('Error: ' + err));
});

// POST a new task (Updated to handle empty dates)
router.route('/').post((req, res) => {
  const { title, description, dueDate, status } = req.body;
  
  const newTaskData = {
    title,
    description,
    status,
  };

  // Only add dueDate to the new task if it's not empty or null
  if (dueDate) {
    newTaskData.dueDate = dueDate;
  }

  const newTask = new Task(newTaskData);

  newTask.save()
    .then(() => res.json('Task added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// GET a specific task by ID
router.route('/:id').get((req, res) => {
  Task.findById(req.params.id)
    .then(task => res.json(task))
    .catch(err => res.status(400).json('Error: ' + err));
});

// DELETE a task by ID
router.route('/:id').delete((req, res) => {
  Task.findByIdAndDelete(req.params.id)
    .then(() => res.json('Task deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// UPDATE a task by ID
router.route('/:id').put((req, res) => {
  Task.findById(req.params.id)
    .then(task => {
      task.title = req.body.title;
      task.description = req.body.description;
      task.status = req.body.status;

      // Only update the date if it's provided in the request
      if (req.body.dueDate) {
        task.dueDate = Date.parse(req.body.dueDate);
      } else {
        task.dueDate = undefined; // Allows removing a date
      }

      task.save()
        .then(() => res.json('Task updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;