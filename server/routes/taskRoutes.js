const express = require('express');
const router = express.Router();

const {
  getTasksByBoard,
  createTask,
  deleteTask,
  editTask
} = require('../controllers/taskController');

router.get('/board/:boardId', getTasksByBoard);
router.post('/', createTask);             
router.delete('/:id', deleteTask);       
router.put('/:id', editTask);             

module.exports = router;
