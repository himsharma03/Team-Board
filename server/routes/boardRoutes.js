const express = require('express');
const router = express.Router();

const { 
  getBoards, 
  createBoard, 
  deleteBoard, 
  editBoard 
} = require('../controllers/boardController');

router.get('/', getBoards);

router.post('/', createBoard);

router.delete('/:id', deleteBoard);

router.put('/:id', editBoard);

module.exports = router;

