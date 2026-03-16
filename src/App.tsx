import React, { useState } from 'react';
import './App.css';

interface Task {
  text: string;
  priority: string;
  category: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('Medium');
  const [categoryInput, setCategoryInput] = useState('');

  const addTask = () => {
    if (taskInput) {
      const newTask: Task = {
        text: taskInput,
        priority: priorityInput,
        category: categoryInput,
      };
      setTasks([...tasks, newTask]);
      setTaskInput('');
      setCategoryInput('');
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <input
        type="text"
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Add a task"
      />
      <select onChange={(e) => setPriorityInput(e.target.value)} value={priorityInput}>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <input
        type="text"
        value={categoryInput}
        onChange={(e) => setCategoryInput(e.target.value)}
        placeholder="Category"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className={`priority-${task.priority.toLowerCase()}`}>{task.text} - {task.category} - <span>{task.priority}</span></li>
        ))}
      </ul>
    </div>
  );
};

export default App;