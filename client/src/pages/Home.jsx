import { useState, useEffect } from 'react';
import { FaArrowLeft, FaMoon, FaSun, FaPlus } from 'react-icons/fa';
import BoardList from '../component/BoardList';
import CreateBoard from '../component/CreateBoard';
import CreateTask from '../component/CreateTask';
import TaskBoard from '../component/TaskBoard';
import Loading from '../component/Loading';

const Home = () => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [refresh, setRefresh] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const triggerRefresh = () => {
    setLoading(true);
    setRefresh(Date.now());
    setTimeout(() => setLoading(false), 500);
  };

  const handleBoardSelect = (board) => {
    setSelectedBoard(board);
    setShowCreateBoard(false);
    triggerRefresh();
  };

  const handleBackToHome = () => {
    setSelectedBoard(null);
    setShowCreateBoard(false);
    triggerRefresh();
  };

  const handleShowCreateBoard = () => {
    setSelectedBoard(null);
    setShowCreateBoard(true);
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
     
      <div className={`w-64 p-4 border-r ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Boards</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <BoardList
          onBoardSelect={handleBoardSelect}
          refreshTrigger={refresh}
          onBoardDeleted={(deletedId) => {
            if (selectedBoard?._id === deletedId) handleBackToHome();
            triggerRefresh();
          }}
          darkMode={darkMode}
        />
      </div>


      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <Loading darkMode={darkMode} />
        ) : selectedBoard ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToHome}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                <FaArrowLeft /> Go to create Board
              </button>
              <h2 className="text-5xl font-bold text-center flex-1">
      {selectedBoard.title}
    </h2>

    <div style={{ width: "180px" }}></div>
  </div>

            <div className={`mb-6 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <CreateTask
                boardId={selectedBoard._id}
                onTaskCreated={triggerRefresh}
                darkMode={darkMode}
              />
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <TaskBoard
                boardId={selectedBoard._id}
                refreshTask={refresh}
                darkMode={darkMode}
              />
            </div>
          </div>
        ) : showCreateBoard ? (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className={`w-full max-w-2xl p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Board</h2>
                <button
                  onClick={handleBackToHome}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  <FaArrowLeft /> Back
                </button>
              </div>
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <CreateBoard
                  onBoardCreated={() => {
                    triggerRefresh();
                    setShowCreateBoard(false);
                  }}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className={`max-w-md p-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}>
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-bold mb-2">No Board Selected</h3>
              <p className="mb-6 text-gray-500">
                Select a board from the sidebar or create a new one to get started
              </p>
              <button
                onClick={handleShowCreateBoard}
                className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
              >
                <FaPlus /> Create New Board
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;