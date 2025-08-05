const mongoose = require('mongoose');
const Task = require('../models/Task');
const Board = require('../models/Board'); 

const getTasksByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const tasks = await Task.find({ boardId });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

const createTask = async (req, res) => {
  const { boardId, title, description, status = 'todo' } = req.body;

  if (!mongoose.Types.ObjectId.isValid(boardId)) {
    return res.status(400).json({ message: 'Invalid board ID format' });
  }

  if (!boardId || !title) {
    return res.status(400).json({ message: 'Board ID and title are required' });
  }

  try {
    const newTask = new Task({ boardId, title, description, status });
    await newTask.save();

    await Board.findByIdAndUpdate(boardId, {
      $push: { tasks: newTask._id }
    });

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const delTask = await Task.findByIdAndDelete(id);
    if (!delTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Board.findByIdAndUpdate(delTask.boardId, {
      $pull: { tasks: delTask._id }
    });

    return res.status(200).json({ message: 'Task successfully deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
};

const editTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body; 

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status }, 
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};


module.exports = {
  getTasksByBoard,
  createTask,
  deleteTask,
  editTask
};
