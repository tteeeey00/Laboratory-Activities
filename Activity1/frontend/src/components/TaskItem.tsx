// import React from "react";

// export default function TaskItem({ task, onDelete, onUpdate, onToggle }) {
//   return (
//     <div
//       className={`p-4 rounded-xl shadow-md transition transform hover:scale-[1.01] ${
//         task.done
//           ? "bg-green-100 dark:bg-green-900"
//           : "bg-white dark:bg-gray-800"
//       }`}
//     >
//       <div className="flex justify-between items-center">
//         <div>
//           <h3
//             className={`text-lg font-semibold ${
//               task.done ? "line-through text-gray-500" : ""
//             }`}
//           >
//             {task.title}
//           </h3>
//           <p className="text-sm text-gray-600 dark:text-gray-300">
//             {task.description}
//           </p>
//           {task.dueDate && (
//             <p className="text-xs mt-1 text-gray-500">
//               Due: {new Date(task.dueDate).toLocaleDateString()}
//             </p>
//           )}
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={task.done}
//             onChange={() => onToggle(task)}
//             className="w-5 h-5 accent-blue-600 cursor-pointer"
//           />
//           <button
//             onClick={() => onUpdate(task)}
//             className="px-2 py-1 text-sm bg-yellow-400 rounded hover:bg-yellow-500 transition"
//           >
//             Edit
//           </button>
//           <button
//             onClick={() => onDelete(task._id)}
//             className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Task } from "../types";

interface Props {
  task: Task;
  onOpen: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export default function TaskItem({ task, onOpen, onToggle }: Props) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-sm p-4 flex items-start justify-between gap-4 hover:shadow-md transition">
      <div className="flex-1" onClick={() => onOpen(task)}>
        <div className="flex items-center justify-between gap-4">
          <h3 className={`font-semibold ${task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>
            {task.title}
          </h3>
        </div>

        {task.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{task.description}</p>}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Due: {task.dueDate ? task.dueDate.slice(0,10) : "N/A"}</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed ?? false}
          onChange={(e) => { e.stopPropagation(); onToggle(task); }}
          className="w-5 h-5 accent-blue-600"
        />
      </div>
    </div>
  );
}
