import React, { useState } from 'react';
import './App.css';

interface Task {
  text: string;
  priority: string;
  category: string;
  dueDate?: string; // ISO string
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('Medium');
  const [categoryInput, setCategoryInput] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');

  const addTask = () => {
    if (taskInput) {
      const newTask: Task = {
        text: taskInput,
        priority: priorityInput,
        category: categoryInput,
        dueDate: dueDateInput || undefined,
      };
      setTasks([...tasks, newTask]);
      setTaskInput('');
      setCategoryInput('');
      setDueDateInput('');
    }
  };

  // Helper: Get if task is overdue or upcoming
  const getDueStatus = (dueDate?: string) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    if (due < now) return 'overdue';
    const hoursDiff = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursDiff < 24 ? 'upcoming' : null;
  };

  // Placeholder: automated reminders for soon due tasks
  // In production, use Electron Notifications or native alerts

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
      <input
        type="date"
        value={dueDateInput}
        onChange={e => setDueDateInput(e.target.value)}
        placeholder="Due date"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task, index) => {
          const dueStatus = getDueStatus(task.dueDate);
          return (
            <li
              key={index}
              className={`priority-${task.priority.toLowerCase()} ${dueStatus ? dueStatus : ''}`.trim()}
            >
              <span>{task.text}</span>
              {task.category ? <span> • {task.category}</span> : null}
              <span> • </span>
              <span>{task.priority}</span>
              {task.dueDate && (
                <span>
                  {' • '}Due: {task.dueDate}
                  {dueStatus === 'overdue' ? <span className="overdue"> (Overdue!)</span> : null}
                  {dueStatus === 'upcoming' ? <span className="upcoming"> (Due Soon)</span> : null}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;