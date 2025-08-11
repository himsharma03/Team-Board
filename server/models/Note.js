const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);