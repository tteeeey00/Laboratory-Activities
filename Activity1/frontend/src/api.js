const API_URL = "http://localhost:5000/tasks";

export const getTasks = async () => {
  const res = await fetch(API_URL);
  return await res.json();
};

export const addTask = async (task) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return await res.json();
};

export const updateTask = async (id, task) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return await res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  return await res.json();
};
