import React, { useState } from 'react';
import './App.css'; // Importing the CSS styles

const App = () => {
  // State variables for task management
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');

  // State variables for timer
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Function to add a new task
  const addTask = () => {
    if (taskInput) {
      setTasks([...tasks, taskInput]);
      setTaskInput('');
    }
  };

  // Function to start and stop the timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  // Effect to manage timer
  React.useEffect(() => {
    let interval;
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <div className="timer">
          <h2>Timer: {time} seconds</h2>
          <button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</button>
        </div>
      </header>
      <main className="main-content">
        <div className="task-input">
          <input 
            type="text" 
            value={taskInput} 
            onChange={(e) => setTaskInput(e.target.value)} 
            placeholder="Add a new task..." 
          />
          <button onClick={addTask}>Add Task</button>
        </div>
        <ul className="task-list">
          {tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default App;