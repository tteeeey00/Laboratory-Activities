import React from "react";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, updateTask, deleteTask }) {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks yet.</p>
      ) : (
        tasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            index={index}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ))
      )}
    </div>
  );
}
