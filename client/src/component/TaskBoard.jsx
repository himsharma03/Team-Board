import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const API = import.meta.env.VITE_API_URL;

const TaskBoard = ({ boardId, refreshTask }) => {
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
    try {
      await axios.put(`${API}/api/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
      fetchTasks();
    } catch (err) {
      console.error('Drag update failed:', err);
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {columns.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                className="p-4 bg-blue-100 rounded shadow min-h-[200px]"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h3 className="text-lg font-semibold capitalize mb-2">{status}</h3>
                {tasks
                  .filter((task) => task.status === status)
                  .map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        <div
                          className="bg-white p-2 rounded shadow mb-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {editingTaskId === task._id ? (
                            <form onSubmit={submitEdit} className="space-y-1">
                              <input
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                                className="w-full border px-2 py-1 rounded"
                                required
                              />
                              <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                className="w-full border px-2 py-1 rounded"
                              />
                              <div className="flex gap-2 text-sm mt-1">
                                <button type="submit" className="bg-red-200 hover:bg-red-500 text-white px-2 py-1 rounded">Save</button>
                                <button onClick={() => setEditingTaskId(null)} className="bg-gray-300 px-2 py-1 rounded">Cancel</button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <strong>{task.title}</strong>
                              <p className="text-sm text-gray-600">{task.description}</p>
                              <div className="flex justify-end gap-2 text-xs mt-1">
                                <button onClick={() => startEditing(task)} className="text-black border border-black px-[2px] py-[2px] bg-gray-100 hover:underline">Edit</button>
                                <button onClick={() => handleDelete(task._id)} className="text-black border border-black px-[2px] py-[2px] bg-gray-100  hover:underline">Delete</button>
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
