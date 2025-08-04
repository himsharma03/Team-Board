import React, { useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const CreateBoard = ({ onBoardCreated }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post(`${API}/api/boards`, { title });
      setTitle('');
      onBoardCreated();
    } catch (err) {
      console.error('Error creating board:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h3 className="text-lg font-semibold text-blue-500 mb-2">Create New Board</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter board title"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="submit"
        className="mt-3 w-full bg-purple-200 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
      >
        Create Board
      </button>
    </form>
  );
};

export default CreateBoard;
