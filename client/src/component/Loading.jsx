const Loading = ({ darkMode }) => {
  return (
    <div className="flex justify-center items-center h-32">
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
    </div>
  );
};

export default Loading;