import React, { useEffect, useState } from "react";
import { getNotes, createNote, updateNote, deleteNote } from "../api/notesApi";
import NoteCard from "../components/NoteCard";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmDialog from "../components/ConfirmDialog";
import UserProfileDropdown from "../components/UserProfileDropdown";

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'home' | 'school';
  createdAt?: string;
  updatedAt?: string;
}

const NotesDashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [noteData, setNoteData] = useState<{ title: string; content: string; category: Note['category'] }>({
    title: "",
    content: "",
    category: "personal"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "personal" | "home" | "school">("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [userInfo, setUserInfo] = useState({
    email: localStorage.getItem('userEmail') || '',
    name: localStorage.getItem('userName') || 'User'
  });

  // Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        // Normalize IDs and ensure category exists (backend may return `_id` or omit category)
        const normalized = (data || []).map((n: any) => ({
          ...n,
          id: String(n.id ?? n._id),
          category: n.category ?? 'personal',
        }));
        setNotes(normalized);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const openModal = (note?: Note) => {
    if (note) {
      setIsEditing(true);
      setCurrentNote(note);
      setNoteData({
        title: note.title,
        content: note.content,
        category: note.category
      });
    } else {
      setIsEditing(false);
      setNoteData({
        title: "",
        content: "",
        category: "personal"
      });
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
        // Ensure ID is a string when calling API (backend may expect string IDs)
        const updated = await updateNote(currentNote.id, {
          ...noteData,
          category: noteData.category,
        });
        // normalize returned note and update state; ensure category preserved
        const normalizedUpdated = { ...updated, id: String(updated.id), category: noteData.category };
        setNotes((prev) => prev.map((n) => (n.id === normalizedUpdated.id ? normalizedUpdated : n)));
      } else {
        const newNote = await createNote({ ...noteData, category: noteData.category });
        // backend may not echo category back; ensure we keep it in local state
        const normalizedNew = { ...newNote, id: String(newNote.id ?? newNote._id), category: noteData.category };
        setNotes((prev) => [...prev, normalizedNew]);
      }
      closeModal();
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const confirmDelete = (note: any) => {
    setNoteToDelete(note);
    setShowDeleteDialog(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!id) {
      console.error("No note id provided for deletion");
      return;
    }

    try {
      // Convert id to string for API call to avoid type mismatches
      const idStr = String(id);
      console.log('Deleting note with id:', idStr); // Debug log
      await deleteNote(idStr);
      
      setNotes((prev) => {
        const filtered = prev.filter((note) => note.id !== idStr);
        console.log('Notes after deletion:', filtered); // Debug log
        return filtered;
      });
      
      setShowDeleteDialog(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error("Error deleting note:", error);
      // You might want to show an error toast/notification here
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex flex-col">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <span className="text-2xl text-white">📝</span>
                <h2 className="text-2xl font-bold text-white">Notes App</h2>
              </div>
            </div>
            
            <div className="flex items-center">
              <UserProfileDropdown
                userEmail={userInfo.email}
                userName={userInfo.name}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Tabs and Search Bar */}
        <div className="flex flex-col space-y-4">
          {/* Category Tabs and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-3 pb-2 text-sm font-medium transition-all ${
                  selectedCategory === "all"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                <span>ALL</span>
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {notes.length}
                </span>
              </button>
              <button 
                onClick={() => setSelectedCategory("personal")}
                className={`flex items-center gap-3 pb-2 text-sm font-medium transition-all ${
                  selectedCategory === "personal"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
                <span>PERSONAL</span>
                <span className="ml-2 text-xs bg-[#A78BFA]/10 text-[#A78BFA] px-2 py-0.5 rounded-full">
                  {notes.filter(note => note.category === 'personal').length}
                </span>
              </button>
              <button 
                onClick={() => setSelectedCategory("home")}
                className={`flex items-center gap-3 pb-2 text-sm font-medium transition-all ${
                  selectedCategory === "home"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#93C5FD]" />
                <span>HOME</span>
                <span className="ml-2 text-xs bg-[#93C5FD]/10 text-[#93C5FD] px-2 py-0.5 rounded-full">
                  {notes.filter(note => note.category === 'home').length}
                </span>
              </button>
              <button 
                onClick={() => setSelectedCategory("school")}
                className={`flex items-center gap-3 pb-2 text-sm font-medium transition-all ${
                  selectedCategory === "school"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                <span>SCHOOL</span>
                <span className="ml-2 text-xs bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded-full">
                  {notes.filter(note => note.category === 'school').length}
                </span>
              </button>
            </div>
          </div>

          {/* Search Bar and Add Button */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="flex-grow px-8 pb-10 max-w-7xl mx-auto">
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 p-6 rounded-2xl h-[200px] flex flex-col">
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="space-y-2 flex-grow">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="flex space-x-2">
                      <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                      <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center mt-20">
            <div className="mx-auto h-32 w-32 bg-gray-50 rounded-full flex items-center justify-center">
              {selectedCategory === "all" ? (
                <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              ) : selectedCategory === "personal" ? (
                <svg className="h-16 w-16 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ) : selectedCategory === "home" ? (
                <svg className="h-16 w-16 text-[#93C5FD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              ) : (
                <svg className="h-16 w-16 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              {selectedCategory === "all" 
                ? "No notes yet" 
                : `No ${selectedCategory} notes yet`}
            </h3>
            <p className="mt-2 text-gray-500">
              {selectedCategory === "all"
                ? "Get started by creating your first note!"
                : `Create your first ${selectedCategory} note to get started`}
            </p>
            <button
              onClick={() => {
                setNoteData(prev => ({ ...prev, category: selectedCategory === "all" ? "personal" : selectedCategory }));
                openModal();
              }}
              className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                text-white px-6 py-3 rounded-xl shadow-md transition-all inline-flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create {selectedCategory === "all" ? "Note" : `${selectedCategory} Note`}</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {notes
              .filter(note => {
                const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
                const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    note.content.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
              })
              .map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Use NoteCard component and pass handlers so onEdit/onDelete are defined */}
                <NoteCard
                  note={note}
                  onEdit={() => openModal(note)}
                  onDelete={() => confirmDelete(note)}
                />
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

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setNoteData({ ...noteData, category: 'personal' })}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                      noteData.category === 'personal'
                        ? 'border-[#A78BFA] bg-[#A78BFA]/10 text-[#A78BFA]'
                        : 'border-gray-200 hover:border-[#A78BFA]/50'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#A78BFA] mr-2"></span>
                      Personal
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteData({ ...noteData, category: 'home' })}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                      noteData.category === 'home'
                        ? 'border-[#93C5FD] bg-[#93C5FD]/10 text-[#93C5FD]'
                        : 'border-gray-200 hover:border-[#93C5FD]/50'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#93C5FD] mr-2"></span>
                      Home
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteData({ ...noteData, category: 'school' })}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all ${
                      noteData.category === 'school'
                        ? 'border-[#F97316] bg-[#F97316]/10 text-[#F97316]'
                        : 'border-gray-200 hover:border-[#F97316]/50'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-[#F97316] mr-2"></span>
                      School
                    </div>
                  </button>
                </div>
              </div>

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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setNoteToDelete(null);
        }}
        onConfirm={() => noteToDelete && handleDelete(noteToDelete.id)}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
      />
    </div>
  );
};

export default NotesDashboard;
