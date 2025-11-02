// import React, { useState } from "react";

// export default function TaskDetails({ task, onUpdate, onDelete, onClose }) {
//   const [title, setTitle] = useState(task.title);
//   const [description, setDescription] = useState(task.description);
//   const [dueDate, setDueDate] = useState(task.dueDate);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onUpdate({ ...task, title, description, dueDate });
//     onClose();
//   };

//   const handleDelete = () => {
//     onDelete(task._id);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-all">
//       <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-5">
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
//             ✏️ Edit Task
//           </h2>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block mb-1 text-gray-600 dark:text-gray-300 text-sm font-medium">
//               Title
//             </label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-600 dark:text-gray-300 text-sm font-medium">
//               Description
//             </label>
//             <input
//               type="text"
//               className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="block mb-1 text-gray-600 dark:text-gray-300 text-sm font-medium">
//               Due Date
//             </label>
//             <input
//               type="date"
//               className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
//               value={dueDate ? dueDate.slice(0, 10) : ""}
//               onChange={(e) => setDueDate(e.target.value)}
//               required
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-between gap-3 mt-4">
//             <button
//               type="submit"
//               className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold
//                         hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 
//                         dark:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-200"
//             >
//               Update
//             </button>

//             <button
//               type="button"
//               onClick={() => onDelete(task._id)}
//               className="flex-1 bg-red-600 text-white py-2 rounded-xl font-semibold
//                         hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400
//                         dark:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-200"
//             >
//               Delete
//             </button>

//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 bg-gray-400 text-white py-2 rounded-xl font-semibold
//                         hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500
//                         dark:shadow-[0_0_10px_rgba(156,163,175,0.4)] transition-all duration-200"
//             >
//               Cancel
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Task } from "./TaskList"; // ✅ Reuse Task interface from TaskList

interface TaskDetailsProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onClose: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description || "");
  const [dueDate, setDueDate] = useState<string>(task.dueDate || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...task, title, description, dueDate });
    onClose();
  };

  const handleDelete = () => {
    onDelete(task._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-all">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            ✏️ Edit Task
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-300 text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-300 text-sm font-medium">
              Description
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block mb-1 text-gray-600 dark:text-gray-300 text-sm font-medium">
              Due Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              value={dueDate ? dueDate.slice(0, 10) : ""}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-3 mt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold
                        hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 
                        dark:shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-200"
            >
              Update
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-2 rounded-xl font-semibold
                        hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400
                        dark:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-200"
            >
              Delete
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 text-white py-2 rounded-xl font-semibold
                        hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500
                        dark:shadow-[0_0_10px_rgba(156,163,175,0.4)] transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskDetails;
