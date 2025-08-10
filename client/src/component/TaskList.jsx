import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;

const TaskList = ({ boardId, refreshTrigger, darkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks/board/${boardId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    if (boardId) fetchTasks();
  }, [boardId, refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const startEditing = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/api/tasks/${editingTask}`, {
        title: editTitle,
        description: editDescription,
      });
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Tasks</h3>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`p-4 rounded shadow-sm relative ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border`}
          >
            {editingTask === task._id ? (
              <form onSubmit={handleEditSubmit} className="space-y-2">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white border border-gray-300'}`}
                  placeholder="Title"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-white border border-gray-300'}`}
                  placeholder="Description"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`px-3 py-1 rounded ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className={`px-3 py-1 rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{task.title}</h4>
                {task.description && (
                  <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{task.description}</p>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => startEditing(task)}
                    className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;