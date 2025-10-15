import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function TodoListPage() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  // Load tasks
  useEffect(() => {
    API.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  // Add task
  const addTask = async () => {
    if (!title) return;
    const res = await API.post("/tasks", { title, description });
    setTasks([...tasks, res.data]);
    setTitle("");
    setDescription("");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center" }}>To-Do List</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          style={{ flex: 1, padding: "8px" }}
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={{ flex: 1, padding: "8px" }}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          onClick={addTask}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task._id}
            onClick={() => navigate(`/task/${task._id}`)}
            style={{
              background: "#f9f9f9",
              padding: "10px 15px",
              marginBottom: "10px",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <strong>{task.title}</strong>
            <p style={{ margin: 0, color: "#555" }}>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
