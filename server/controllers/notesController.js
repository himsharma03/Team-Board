// new file: controllers/notesController.js
const Note = require('../models/Note');
const mongoose = require('mongoose');

const getNotesByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ message: 'Invalid board ID' });
    }
    const notes = await Note.find({ boardId });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes', error: err.message });
  }
};

const createNote = async (req, res) => {
  const { boardId, content } = req.body;
  if (!boardId || !content) {
    return res.status(400).json({ message: 'Board ID and content are required' });
  }
  try {
    const newNote = new Note({ boardId, content });
    await newNote.save();

    // Emit to all clients in the same board room
    req.io.to(`notes:${boardId}`).emit('note-created', newNote);

    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create note', error: err.message });
  }
};

const editNote = async (req, res) => {
  const { id } = req.params;
  const { content, isPinned } = req.body;
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { content, isPinned },
      { new: true }
    );
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    req.io.to(`notes:${updatedNote.boardId}`).emit('note-updated', updatedNote);
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update note', error: err.message });
  }
};

const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    req.io.to(`notes:${deletedNote.boardId}`).emit('note-deleted', id);
    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note', error: err.message });
  }
};


// You can add more functions for pinNote, searchNotes, etc.
// based on what's defined in your noteRoutes.js

module.exports = {
  getNotesByBoard,
  createNote,
  editNote,
  deleteNote,
};