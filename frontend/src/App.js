import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(''); // State for the date input

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('/api/tasks')
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!title) return;
    // Include dueDate in the POST request
    axios.post('/api/tasks', { title, description, dueDate })
      .then(() => {
        fetchTasks();
        setTitle('');
        setDescription('');
        setDueDate(''); // Reset the date input
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  const deleteTask = (id) => {
    axios.delete(`/api/tasks/${id}`)
      .then(() => fetchTasks())
      .catch((err) => console.error("Error deleting task:", err));
  };

  // The new three-stage toggle logic
  const toggleStatus = (task) => {
    let newStatus;
    if (task.status === 'Not Done') {
      newStatus = 'Doing';
    } else if (task.status === 'Doing') {
      newStatus = 'Done';
    } else { // If status is 'Done'
      newStatus = 'Not Done';
    }

    axios.put(`/api/tasks/${task._id}`, { ...task, status: newStatus })
      .then(() => fetchTasks())
      .catch((err) => console.error("Error updating task:", err));
  };

  // Helper function to format the status class name
  const getStatusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  return (
    <div className="container">
      <h1>Student Task Manager</h1>
      <form onSubmit={addTask}>
        <h2>Add New Task</h2>
        <input type="text" placeholder="Title (required)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit" className="btn-add">Add Task</button>
      </form>
      <h2>My Tasks</h2>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <div>
              <h3>{task.title}</h3>
              <p>{task.description || 'No description'}</p>
              {/* Display the due date if it exists */}
              <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
              <p>Status: <b className={getStatusClass(task.status)}>{task.status}</b></p>
            </div>
            <div className="task-actions">
              <button onClick={() => toggleStatus(task)} className="btn-toggle">Update Status</button>
              <button onClick={() => deleteTask(task._id)} className="btn-delete">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;