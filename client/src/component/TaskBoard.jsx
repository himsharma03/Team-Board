import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const API = import.meta.env.VITE_API_URL;

const TaskBoard = ({ boardId, refreshTask, darkMode }) => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks/board/${boardId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  useEffect(() => {
    if (boardId) fetchTasks();
  }, [boardId, refreshTask]);

  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      )
    );

    try {
      await axios.put(`${API}/api/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
    } catch (err) {
      console.error('Drag update failed:', err);
      fetchTasks();
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`${API}/api/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditForm({ title: task.title, description: task.description });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/api/tasks/${editingTaskId}`, editForm);
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const columns = ['todo', 'in-progress', 'done'];

  const statusColors = {
    todo: darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200',
    'in-progress': darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200',
    done: darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
  };

  const statusTitles = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done'
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                className={`p-4 rounded-lg border ${statusColors[status]} shadow-sm`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                    status === 'todo' ? 'bg-blue-500' : 
                    status === 'in-progress' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></span>
                  {statusTitles[status]}
                  <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-600 text-gray-200' : 'bg-white text-gray-600'}`}>
                    {tasks.filter(t => t.status === status).length}
                  </span>
                </h3>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          className={`mb-3 p-3 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-700 border-gray-600 hover:shadow-gray-600' : 'bg-white border-gray-200 hover:shadow-md'} transition`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {editingTaskId === task._id ? (
                            <form onSubmit={submitEdit} className="space-y-2">
                              <input
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                                className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-600 text-white' : 'bg-white border border-gray-300'}`}
                                required
                              />
                              <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                className={`w-full px-3 py-2 rounded-md ${darkMode ? 'bg-gray-600 text-white' : 'bg-white border border-gray-300'}`}
                              />
                              <div className="flex gap-2">
                                <button 
                                  type="submit" 
                                  className={`px-3 py-1 text-white text-sm rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={() => setEditingTaskId(null)}
                                  className={`px-3 py-1 text-sm rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{task.title}</h4>
                              {task.description && (
                                <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{task.description}</p>
                              )}
                              <div className="flex justify-end gap-2 mt-2">
                                <button
                                  onClick={() => startEditing(task)}
                                  className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(task._id)}
                                  className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-red-900/30 hover:bg-red-800/30 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;