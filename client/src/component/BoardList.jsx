import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BoardList = ({ onBoardSelect, refreshTrigger, onBoardDeleted }) => {
  const [boards, setBoards] = useState([]);
  const [editingBoard, setEditingBoard] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const fetchBoards = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/boards');
      setBoards(res.data);
    } catch (err) {
      console.error('Error fetching boards:', err);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [refreshTrigger]);

 const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/boards/${id}`);
      fetchBoards();

      if (onBoardDeleted) {
        onBoardDeleted(id);
      }

    } catch (err) {
      console.error('Error deleting board:', err);
    }
  };

  const startEditing = (board) => {
    setEditingBoard(board._id);
    setEditTitle(board.title);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/boards/${editingBoard}`, { title: editTitle });
      setEditingBoard(null);
      fetchBoards();
    } catch (err) {
      console.error('Error editing board:', err);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-[30px] text-blue-500 mb-4">Boards</h2>
      <ul className="space-y-2">
        {boards.map((board) => (
          <li key={board._id} className="bg-gray-100 p-2 rounded relative">
            {editingBoard === board._id ? (
              <form onSubmit={handleEditSubmit} className="flex gap-2">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button type="submit" className="bg-green-500 text-white px-2 rounded">Save</button>
                <button onClick={() => setEditingBoard(null)} className="bg-gray-300 px-2 rounded">Cancel</button>
              </form>
            ) : (
              <>
                <button
                  onClick={() => onBoardSelect(board)}
                  className="text-left font-bold w-full"
                >
                  {board.title}
                </button>
                <div className="absolute top-2 right-2 flex gap-2 text-sm">
                  <button onClick={() => startEditing(board)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(board._id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardList;
