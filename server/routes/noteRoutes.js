const express = require('express');
const router = express.Router();

const { 
  getNotesByBoard,
  createNote,
  deleteNote,
  editNote
} = require('../controllers/notesController');

// Create a new note
router.post('/', createNote);

// Get all notes for a specific board
router.get('/board/:boardId', getNotesByBoard);

// Update a note
router.put('/:id', editNote);

// Delete a note
router.delete('/:id', deleteNote);

module.exports = router;
