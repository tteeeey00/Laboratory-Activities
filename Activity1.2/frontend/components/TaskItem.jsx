import React, { useState } from "react";

export default function TaskItem({ task, index, updateTask, deleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [done, setDone] = useState(false);

  const handleSave = () => {
    updateTask(index, { title, description });
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-md flex flex-col transition-transform duration-200
      hover:scale-105 ${done ? "opacity-60 line-through" : ""}`}
    >
      {isEditing ? (
        <>
          <input
            className="border p-2 rounded mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border p-2 rounded mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 transition"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <input
              type="checkbox"
              className="w-5 h-5"
              checked={done}
              onChange={() => setDone(!done)}
            />
          </div>
          {task.description && <p className="text-gray-600 mt-1">{task.description}</p>}
          <div className="mt-3 flex gap-2 justify-end">
            <button
              className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              onClick={() => deleteTask(index)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
