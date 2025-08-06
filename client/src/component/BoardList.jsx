import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const BoardList = ({ onBoardSelect, refreshTrigger, onBoardDeleted, darkMode }) => {
  const [boards, setBoards] = useState([]);
  const [editingBoard, setEditingBoard] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const API = import.meta.env.VITE_API_URL;

  const fetchBoards = async () => {
    try {
      const res = await axios.get(`${API}/api/boards`);
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
      await axios.delete(`${API}/api/boards/${id}`);
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
      await axios.put(`${API}/api/boards/${editingBoard}`, { title: editTitle });
      setEditingBoard(null);
      fetchBoards();
    } catch (err) {
      console.error('Error editing board:', err);
    }
  };

  return (
    <div className="mb-4">
      <ul className="space-y-2">
        {boards.map((board) => (
          <li 
            key={board._id} 
            className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'} shadow-sm transition`}
          >
            {editingBoard === board._id ? (
              <form onSubmit={handleEditSubmit} className="space-y-2">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-600 text-white' : 'bg-white'}`}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className={`flex-1 px-3 py-1 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingBoard(null)}
                    className={`flex-1 px-3 py-1 rounded-md ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <button
                  onClick={() => onBoardSelect(board)}
                  className={`text-left font-medium ${darkMode ? 'text-white' : 'text-gray-800'} hover:text-blue-500 transition flex-1`}
                >
                  {board.title}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(board)}
                    className={`p-1 rounded-full ${darkMode ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-600' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
                    title="Edit board"
                  >
                    <FontAwesomeIcon icon={faEdit} size="sm" />
                  </button>
                  <button
                    onClick={() => handleDelete(board._id)}
                    className={`p-1 rounded-full ${darkMode ? 'text-gray-300 hover:text-red-400 hover:bg-gray-600' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                    title="Delete board"
                  >
                    <FontAwesomeIcon icon={faTrash} size="sm" />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardList;