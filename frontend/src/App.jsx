import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

export default function App() {
  const [tasks, setTasks] = useState([]);

  // Load tasks from backend
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  const addTask = async (task) => {
    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const newTask = await res.json();
      setTasks([...tasks, newTask]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = async (index, updatedTask) => {
    const task = tasks[index];
    try {
      const res = await fetch(`http://localhost:5000/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      const updated = await res.json();
      const newTasks = [...tasks];
      newTasks[index] = updated;
      setTasks(newTasks);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (index) => {
    const task = tasks[index];
    try {
      await fetch(`http://localhost:5000/tasks/${task._id}`, {
        method: "DELETE",
      });
      setTasks(tasks.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-blue-50 to-blue-100">
      <h1 className="text-5xl font-bold mb-6 text-blue-600 drop-shadow-lg">
        To-Do List
      </h1>
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-xl">
        <TaskForm addTask={addTask} />
        <TaskList tasks={tasks} updateTask={updateTask} deleteTask={deleteTask} />
      </div>
    </div>
  );
}
