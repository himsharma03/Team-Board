import { useState } from 'react';
import BoardList from '../component/BoardList';
import CreateBoard from '../component/CreateBoard';
import CreateTask from '../component/CreateTask';
import TaskBoard from '../component/TaskBoard';

const Home = () => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [refresh, setRefresh] = useState(Date.now());

  const triggerRefresh = () => setRefresh(Date.now());

  return (
    <div className="flex h-screen">
  
      <div className="w-[280px] bg-white p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4 text-black">Boards</h1>
        <CreateBoard onBoardCreated={triggerRefresh} />
        <BoardList
          onBoardSelect={(board) => {
            setSelectedBoard(board);
            triggerRefresh();
          }}
          refreshTrigger={refresh}
          onBoardDeleted={(deletedId) => {
            if (selectedBoard?._id === deletedId) setSelectedBoard(null);
            triggerRefresh();
          }}
        />
      </div>

     
      <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
        {selectedBoard ? (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-500">
               {selectedBoard.title}
            </h2>
            <CreateTask
              boardId={selectedBoard._id}
              onTaskCreated={triggerRefresh}
            />
            <TaskBoard
              boardId={selectedBoard._id}
              refreshTask={refresh}
            />
          </div>
        ) : (
          <div className="text-gray-500 text-lg text-center mt-20">
            Select a board to view tasks
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
