import React from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'home' | 'school';
  createdAt?: string;
  updatedAt?: string;
}

interface Props {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

const NoteCard: React.FC<Props> = ({ note, onEdit, onDelete }) => {
  // Define category colors
  const categoryColors = {
    personal: 'bg-[#A78BFA]', // Purple
    home: 'bg-[#93C5FD]',     // Blue
    school: 'bg-[#F97316]'    // Orange
  };

  // Use the category directly from the note
  const category = note.category as keyof typeof categoryColors;
  const categoryColor = categoryColors[category];

  const formattedDate = note.updatedAt 
    ? new Date(note.updatedAt).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/30 rounded-lg shadow-sm group relative transition-transform duration-300 ease-out hover:shadow-2xl hover:-translate-y-1">
      <div className="p-4">
        {/* Category Label */}
        <div className="flex items-center justify-between mb-3">
          <span className={`${categoryColor} text-white text-xs px-2 py-1 rounded-full capitalize`}>
            {category}
          </span>
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>

        {/* Content */}
        <h3 className="text-gray-900 font-medium mb-2 line-clamp-2">{note.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{note.content}</p>

  {/* Action Buttons */}
  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
