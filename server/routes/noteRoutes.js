const express = require('express');
const router = express.Router();

const { 
  getNotesByBoard,
  createNote,
  deleteNote,
  editNote
} = require('../controllers/notesController');

router.post('/', createNote);
router.get('/board/:boardId', getNotesByBoard);
router.put('/:id', editNote);
router.delete('/:id', deleteNote);

module.exports = router;
