// client/src/component/BoardPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TaskBoard from './TaskBoard';
import Notes from './Notes';
import Loading from './Loading';

const API = import.meta.env.VITE_API_URL;

const BoardPage = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const res = await axios.get(`${API}/api/boards/${boardId}`);
                setBoard(res.data);
            } catch (err) {
                console.error("Failed to fetch board:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBoard();
    }, [boardId]);

    if (loading) {
        return <Loading />;
    }

    if (!board) {
        return <div>Board not found.</div>;
    }

    return (
        <div className="board-page-container p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">{board.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{board.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3">
                    <TaskBoard boardId={boardId} />
                </div>
                <div className="md:col-span-1">
                    <Notes boardId={boardId} />
                </div>
            </div>
        </div>
    );
};

export default BoardPage;