import axios from "./axiosConfig";

// ✅ Get all notes
export const getNotes = async () => {
  const res = await axios.get("/notes");
  return res.data;
};

// ✅ Create a new note
export const createNote = async (noteData: { title: string; content: string }) => {
  const res = await axios.post("/notes", noteData);
  return res.data;
};

// ✅ Update existing note
export const updateNote = async (id: number, noteData: { title: string; content: string }) => {
  const res = await axios.put(`/notes/${id}`, noteData);
  return res.data;
};

// ✅ Delete note
export const deleteNote = async (id: number) => {
  const res = await axios.delete(`/notes/${id}`);
  return res.data;
};
