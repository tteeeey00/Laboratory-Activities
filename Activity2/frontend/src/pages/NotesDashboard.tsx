import React, { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../api/notesApi";
import NoteCard from "../components/NoteCard";
import { motion, AnimatePresence } from "framer-motion";

const NotesDashboard: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<any | null>(null);
  const [noteData, setNoteData] = useState({ title: "", content: "" });

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const openModal = (note?: any) => {
    if (note) {
      setIsEditing(true);
      setCurrentNote(note);
      setNoteData({ title: note.title, content: note.content });
    } else {
      setIsEditing(false);
      setNoteData({ title: "", content: "" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentNote(null);
  };

  const handleSave = async () => {
    if (!noteData.title.trim() || !noteData.content.trim()) return;

    try {
      if (isEditing && currentNote) {
        const updated = await updateNote(currentNote.id, noteData);
        setNotes((prev) =>
          prev.map((n) => (n.id === updated.id ? updated : n))
        );
      } else {
        const newNote = await createNote(noteData);
        setNotes((prev) => [...prev, newNote]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col">
      {/* Header Section */}
      <div className="flex justify-between items-center px-8 py-6">
        <h2 className="text-3xl font-bold text-gray-800">My Notes</h2>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition-all"
        >
          + Add Note
        </button>
      </div>

      {/* Notes Section */}
      <div className="flex-grow px-8 pb-10">
        {loading ? (
          <p className="text-gray-600">Loading notes...</p>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p>No notes yet. Start by adding one!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="backdrop-blur-md bg-white/70 border border-gray-200 rounded-xl shadow-md p-4 hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    {note.title}
                  </h3>
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => openModal(note)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 w-[90%] sm:w-[450px] backdrop-blur-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                {isEditing ? "Edit Note" : "Add Note"}
              </h2>

              <input
                type="text"
                placeholder="Title"
                value={noteData.title}
                onChange={(e) =>
                  setNoteData({ ...noteData, title: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <textarea
                placeholder="Content"
                value={noteData.content}
                onChange={(e) =>
                  setNoteData({ ...noteData, content: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 h-28 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
              ></textarea>

              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesDashboard;
