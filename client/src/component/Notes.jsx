import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const Notes = ({ boardId }) => {
  const [notes, setNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState('');

  const socketRef = useRef(null);
  const typingTimeouts = useRef({});        
  const editingNoteIdRef = useRef(null);    
  const textAreaRefs = useRef({});          
  const caretPositions = useRef({});       
 
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`${API}/api/notes/board/${boardId}`);
        setNotes(res.data);
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      }
    };
    if (boardId) fetchNotes();
  }, [boardId]);

 
  useEffect(() => {
    const socket = io(API);
    socketRef.current = socket;

    if (boardId) socket.emit('joinBoardNotes', boardId);

    const handleNoteCreated = (note) => {
      setNotes(prev => {
    
        if (prev.some(n => n._id === note._id)) return prev;
        return [...prev, note];
      });
    };

    const handleNoteUpdated = (updatedNote) => {
     
      if (editingNoteIdRef.current === updatedNote._id) return;

      setNotes(prev =>
        prev.map(n => (n._id === updatedNote._id ? updatedNote : n))
      );
    };

    const handleNoteDeleted = (noteId) => {
      setNotes(prev => prev.filter(n => n._id !== noteId));
    };

    socket.on('note-created', handleNoteCreated);
    socket.on('note-updated', handleNoteUpdated);
    socket.on('note-deleted', handleNoteDeleted);

    return () => {
      if (boardId) socket.emit('leaveBoardNotes', boardId);
      socket.off('note-created', handleNoteCreated);
      socket.off('note-updated', handleNoteUpdated);
      socket.off('note-deleted', handleNoteDeleted);
      socket.disconnect();
    };
  }, [boardId]); 


  const handleUpdateNote = async (noteId, newContent) => {
    try {
      const res = await axios.put(`${API}/api/notes/${noteId}`, { content: newContent });
      if (socketRef.current) {
        socketRef.current.emit('note-update', { boardId, note: res.data });
      }
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    try {
      await axios.post(`${API}/api/notes`, { boardId, content: newNoteContent });
      setNewNoteContent('');
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await axios.delete(`${API}/api/notes/${noteId}`);
      if (socketRef.current) socketRef.current.emit('note-delete', { boardId, noteId });
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };


  const handleLocalChange = (noteId, value, e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    caretPositions.current[noteId] = { start, end };
    editingNoteIdRef.current = noteId;

    setNotes(prev => prev.map(n => (n._id === noteId ? { ...n, content: value } : n)));

    requestAnimationFrame(() => {
      const ta = textAreaRefs.current[noteId];
      const pos = caretPositions.current[noteId];
      if (ta && pos) {
        try {
          ta.setSelectionRange(pos.start, pos.end);
        } catch (err) {

        }
      }
    });

   
    clearTimeout(typingTimeouts.current[noteId]);
    typingTimeouts.current[noteId] = setTimeout(() => {
      handleUpdateNote(noteId, value).finally(() => {
        if (editingNoteIdRef.current === noteId) editingNoteIdRef.current = null;
      });
    }, 700);
  };

  return (
    <div className="notes-container p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md h-full">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Notes</h3>

      <form onSubmit={handleCreateNote} className="flex flex-col sm:flex-row mb-4 gap-2">
        <input
          type="text"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="Add a new note..."
          className="flex-grow p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full sm:rounded-l-lg sm:rounded-r-none"
        />
        <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-blue-600 transition">
          Add
        </button>
      </form>

      <ul className="space-y-3 overflow-y-auto max-h-96">
        {notes.map((note) => (
          <li key={note._id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm flex items-start gap-2">
            <textarea
              ref={(el) => { textAreaRefs.current[note._id] = el; }}
              value={note.content ?? ''}
              onChange={(e) => handleLocalChange(note._id, e.target.value, e)}
              className="flex-grow bg-transparent border-none focus:outline-none resize-none dark:text-gray-300"
              rows={2}
            />
            <button onClick={() => handleDeleteNote(note._id)} className="ml-2 p-1 text-red-500 hover:text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.72-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
