import React, { useState } from 'react';
import './App.css';

interface Task {
  text: string;
  priority: string;
  category: string;
  dueDate?: string; // ISO string
  recurrence?: string; // none | daily | weekly | monthly
  completed?: boolean;
  completionDates?: string[]; // dates when user marked complete
}

// Helper to get new Due Date for recurring tasks
function getNextDate(current: string, recurrence: string): string | null {
  const d = new Date(current);
  switch (recurrence) {
    case 'daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    default:
      return null;
  }
  return d.toISOString().split('T')[0];
}

// Get streak for a daily recurring task
function getStreak(dates: string[]) {
  if (!dates.length) return 0;
  const today = new Date();
  let streak = 0;
  // Count back from today
  for (let i = dates.length - 1; i >= 0; --i) {
    const date = new Date(dates[i]);
    const diff = Math.floor((today.getTime() - date.getTime()) / 1000 / 3600 / 24);
    if (diff === streak) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState('');
  const [priorityInput, setPriorityInput] = useState('Medium');
  const [categoryInput, setCategoryInput] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');
  const [recurrenceInput, setRecurrenceInput] = useState('none');

  // Progress stats
  const completedToday = tasks.filter(
    t => t.completed && t.completionDates?.some(date => date === new Date().toISOString().slice(0, 10))
  ).length;
  const totalToday = tasks.filter(
    t => (!t.completed || t.recurrence !== 'none') && (!t.dueDate || t.dueDate === new Date().toISOString().slice(0, 10))
  ).length;

  const addTask = () => {
    if (taskInput) {
      const newTask: Task = {
        text: taskInput,
        priority: priorityInput,
        category: categoryInput,
        dueDate: dueDateInput || undefined,
        recurrence: recurrenceInput,
        completed: false,
        completionDates: [],
      };
      setTasks([...tasks, newTask]);
      setTaskInput('');
      setCategoryInput('');
      setDueDateInput('');
      setRecurrenceInput('none');
    }
  };

  // Mark task complete, record streak, and if recurring, create next!
  const completeTask = (i: number) => {
    setTasks(tasks => {
      const t = tasks[i];
      const todayStr = new Date().toISOString().slice(0, 10);
      const updatedTasks = tasks.slice();
      updatedTasks[i] = { ...t, completed: true, completionDates: [...(t.completionDates || []), todayStr] };
      if (t.recurrence && t.recurrence !== 'none' && t.dueDate) {
        // Schedule new instance
        updatedTasks.push({
          ...t,
          completed: false,
          dueDate: getNextDate(t.dueDate, t.recurrence) || '',
          completionDates: t.completionDates || [],
        });
      }
      return updatedTasks;
    });
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

  // Find the top streak for daily tasks
  const getTopStreak = () => {
    return Math.max(...tasks.filter(t=>t.recurrence==='daily').map(t=>getStreak(t.completionDates||[])), 0)
  };

  return (
    <div>
      <h1>Task Manager</h1>
      {/* Dashboard / Progress Section */}
      <div className="dashboard">
        <p><strong>Tasks Today:</strong> {totalToday}</p>
        <p><strong>Completed Today:</strong> {completedToday}</p>
        <p><strong>Completion %:</strong> {totalToday ? Math.round(100 * completedToday / totalToday) : 0}%</p>
        <p><strong>Longest Daily Streak:</strong> {getTopStreak()} day(s)</p>
      </div>
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
      <select value={recurrenceInput} onChange={e => setRecurrenceInput(e.target.value)}>
        <option value="none">One-time</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
      </select>
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task, index) => {
          const dueStatus = getDueStatus(task.dueDate);
          return (
            <li
              key={index}
              className={`priority-${task.priority.toLowerCase()} ${dueStatus ? dueStatus : ''} ${task.completed ? 'completed' : ''}`.trim()}
            >
              <span>{task.text}</span>
              {task.category ? <span> • {task.category}</span> : null}
              <span> • {task.priority}</span>
              {task.dueDate && (
                <span>
                  {' • '}Due: {task.dueDate}
                  {dueStatus === 'overdue' ? <span className="overdue"> (Overdue!)</span> : null}
                  {dueStatus === 'upcoming' ? <span className="upcoming"> (Due Soon)</span> : null}
                </span>
              )}
              {task.recurrence && task.recurrence !== 'none' ? (
                <span> • {task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1)} Task</span>
              ) : null}
              {/* Streak (only for daily recurring tasks) */}
              {task.recurrence === 'daily' ? (
                <span> • Streak: {getStreak(task.completionDates || [])} days</span>
              ) : null}
              {!task.completed && <button onClick={() => completeTask(index)}>Mark Complete</button>}
              {task.completed && <span className="completed"> (Complete)</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App;