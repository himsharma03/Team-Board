import React, { useState } from 'react';
import BoardList from '../component/BoardList';
import CreateBoard from '../component/CreateBoard';
import TaskList from '../component/TaskList';
import CreateTask from '../component/CreateTask';

const Home = () => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [refreshBoard, setRefreshBoard] = useState(false);
  const [refreshTask, setRefreshTask] = useState(false);

  const handleBoardCreated = () => {
    setRefreshBoard(!refreshBoard);
  };

  const handleTaskCreated = () => {
    setRefreshTask(prev => !prev);
  };

  const handleBoardDeleted = (deletedBoardId) => {
  setRefreshBoard(prev => !prev); 
  if (selectedBoard && selectedBoard._id === deletedBoardId) {
    setSelectedBoard(null); 
  }
};


  return (
    <div className="flex h-screen">
      <div className="w-64 p-4 bg-gray-100 shadow-md border-r border-gray-300">
        <div className="mt-10">
          <BoardList
  onBoardSelect={setSelectedBoard}
  refreshTrigger={refreshBoard}
  onBoardDeleted={handleBoardDeleted} 
/>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-white">
        {selectedBoard ? (
          <div>
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedBoard(null)} 
            >
              Go Back to Create Board
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              {selectedBoard.title}
            </h2>
            <CreateTask boardId={selectedBoard._id} onTaskCreated={handleTaskCreated} />
            <div className="mt-6">
              <TaskList boardId={selectedBoard._id} key={refreshTask} />
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <CreateBoard onBoardCreated={handleBoardCreated} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
