import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import './App.css';

const API_URL = "http://localhost:5000/tasks"; // adjust if your backend differs

// ------------------------------
// Home Page (Add Task + List)
// ------------------------------
function TodoList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await axios.post(API_URL, { title, description });
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const openTask = (id) => {
    navigate(`/task/${id}`);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">📝 To-Do List</h1>
      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} onClick={() => openTask(task._id)}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ------------------------------
// Task Detail Page
// ------------------------------
function TaskDetail({ id }) {
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/${id}`).then((res) => {
      setTask(res.data);
      setTitle(res.data.title);
      setDescription(res.data.description);
    });
  }, [id]);

  const updateTask = async () => {
    await axios.put(`${API_URL}/${id}`, { title, description });
    navigate("/");
  };

  const deleteTask = async () => {
    await axios.delete(`${API_URL}/${id}`);
    navigate("/");
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <h1>Edit Task</h1>
      <div className="task-detail">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <div className="task-actions">
          <button onClick={updateTask}>💾 Save</button>
          <button className="delete-btn" onClick={deleteTask}>
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------------
// Router Wrapper
// ------------------------------
function TaskPageWrapper() {
  const id = window.location.pathname.split("/").pop();
  return <TaskDetail id={id} />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoList />} />
        <Route path="/task/:id" element={<TaskPageWrapper />} />
      </Routes>
    </Router>
  );
}
