import { useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const CreateTask = ({ boardId, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
 
console.log("boardId:", boardId);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting task...");
    if (!title.trim()) return;

    try {
      await axios.post(`${API}/api/tasks`, {
        title,
        description,
        boardId,
        status: 'todo',
      });
      console.log('Sending task:', { title, description, boardId });

      setTitle('');
      setDescription('');
      onTaskCreated();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border px-2 py-1 rounded"
        rows="3"
      />
      <button type="submit" className="bg-red-100 hover:bg-red-500 text-white px-4 py-1 rounded self-start">
        Add Task
      </button>
    </form>
  );
};

export default CreateTask;
