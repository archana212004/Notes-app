import React from 'react';

const NoteCard = ({ note, onEdit, onDelete, onPin }) => {
    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-4 ${note.isPinned ? 'border-2 border-purple-500' : ''}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800 flex-grow pr-2">
                    {note.title}
                </h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onPin(note._id)}
                        className={`p-1 rounded-full hover:bg-gray-100 transition-colors duration-200
                            ${note.isPinned ? 'text-purple-600' : 'text-gray-400'}`}
                        title={note.isPinned ? "Unpin note" : "Pin note"}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className="text-gray-600 whitespace-pre-wrap">
                    {note.content}
                </p>
            </div>

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-600 text-sm rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{formatDate(note.createdOn)}</span>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(note)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(note._id)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
