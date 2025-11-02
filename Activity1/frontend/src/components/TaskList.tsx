// import React, { useState } from "react";
// import TaskDetails from "./TaskDetails";

// export default function TaskList({ tasks, toggleDone, onUpdate, onDelete }) {
//   const [selectedTask, setSelectedTask] = useState(null);

//   const getDueStatus = (dueDate) => {
//     if (!dueDate) return { color: "border-gray-300", text: "No due date" };
//     const today = new Date();
//     const due = new Date(dueDate);
//     const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

//     if (diff < 0) return { color: "border-red-400", text: "Overdue" };
//     if (diff <= 3) return { color: "border-yellow-400", text: `${diff} days left` };
//     return { color: "border-green-400", text: `${diff} days left` };
//   };

//   return (
//     <>
//       <ul className="space-y-3">
//         {tasks.length === 0 ? (
//           <p className="text-center text-gray-500 dark:text-gray-400 italic">
//             No tasks yet — add one above ☝️
//           </p>
//         ) : (
//           tasks.map((task) => {
//             const status = getDueStatus(task.dueDate);
//             return (
//               <li
//                 key={task._id}
//                 className={`p-4 rounded-xl border ${status.color} bg-gray-50 dark:bg-gray-700 flex justify-between items-center hover:shadow-lg transition cursor-pointer`}
//                 onClick={(e) => {
//                   if (e.target.type !== "checkbox") setSelectedTask(task);
//                 }}
//               >
//                 {/* Left side (text) */}
//                 <div className="flex-1 mr-4">
//                   <h3
//                     className={`font-semibold text-lg ${
//                       task.done
//                         ? "line-through text-gray-400 dark:text-gray-400"
//                         : "text-gray-800 dark:text-white"
//                     }`}
//                   >
//                     {task.title}
//                   </h3>
//                   {task.description && (
//                     <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                       {task.description}
//                     </p>
//                   )}
//                   {task.dueDate && (
//                     <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
//                       Due: {new Date(task.dueDate).toLocaleDateString()} • {status.text}
//                     </p>
//                   )}
//                 </div>

//                 {/* Right side (checkbox) */}
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={task.done || false}
//                     onChange={(e) => toggleDone(task._id, e.target.checked)}
//                     className="w-5 h-5 accent-blue-600 cursor-pointer"
//                   />
//                 </div>
//               </li>
//             );
//           })
//         )}
//       </ul>

//       {selectedTask && (
//         <TaskDetails
//           task={selectedTask}
//           onUpdate={(updatedTask) => {
//             onUpdate(updatedTask);
//             setSelectedTask(null);
//           }}
//           onDelete={(taskId) => {
//             onDelete(taskId);
//             setSelectedTask(null);
//           }}
//           onClose={() => setSelectedTask(null)}
//         />
//       )}
//     </>
//   );
// }
import React, { useState } from "react";
import TaskDetails from "./TaskDetails";

// ✅ Define the Task interface
export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  done?: boolean;
}

// ✅ Define props interface
interface TaskListProps {
  tasks: Task[];
  toggleDone: (taskId: string, done: boolean) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  toggleDone,
  onUpdate,
  onDelete,
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const getDueStatus = (dueDate?: string) => {
    if (!dueDate) return { color: "border-gray-300", text: "No due date" };
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { color: "border-red-400", text: "Overdue" };
    if (diff <= 3) return { color: "border-yellow-400", text: `${diff} days left` };
    return { color: "border-green-400", text: `${diff} days left` };
  };

  return (
    <>
      <ul className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 italic">
            No tasks yet — add one above ☝️
          </p>
        ) : (
          tasks.map((task) => {
            const status = getDueStatus(task.dueDate);
            return (
              <li
                key={task._id}
                className={`p-4 rounded-xl border ${status.color} bg-gray-50 dark:bg-gray-700 flex justify-between items-center hover:shadow-lg transition cursor-pointer`}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (target.tagName !== "INPUT") setSelectedTask(task);
                }}
              >
                {/* Left side (text) */}
                <div className="flex-1 mr-4">
                  <h3
                    className={`font-semibold text-lg ${
                      task.done
                        ? "line-through text-gray-400 dark:text-gray-400"
                        : "text-gray-800 dark:text-white"
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {task.description}
                    </p>
                  )}

                  {task.dueDate && (
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                      Due: {new Date(task.dueDate).toLocaleDateString()} • {status.text}
                    </p>
                  )}
                </div>

                {/* Right side (checkbox) */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!task.done}
                    onChange={(e) => toggleDone(task._id, e.target.checked)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </div>
              </li>
            );
          })
        )}
      </ul>

      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onUpdate={(updatedTask) => {
            onUpdate(updatedTask);
            setSelectedTask(null);
          }}
          onDelete={(taskId) => {
            onDelete(taskId);
            setSelectedTask(null);
          }}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
};

export default TaskList;
