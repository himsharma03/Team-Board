const mongoose = require('mongoose');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Task Room Management
    socket.on('joinTaskRoom', (boardId) => {
      if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
        console.error('Invalid boardId provided for joinTaskRoom');
        return socket.emit('error', 'Invalid board ID');
      }
      socket.join(`tasks:${boardId}`);
      console.log(`Socket ${socket.id} joined task room for board ${boardId}`);
    });

    socket.on('leaveTaskRoom', (boardId) => {
      if (!boardId || !mongoose.Types.ObjectId.isValid(boardId)) {
        console.error('Invalid boardId provided for leaveTaskRoom');
        return;
      }
      socket.leave(`tasks:${boardId}`);
      console.log(`Socket ${socket.id} left task room for board ${boardId}`);
    });

    // Task Real-time Events
    socket.on('task-create', (data) => {
      io.to(`tasks:${data.boardId}`).emit('task-created', data.task);
    });

    socket.on('task-update', (data) => {
      io.to(`tasks:${data.boardId}`).emit('task-updated', data.task);
    });

    socket.on('task-delete', (data) => {
      io.to(`tasks:${data.boardId}`).emit('task-deleted', data.taskId);
    });

    socket.on('task-status', (data) => {
      io.to(`tasks:${data.boardId}`).emit('task-status-changed', {
        taskId: data.taskId,
        newStatus: data.status
      });
    });

    socket.on('task-assign', (data) => {
      io.to(`tasks:${data.boardId}`).emit('task-assigned', {
        taskId: data.taskId,
        assignedTo: data.assignedTo
      });
    });

    // Error Handling
    socket.on('error', (error) => {
      console.error(`Socket error from ${socket.id}:`, error);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};