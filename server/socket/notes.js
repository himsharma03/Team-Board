const mongoose = require('mongoose');
const Note = require('../models/Note');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join notes room
    socket.on('joinBoardNotes', (boardId) => {
      if (!mongoose.Types.ObjectId.isValid(boardId)) {
        console.error('Invalid boardId provided for joinBoardNotes');
        return socket.emit('error', 'Invalid board ID');
      }
      socket.join(`notes:${boardId}`);
      console.log(`Socket ${socket.id} joined notes room for board ${boardId}`);
    });

    socket.on('leaveBoardNotes', (boardId) => {
      if (!mongoose.Types.ObjectId.isValid(boardId)) return;
      socket.leave(`notes:${boardId}`);
      console.log(`Socket ${socket.id} left notes room for board ${boardId}`);
    });

    // CREATE note via socket
    socket.on('note-create', async ({ boardId, content }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(boardId) || !content?.trim()) {
          return socket.emit('error', 'Invalid data for note-create');
        }

        const newNote = new Note({ boardId, content });
        await newNote.save();

        io.to(`notes:${boardId}`).emit('note-created', newNote);
      } catch (err) {
        console.error('Error creating note:', err);
        socket.emit('error', 'Failed to create note');
      }
    });

    // UPDATE note
    socket.on('note-update', async ({ boardId, noteId, content }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(noteId)) return;

        const updatedNote = await Note.findByIdAndUpdate(
          noteId,
          { content },
          { new: true }
        );

        if (updatedNote) {
          io.to(`notes:${boardId}`).emit('note-updated', updatedNote);
        }
      } catch (err) {
        console.error('Error updating note:', err);
        socket.emit('error', 'Failed to update note');
      }
    });

    // DELETE note
    socket.on('note-delete', async ({ boardId, noteId }) => {
      try {
        if (!mongoose.Types.ObjectId.isValid(noteId)) return;

        await Note.findByIdAndDelete(noteId);
        io.to(`notes:${boardId}`).emit('note-deleted', noteId);
      } catch (err) {
        console.error('Error deleting note:', err);
        socket.emit('error', 'Failed to delete note');
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
