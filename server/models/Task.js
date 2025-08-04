const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String, 
    default: '', 
  },
});

module.exports = mongoose.model('Task', taskSchema);
