import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = ({ boardId, refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${boardId}`);
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
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
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
      await axios.put(`http://localhost:5000/api/tasks/${editingTask}`, {
        title: editTitle,
        description: editDescription
      });
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Tasks</h3>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="bg-white border p-4 rounded shadow-sm relative">
            {editingTask === task._id ? (
              <form onSubmit={handleEditSubmit} className="space-y-2">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border px-2 py-1 w-full rounded"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border px-2 py-1 w-full rounded"
                />
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                  <button onClick={() => setEditingTask(null)} className="bg-gray-300 px-2 py-1 rounded">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h4 className="text-md font-semibold">{task.title}</h4>
                {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => startEditing(task)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:underline text-sm"
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