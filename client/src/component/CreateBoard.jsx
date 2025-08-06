import { useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const CreateBoard = ({ onBoardCreated, darkMode }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post(`${API}/api/boards`, { title });
      setTitle('');
      onBoardCreated();
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
      <div className="flex flex-col space-y-3">
        <input
          type="text"
          placeholder="Enter board name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${darkMode ? 'bg-gray-600 text-white placeholder-gray-400' : 'bg-white border border-gray-300'}`}
        />
        <button 
          type="submit" 
          className={`px-4 py-2 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${darkMode ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          Create Board
        </button>
      </div>
    </form>
  );
};

export default CreateBoard;