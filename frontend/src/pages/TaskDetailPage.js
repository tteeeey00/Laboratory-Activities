import React, { useState, useEffect } from "react";
import API from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function TaskDetailPage() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/tasks/${id}`).then((res) => setTask(res.data));
  }, [id]);

  const handleUpdate = async () => {
    await API.put(`/tasks/${id}`, task);
    alert("Task updated!");
    navigate("/");
  };

  const handleDelete = async () => {
    await API.delete(`/tasks/${id}`);
    alert("Task deleted!");
    navigate("/");
  };

  if (!task) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h2>Edit Task</h2>

      <input
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <textarea
        style={{ width: "100%", padding: "8px", height: "100px" }}
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />

      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={handleUpdate}
          style={{ padding: "8px 16px", background: "green", color: "#fff", border: "none", borderRadius: "6px" }}
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          style={{ padding: "8px 16px", background: "red", color: "#fff", border: "none", borderRadius: "6px" }}
        >
          Delete
        </button>
        <button
          onClick={() => navigate("/")}
          style={{ padding: "8px 16px", background: "#555", color: "#fff", border: "none", borderRadius: "6px" }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
