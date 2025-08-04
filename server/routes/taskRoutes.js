const express = require('express');
const router = express.Router();

const {
  getTasksByBoard,
  createTask,
  deleteTask,
  editTask
} = require('../controllers/taskController');

router.get('/:boardId', getTasksByBoard); // Get all tasks by board
router.post('/', createTask);             // Create a new task
router.delete('/:id', deleteTask);        // Delete task by ID
router.put('/:id', editTask);             // Edit task by ID

module.exports = router;
