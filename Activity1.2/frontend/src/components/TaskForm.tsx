// import React, { useState } from "react";

// export default function TaskForm({ addTask }) {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [error, setError] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!title.trim()) {
//       setError("⚠️ Please enter a task title before adding.");
//       return;
//     }

//     setError("");
//     addTask({ title, description, dueDate });
//     setTitle("");
//     setDescription("");
//     setDueDate("");
//   };

//   return (
//     <form onSubmit={handleSubmit} className="mb-6 space-y-3">
//       {error && (
//         <p className="text-red-500 text-sm font-medium bg-red-100 dark:bg-red-900/40 dark:text-red-300 p-2 rounded-md border border-red-300 dark:border-red-700">
//           {error}
//         </p>
//       )}

//       {/* Title input */}
//       <input
//         type="text"
//         placeholder="Task title"
//         className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 
//                    dark:bg-gray-700 dark:text-white dark:border-gray-600 
//                    hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//       />

//       {/* Description input */}
//       <input
//         placeholder="Description (optional)"
//         className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 
//                    dark:bg-gray-700 dark:text-white dark:border-gray-600 
//                    hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//       />

//       {/* Date input (with 4-digit year limit + adaptive text color) */}
//       <input
//         type="date"
//         min="1900-01-01"
//         max="2099-12-31"
//         className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 
//                    dark:bg-gray-700 dark:text-white dark:border-gray-600 
//                    hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//         value={dueDate}
//         onChange={(e) => {
//           const value = e.target.value;
//           const [year] = value.split("-");
//           if (year && year.length > 4) return; // Prevent typing > 4 digits
//           setDueDate(value);
//         }}
//       />

//       {/* Add Task button */}
//       <button
//         type="submit"
//         className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold shadow-md 
//                   hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 
//                   dark:shadow-[0_0_10px_rgba(59,130,246,0.5)] 
//                   transition-all duration-200"
//       >
//         Add Task
//       </button>

//     </form>
//   );
// }
import React, { useState } from "react";
import { Task } from "../App";

interface TaskFormProps {
  addTask: (task: Omit<Task, "_id">) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ addTask }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("⚠️ Please enter a task title before adding.");
      return;
    }

    setError("");
    addTask({ title, description, dueDate });
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      {error && (
        <p className="text-red-500 text-sm font-medium bg-red-100 dark:bg-red-900/40 dark:text-red-300 p-2 rounded-md border border-red-300 dark:border-red-700">
          {error}
        </p>
      )}

      {/* Title input */}
      <input
        type="text"
        placeholder="Task title"
        className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 
                   dark:bg-gray-700 dark:text-white dark:border-gray-600 
                   hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Description input */}
      <input
        placeholder="Description (optional)"
        className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 
                   dark:bg-gray-700 dark:text-white dark:border-gray-600 
                   hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Date input */}
      <input
        type="date"
        min="1900-01-01"
        max="2099-12-31"
        className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 
                   dark:bg-gray-700 dark:text-white dark:border-gray-600 
                   hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={dueDate}
        onChange={(e) => {
          const value = e.target.value;
          const [year] = value.split("-");
          if (year && year.length > 4) return; // prevent typing > 4 digits
          setDueDate(value);
        }}
      />

      {/* Add button */}
      <button
        type="submit"
        className="bg-blue-600 text-white w-full py-3 rounded-xl font-semibold shadow-md 
                  hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 
                  dark:shadow-[0_0_10px_rgba(59,130,246,0.5)] 
                  transition-all duration-200"
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
