import React, { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

interface Note {
  id?: number;
  title: string;
  content: string;
}

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  refreshNotes: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ isOpen, onClose, note, refreshNotes }) => {
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    if (note) setFormData({ title: note.title, content: note.content });
    else setFormData({ title: "", content: "" });
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (note) await axios.put(`/notes/${note.id}`, formData);
      else await axios.post("/notes", formData);
      refreshNotes();
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{note ? "Edit Note" : "Add Note"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <textarea
            placeholder="Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full border rounded-md p-2 h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            required
          ></textarea>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
            >
              {note ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
