// import React, { useState, useEffect } from "react";
// import TaskForm from "./components/TaskForm";
// import TaskList from "./components/TaskList";
// import DarkModeToggle from "./components/DarkModeToggle";

// export default function App() {
//   const [tasks, setTasks] = useState([]);
//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem("theme") === "dark"
//   );

//   const API_URL = "http://localhost:3000/tasks";

//   // ✅ Toggle dark mode
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   }, [darkMode]);

//   // ✅ Fetch tasks
//   useEffect(() => {
//     fetch(API_URL)
//       .then((res) => res.json())
//       .then((data) => setTasks(data))
//       .catch((err) => console.error("Fetch error:", err));
//   }, []);

//   const addTask = async (task) => {
//     if (!task.title.trim()) {
//       alert("⚠️ Please enter a title before adding a task.");
//       return;
//     }

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(task),
//       });
//       const newTask = await res.json();
//       setTasks((prev) => [...prev, newTask]);
//     } catch (err) {
//       console.error("Add error:", err);
//     }
//   };

//   const handleUpdate = async (updatedTask) => {
//     try {
//       const res = await fetch(`${API_URL}/${updatedTask._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedTask),
//       });
//       const data = await res.json();
//       setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
//     } catch (err) {
//       console.error("Update error:", err);
//     }
//   };

//   const handleDelete = async (taskId) => {
//     try {
//       await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
//       setTasks((prev) => prev.filter((t) => t._id !== taskId));
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   const toggleDone = async (taskId, done) => {
//     try {
//       const res = await fetch(`${API_URL}/${taskId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ done }),
//       });
//       const updated = await res.json();
//       setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
//     } catch (err) {
//       console.error("Toggle error:", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-blue-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
//       <div className="flex flex-col items-center p-6">
//         {/* Header */}
//         <div className="w-full max-w-xl flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-extrabold">📝 To-Do List</h1>
//           <DarkModeToggle />

//         </div>

//         {/* Task Container */}
//         <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-colors duration-500">
//           <TaskForm addTask={addTask} />
//           <TaskList
//             tasks={tasks}
//             toggleDone={toggleDone}
//             onUpdate={handleUpdate}
//             onDelete={handleDelete}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import DarkModeToggle from "./components/DarkModeToggle";

// 🧩 Define the Task type (you can also move this to a separate `types.ts` file)
export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  done?: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );

  const API_URL = "http://localhost:5000/tasks";

  // ✅ Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ✅ Fetch tasks
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // ✅ Add new task
  const addTask = async (task: Omit<Task, "_id">) => {
    if (!task.title.trim()) {
      alert("⚠️ Please enter a title before adding a task.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const newTask: Task = await res.json();
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error("Add error:", err);
    }
  };

  // ✅ Update task
  const handleUpdate = async (updatedTask: Task) => {
    try {
      const res = await fetch(`${API_URL}/${updatedTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      const data: Task = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ✅ Delete task
  const handleDelete = async (taskId: string) => {
    try {
      await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Toggle done status
  const toggleDone = async (taskId: string, done: boolean) => {
    try {
      const res = await fetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done }),
      });
      const updated: Task = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-300 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="flex flex-col items-center p-6">
        {/* Header */}
        <div className="w-full max-w-xl flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold">📝 To-Do List</h1>
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>

        {/* Task Container */}
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition-colors duration-500">
          <TaskForm addTask={addTask} />
          <TaskList
            tasks={tasks}
            toggleDone={toggleDone}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
