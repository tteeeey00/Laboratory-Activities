import React, { useState } from "react";

export default function TaskForm({ addTask }) {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    addTask({ title: task, description });
    setTask("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        placeholder="Task title"
        className="w-full mb-2 p-2 border rounded"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <input
        placeholder="Description (optional)"
        className="w-full mb-2 p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
}
