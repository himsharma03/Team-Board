import { useState } from 'react';
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
      console.error('Failed to create board:', err);
    }
  };
return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
    <input
      type="text"
      placeholder="New Board Name"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="border px-2 py-1 rounded w-full"
    />
    <button type="submit" className="w-[80px] ml-[50px] bg-blue-500 text-white px-4 py-1 rounded mt-5">
      Create
    </button>
  </form>
);

};

export default CreateBoard;
