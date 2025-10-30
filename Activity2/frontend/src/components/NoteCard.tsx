import React from "react";

interface Note {
  id: number;
  title: string;
  content: string;
}

interface Props {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteCard: React.FC<Props> = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{note.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{note.content}</p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onEdit}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
