import axios, { AxiosError } from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/notes",
});

// Automatically attach JWT token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

// ✅ Fetch all notes
export const getNotes = async () => {
  const res = await API.get("/");
  return res.data;
};

// ✅ Create new note (accept category too)
export interface NotePayload {
  title: string;
  content: string;
  category?: string;
}
export const createNote = async (noteData: NotePayload) => {
  const res = await API.post("/", noteData);
  return res.data;
};

// ✅ Update note (accept category too)
export const updateNote = async (id: string, noteData: NotePayload) => {
  const res = await API.put(`/${id}`, noteData);
  return res.data;
};

// ✅ Delete note (corrected endpoint)
export const deleteNote = async (id: string) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};

export default API;