import { useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const CreateTask = ({ boardId, onTaskCreated, darkMode }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post(`${API}/api/tasks`, {
        title,
        description,
        boardId,
        status: 'todo',
      });
      setTitle('');
      setDescription('');
      onTaskCreated();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`mt-6 p-4 rounded-lg  `}>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${darkMode ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white border border-gray-300'}`}
        />
        <textarea
          placeholder="Task description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${darkMode ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white border border-gray-300'}`}
          rows="3"
        />
        <button
          type="submit"
          className={`px-4 py-2 text-white font-medium rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${darkMode ? 'bg-green-700 hover:bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          Add Task
        </button>
      </div>
    </form>
  );
};

export default CreateTask;