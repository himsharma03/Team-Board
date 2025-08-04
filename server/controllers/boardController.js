const Board = require('../models/Board');


const getBoards = async (req, res) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch boards', error: err.message });
  }
};

const createBoard = async (req, res) => {
  const { title } = req.body;

  if (!title)   {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newBoard = new Board({ title });
    await newBoard.save();
    res.status(201).json(newBoard);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create board', error: err.message });
  }
};

const Task = require('../models/Task');

const deleteBoard = async (req, res) => {
  const { id } = req.params;

  try {
    const delBoard = await Board.findByIdAndDelete(id);
    if (!delBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }

    await Task.deleteMany({ boardId: id });

    return res.status(200).json({ message: 'Board and associated tasks deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete board', error: err.message });
  }
};


const editBoard = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required to update the board' });
  }

  try {
    const updatedBoard = await Board.findByIdAndUpdate(
      id,
      { title },
      { new: true } 
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res.status(200).json(updatedBoard);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update board', error: err.message });
  }
};

module.exports = {
  getBoards,
  createBoard,
  deleteBoard,
  editBoard
};
